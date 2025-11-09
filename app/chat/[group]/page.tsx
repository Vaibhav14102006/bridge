"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ChatWindow from "@/components/chat-window"
import ChatInput from "@/components/chat-input"
import Navbar from "@/components/navbar"
import ChatStatusBar from "@/components/chat-status-bar"
import { getUserSession, setUserOnlineStatus, removeUserOnlineStatus, markAllMessagesAsRead, getMessages } from "@/lib/firebase"

export default function ChatPage() {
  const params = useParams()
  const groupName = decodeURIComponent(params.group as string)
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState("")
  const [messageCount, setMessageCount] = useState(0)
  const [lastMessageTime, setLastMessageTime] = useState<number>(0)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionId = localStorage.getItem("currentSessionId")
        console.log("[Chat] Loading session, sessionId:", sessionId)
        
        if (!sessionId) {
          console.log("[Chat] No sessionId found in localStorage")
          setError("No active session. Please join a group first.")
          return
        }

        const userSession = await getUserSession(sessionId)
        console.log("[Chat] Session from Firestore:", userSession)
        
        let finalSession: any
        
        if (userSession) {
          // Check if session is for this group
          if (userSession.gn === groupName) {
            finalSession = {
              displayName: userSession.dn,
              groupName: userSession.gn,
              userId: userSession.uid,
              sessionId: userSession.sid,
            }
          } else {
            console.log("[Chat] Session is for different group, creating new session")
            // Create a temporary session if mismatch
            finalSession = {
              displayName: userSession.dn || "User",
              groupName: groupName,
              userId: userSession.uid,
              sessionId: sessionId,
            }
          }
        } else {
          console.log("[Chat] Session not found in Firestore, checking localStorage backup")
          // Fallback: Try to reconstruct from localStorage
          const displayName = localStorage.getItem("displayName") || "User"
          const userId = localStorage.getItem("userId") || `user_${Date.now()}`
          
          finalSession = {
            displayName,
            groupName,
            userId,
            sessionId,
          }
          
          console.log("[Chat] Using temporary session:", finalSession)
        }
        
        setSession(finalSession)
        
        // Load initial message stats
        try {
          const messages = await getMessages(groupName)
          setMessageCount(messages.length)
          if (messages.length > 0) {
            const latestMessage = Math.max(...messages.map(m => m.ts || 0))
            setLastMessageTime(latestMessage)
          }
        } catch (error) {
          console.error("Failed to load message stats:", error)
        }
        
        // Set user as online
        await setUserOnlineStatus(groupName, finalSession.userId, finalSession.displayName, "online")
        
        // Mark all messages as read
        await markAllMessagesAsRead(groupName, finalSession.userId)
        
        // Update online status every minute
        const onlineInterval = setInterval(() => {
          setUserOnlineStatus(groupName, finalSession.userId, finalSession.displayName, "online")
        }, 60000)
        
        // Remove online status when user leaves
        return () => {
          clearInterval(onlineInterval)
          removeUserOnlineStatus(groupName, finalSession.userId)
        }
      } catch (error) {
        console.error("[Chat] Error loading session:", error)
        // Don't block user, create temporary session
        const tempSession = {
          displayName: "User",
          groupName,
          userId: `user_${Date.now()}`,
          sessionId: `temp_${Date.now()}`,
        }
        setSession(tempSession)
      }
    }

    loadSession()
  }, [groupName])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose mb-4">{error}</p>
          <a href="/" className="text-primary hover:text-rose font-medium">
            Return to join page
          </a>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-dark">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Navbar groupName={groupName} userName={session.displayName} userId={session.userId} />
      <div className="hidden sm:block">
        <ChatStatusBar 
          groupName={groupName} 
          isConnected={true} 
          lastMessageTime={lastMessageTime}
          messageCount={messageCount}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden max-w-full mx-auto w-full px-0 sm:px-2 md:px-4 py-0 sm:py-2">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow groupName={groupName} userId={session.userId} />
          <div className="flex-shrink-0 p-1 sm:p-2 bg-background/95 backdrop-blur-sm border-t border-border/50">
            <ChatInput groupName={groupName} userId={session.userId} userName={session.displayName} />
          </div>
        </div>
      </div>
    </main>
  )
}
