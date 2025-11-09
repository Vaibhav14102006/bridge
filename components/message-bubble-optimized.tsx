"use client"

import { memo } from "react"
import { CheckCheck } from "lucide-react"

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: number
  type?: "text" | "image"
  mediaType?: "image" | "video" | "file"
  mediaUrl?: string
  fileName?: string
  readBy?: string[]
}

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  currentUserId?: string
}

// Lightweight formatTime function
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false 
  })
}

const MessageBubble = memo(function MessageBubble({ 
  message, 
  isOwn, 
  currentUserId 
}: MessageBubbleProps) {
  const isRead = currentUserId && message.readBy?.includes(currentUserId)

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[75%] p-3 rounded-2xl ${
        isOwn 
          ? "bg-pink-500 text-white" 
          : "bg-white border border-gray-200"
      }`}>
        {!isOwn && (
          <p className="text-xs opacity-70 mb-1 font-medium">
            {message.userName}
          </p>
        )}
        
        <p className="text-sm leading-relaxed mb-1">
          {message.content}
        </p>
        
        <div className="flex items-center justify-end gap-1 text-xs opacity-70">
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <CheckCheck 
              className={`w-4 h-4 ${isRead ? "text-blue-400" : "opacity-50"}`} 
            />
          )}
        </div>
      </div>
    </div>
  )
})

export default MessageBubble