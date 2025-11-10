"use client"

import { useState, useEffect, useRef } from "react"
import MessageBubble from "./message-bubble"
import TypingIndicator from "./typing-indicator"
import { getMessages, onMessagesChange, onTypingStatusChange, type Message as FirebaseMessage } from "@/lib/firebase"

interface ChatWindowProps {
  groupName: string
  userId: string
}

export default function ChatWindow({ groupName, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<FirebaseMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribersRef = useRef<Array<() => void>>([])
  const previousMessageCountRef = useRef(0)

  // Play notification sound
  const playNotificationSound = () => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (error) {
        console.log('Could not play notification sound')
      }
    }
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const initialMessages = await getMessages(groupName)
        setMessages(initialMessages)
        previousMessageCountRef.current = initialMessages.length
        setLoading(false)

        // Subscribe to real-time message updates
        const unsubscribeMessages = onMessagesChange(groupName, (updatedMessages) => {
          // Play sound if new message from someone else
          if (updatedMessages.length > previousMessageCountRef.current) {
            const newMessage = updatedMessages[updatedMessages.length - 1]
            if (newMessage.uid !== userId) {
              playNotificationSound()
            }
          }
          previousMessageCountRef.current = updatedMessages.length
          setMessages(updatedMessages)
        })
        unsubscribersRef.current.push(unsubscribeMessages)

        // Subscribe to typing status updates
        const unsubscribeTyping = onTypingStatusChange(groupName, (typingUserNames) => {
          setTypingUsers(new Set(typingUserNames))
        })
        unsubscribersRef.current.push(unsubscribeTyping)
      } catch (error) {
        console.error("[v0] Error loading messages:", error)
        setLoading(false)
      }
    }

    loadMessages()

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub())
    }
  }, [groupName])

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingUsers])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center chat-background rounded-lg">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto px-4 py-3 chat-background">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center bg-card/80 backdrop-blur-sm px-6 py-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-xl font-semibold gradient-text mb-2">Welcome to {groupName}</p>
              <p className="text-muted-foreground text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isOwn={message.uid === userId}
                currentUserId={userId}
              />
            ))}
            {typingUsers.size > 0 && <TypingIndicator users={Array.from(typingUsers)} />}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
