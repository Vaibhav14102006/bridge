"use client"
import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, Check, Clock, AlertCircle } from 'lucide-react'
import { Badge } from './ui/badge'

interface ChatStatusBarProps {
  groupName: string
  isConnected?: boolean
  lastMessageTime?: number
  messageCount?: number
}

export default function ChatStatusBar({ 
  groupName, 
  isConnected = true, 
  lastMessageTime,
  messageCount = 0 
}: ChatStatusBarProps) {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected')
  const [lastActivity, setLastActivity] = useState<string>('')

  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected')
  }, [isConnected])

  useEffect(() => {
    if (lastMessageTime) {
      const updateLastActivity = () => {
        const now = Date.now()
        const diff = now - lastMessageTime
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (minutes < 1) {
          setLastActivity('Just now')
        } else if (minutes < 60) {
          setLastActivity(`${minutes}m ago`)
        } else if (hours < 24) {
          setLastActivity(`${hours}h ago`)
        } else {
          setLastActivity(`${days}d ago`)
        }
      }

      updateLastActivity()
      const interval = setInterval(updateLastActivity, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [lastMessageTime])

  const getConnectionDisplay = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Wifi className="w-4 h-4 text-green-500" />,
          text: 'Connected',
          color: 'text-green-500'
        }
      case 'connecting':
        return {
          icon: <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />,
          text: 'Connecting...',
          color: 'text-yellow-500'
        }
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-500" />,
          text: 'Disconnected',
          color: 'text-red-500'
        }
    }
  }

  const connectionDisplay = getConnectionDisplay()

  return (
    <div className="px-4 py-2 bg-muted/30 border-b border-border">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {/* Left side - Connection status */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 ${connectionDisplay.color}`}>
            {connectionDisplay.icon}
            <span>{connectionDisplay.text}</span>
          </div>
          
          {messageCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {messageCount.toLocaleString()} messages
            </Badge>
          )}
        </div>

        {/* Right side - Last activity */}
        <div className="flex items-center gap-2">
          {lastActivity && (
            <span>Last activity: {lastActivity}</span>
          )}
          
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}