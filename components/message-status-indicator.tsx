"use client"
import React, { useState, useEffect } from 'react'
import { Check, CheckCheck, Clock, Eye, Send, AlertCircle } from 'lucide-react'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { getRegisteredUser } from '@/lib/firebase'

interface MessageStatusIndicatorProps {
  messageStatus: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  readCount?: number
  timestamp?: number
  readByUsers?: string[]
  readByTimestamps?: { [userId: string]: number }
  showTooltip?: boolean
}

export default function MessageStatusIndicator({
  messageStatus,
  readCount = 0,
  timestamp,
  readByUsers = [],
  readByTimestamps = {},
  showTooltip = true
}: MessageStatusIndicatorProps) {
  
  const [readByUserDetails, setReadByUserDetails] = useState<Array<{name: string, time: number}>>([])

  // Convert user IDs to user names with timestamps
  useEffect(() => {
    const resolveUserDetails = async () => {
      if (readByUsers.length === 0) {
        setReadByUserDetails([])
        return
      }

      try {
        const userDetails: Array<{name: string, time: number}> = []
        for (const userId of readByUsers) {
          try {
            const user = await getRegisteredUser(userId)
            const readTime = readByTimestamps[userId] || Date.now()
            
            if (user && user.dn) {
              userDetails.push({ 
                name: user.dn, // dn is the shortened displayName field
                time: readTime
              })
            } else {
              // Fallback: extract username from ID or show partial ID
              const cleanId = userId.replace(/^user_\d+_/, '').substring(0, 8)
              userDetails.push({ 
                name: `User_${cleanId}`,
                time: readTime
              })
            }
          } catch (error) {
            // Fallback for any error
            const cleanId = userId.replace(/^user_\d+_/, '').substring(0, 8)
            const readTime = readByTimestamps[userId] || Date.now()
            userDetails.push({ 
              name: `User_${cleanId}`,
              time: readTime
            })
          }
        }
        
        // Sort by read time (most recent first)
        userDetails.sort((a, b) => b.time - a.time)
        setReadByUserDetails(userDetails)
      } catch (error) {
        console.error('[MessageStatus] Error resolving user details:', error)
        // Fallback: show cleaned up user IDs with current time
        const fallbackDetails = readByUsers.map(id => {
          const cleanId = id.replace(/^user_\d+_/, '').substring(0, 8)
          const readTime = readByTimestamps[id] || Date.now()
          return { 
            name: `User_${cleanId}`,
            time: readTime
          }
        })
        setReadByUserDetails(fallbackDetails)
      }
    }

    resolveUserDetails()
  }, [readByUsers, readByTimestamps])
  
  const getStatusConfig = () => {
    switch (messageStatus) {
      case 'sending':
        return {
          icon: <Clock className="w-4 h-4 text-gray-400 animate-pulse" />,
          text: 'Sending...',
          color: 'text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        }
      case 'sent':
        return {
          icon: <Check className="w-4 h-4 text-gray-500" />,
          text: 'Sent',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        }
      case 'delivered':
        return {
          icon: <CheckCheck className="w-4 h-4 text-blue-500" />,
          text: 'Delivered',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        }
      case 'read':
        if (readCount > 1) {
          return {
            icon: <Eye className="w-4 h-4 text-green-500" />,
            text: `Read by ${readCount} people`,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
          }
        }
        return {
          icon: <CheckCheck className="w-4 h-4 text-green-500" />,
          text: 'Read',
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20'
        }
      case 'failed':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          text: 'Failed to send',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20'
        }
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-400" />,
          text: 'Unknown',
          color: 'text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        }
    }
  }

  const statusConfig = getStatusConfig()

  const formatTooltipContent = () => {
    let content = statusConfig.text
    
    if (timestamp) {
      const time = new Date(timestamp).toLocaleString()
      content += ` at ${time}`
    }
    
    if (readByUserDetails.length > 0) {
      content += '\n\nRead by:'
      readByUserDetails.forEach(userDetail => {
        const readTime = new Date(userDetail.time).toLocaleString()
        content += `\n• ${userDetail.name} at ${readTime}`
      })
    }
    
    return content
  }

  const StatusIcon = () => (
    <div className={`flex items-center gap-1 ${statusConfig.color}`}>
      {statusConfig.icon}
      {readCount > 1 && (
        <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
          {readCount}
        </Badge>
      )}
    </div>
  )

  if (!showTooltip) {
    return <StatusIcon />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            <StatusIcon />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-sm whitespace-pre-line">
            {formatTooltipContent()}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Helper function to determine message status
export function getMessageStatus(readBy: string[], timestamp: number): 'sending' | 'sent' | 'delivered' | 'read' {
  const now = Date.now()
  const messageAge = now - timestamp
  
  // If message is very recent (less than 2 seconds), show as sending
  if (messageAge < 2000) {
    return 'sending'
  }
  
  // If someone has read it, mark as read
  if (readBy.length > 0) {
    return 'read'
  }
  
  // If message is older than 5 seconds and no one read it, assume delivered
  if (messageAge > 5000) {
    return 'delivered'
  }
  
  // Otherwise, just sent
  return 'sent'
}