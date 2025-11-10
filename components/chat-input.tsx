"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { saveMessage, setTypingStatus } from "@/lib/firebase"
import FileUploader from "@/components/file-uploader"

interface ChatInputProps {
  groupName: string
  userId: string
  userName: string
}

export default function ChatInput({ groupName, userId, userName }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup: Clear timeout and typing status when component unmounts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping) {
        setTypingStatus(groupName, userId, userName, false)
      }
    }
  }, [groupName, userId, userName, isTyping])

  const handleTyping = (currentMessage: string) => {
    // If message is empty, immediately clear typing status
    if (!currentMessage.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTyping) {
        setIsTyping(false)
        setTypingStatus(groupName, userId, userName, false)
      }
      return
    }

    // Only set typing if not already typing
    if (!isTyping) {
      setIsTyping(true)
      setTypingStatus(groupName, userId, userName, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to clear typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      setTypingStatus(groupName, userId, userName, false)
    }, 2000)
  }

  const handleFileSelect = async (file: File, type: "image" | "video" | "file") => {
    setLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Content = e.target?.result as string

        const shortMediaType = type === "image" ? "i" as const : type === "video" ? "v" as const : "f" as const
        
        const newMessage = {
          id: `msg_${Date.now()}`,
          uid: userId, // Shortened field name
          un: userName, // Shortened field name
          c: file.name, // Shortened field name
          mt: shortMediaType, // Shortened field name
          mu: base64Content, // Shortened field name
          fn: file.name, // Shortened field name
          ts: Date.now(), // Shortened field name
          t: "i" as const, // Shortened field name for image
        }

        await saveMessage(groupName, newMessage)
        setLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Failed to upload file:", error)
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSendingMessage(true)
    setLoading(true)

    try {
      const newMessage = {
        id: `msg_${Date.now()}`,
        uid: userId, // Shortened field name
        un: userName, // Shortened field name
        c: message, // Shortened field name
        ts: Date.now(), // Shortened field name
        t: "t" as const, // Shortened field name for text
      }

      await saveMessage(groupName, newMessage)

      // Clear typing status
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      setIsTyping(false)
      await setTypingStatus(groupName, userId, userName, false)

      setMessage("")
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
    } finally {
      setSendingMessage(false)
      setLoading(false)
    }
  }

  // Common emojis for quick access
  const quickEmojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '🔥', '✨']
  
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
  }

  return (
    <form onSubmit={handleSend} className="w-full">
      <div className="bg-card p-1.5 sm:p-2 md:p-3 flex gap-1 sm:gap-2 items-end rounded-lg sm:rounded-xl shadow-md border border-border">
        {/* File uploader - Hidden on very small screens, compact on mobile */}
        <div className="hidden xs:block">
          <FileUploader onFileSelect={handleFileSelect} isLoading={loading} />
        </div>
        
        {/* Quick emoji picker - More mobile-friendly */}
        <div className="relative group">
          <button
            type="button"
            className="p-1 sm:p-1.5 md:p-2 rounded-full hover:bg-muted transition-colors touch-manipulation"
            title="Add emoji"
          >
            <span className="text-base sm:text-lg md:text-xl">😊</span>
          </button>
          {/* Mobile-optimized emoji picker */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-card border border-border rounded-lg p-1.5 sm:p-2 gap-0.5 sm:gap-1 shadow-lg z-10 max-w-xs">
            {quickEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="text-base sm:text-lg md:text-xl hover:scale-125 transition-transform p-0.5 sm:p-1 touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        {/* Text input area - Mobile optimized */}
        <div className="flex-1 bg-input border border-border rounded-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 focus-within:border-primary transition-colors">
          <textarea
            value={message}
            onChange={(e) => {
              const newValue = e.target.value
              setMessage(newValue)
              handleTyping(newValue)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend(e as any)
              }
            }}
            placeholder="Type a message"
            rows={1}
            className="w-full bg-transparent focus:outline-none placeholder-muted-foreground resize-none max-h-16 sm:max-h-20 md:max-h-24 text-foreground text-sm sm:text-base leading-relaxed"
            style={{ 
              minHeight: '20px',
              fontSize: window.innerWidth < 640 ? '16px' : '14px' // Prevent zoom on iOS
            }}
          />
        </div>
        
        {/* Send button - Touch-friendly */}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-95 touch-manipulation ${
            sendingMessage 
              ? 'bg-blue-500 animate-pulse' 
              : 'bg-primary hover:bg-accent'
          } text-white`}
          title={sendingMessage ? "Sending..." : "Send message"}
        >
          {loading ? (
            <svg className="animate-spin w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
