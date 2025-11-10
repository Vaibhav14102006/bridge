"use client"

import { memo } from "react"
import { CheckCheck, Check, Clock, Eye } from "lucide-react"
import MessageStatusIndicator, { getMessageStatus } from "./message-status-indicator"

interface Message {
  id: string
  // Support both old and new field names
  userId?: string
  uid?: string
  userName?: string
  un?: string
  content?: string
  c?: string
  timestamp?: number
  ts?: number
  type?: "text" | "image" | "t" | "i" | "v"
  t?: "t" | "i" | "v"
  mediaType?: "image" | "video" | "file"
  mt?: "i" | "v" | "f"
  mediaUrl?: string
  mu?: string
  fileName?: string
  fn?: string
  readBy?: string[]
  rb?: string[]
  readByTimestamps?: { [userId: string]: number }
  rbt?: { [userId: string]: number }
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  currentUserId?: string
}

const MessageBubble = memo(function MessageBubble({ 
  message, 
  isOwn, 
  currentUserId 
}: MessageBubbleProps) {
  // Support both old and new field names
  const userId = message.uid || message.userId || ""
  const userName = message.un || message.userName || "User"
  const content = message.c || message.content || ""
  const timestamp = message.ts || message.timestamp || Date.now()
  const readBy = message.rb || message.readBy || []
  const readByTimestamps = message.rbt || message.readByTimestamps || {}
  
  const isRead = currentUserId && readBy.includes(currentUserId)
  const messageStatus = getMessageStatus(readBy, timestamp)

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1 sm:mb-2 md:mb-3 px-1 sm:px-2 md:px-0`}>
      <div className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-[75%] p-2 sm:p-3 rounded-2xl ${
        isOwn 
          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md" 
          : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
      }`}>
        {!isOwn && (
          <p className="text-xs opacity-70 mb-1 font-medium text-gray-600 dark:text-gray-300 truncate">
            {userName}
          </p>
        )}
        
        <p className="text-sm sm:text-base leading-relaxed mb-1 break-words">
          {content}
        </p>
        
        <div className="flex items-center justify-between gap-1 sm:gap-2 text-xs opacity-80">
          <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: window.innerWidth < 640 // 12-hour format on mobile for space
            })}
          </span>
          
          {isOwn && (
            <div className="flex-shrink-0">
              <MessageStatusIndicator
                messageStatus={messageStatus}
                readCount={readBy.length}
                timestamp={timestamp}
                readByUsers={readBy}
                readByTimestamps={readByTimestamps}
                showTooltip={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default MessageBubble