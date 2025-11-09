"use client"

import { useEffect, useState } from "react"
import { doc, setDoc, onSnapshot, serverTimestamp, deleteDoc } from "firebase/firestore"

// Note: You'll need to export 'db' from firebase.ts
// For now, we'll import it when we update firebase.ts

interface OnlineUser {
  userId: string
  userName: string
  lastSeen: number
}

export function useOnlineStatus(groupName: string, userId: string, userName: string) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  useEffect(() => {
    if (!groupName || !userId) return

    // We'll implement this after updating firebase.ts to export db
    // const userPresenceRef = doc(db, `groups/${groupName}/presence`, userId)
    
    // Set user as online
    // setDoc(userPresenceRef, {
    //   userId,
    //   userName,
    //   lastSeen: Date.now(),
    //   isOnline: true
    // })

    // Update presence every 30 seconds
    // const interval = setInterval(() => {
    //   setDoc(userPresenceRef, {
    //     userId,
    //     userName,
    //     lastSeen: Date.now(),
    //     isOnline: true
    //   }, { merge: true })
    // }, 30000)

    // Listen to online users
    // const presenceRef = collection(db, `groups/${groupName}/presence`)
    // const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
    //   const users: OnlineUser[] = []
    //   snapshot.forEach((doc) => {
    //     const data = doc.data()
    //     if (data.userId !== userId) {
    //       users.push({
    //         userId: data.userId,
    //         userName: data.userName,
    //         lastSeen: data.lastSeen
    //       })
    //     }
    //   })
    //   setOnlineUsers(users)
    // })

    // Cleanup on unmount
    // return () => {
    //   clearInterval(interval)
    //   deleteDoc(userPresenceRef)
    //   unsubscribe()
    // }
  }, [groupName, userId, userName])

  return { onlineUsers }
}

export function getOnlineStatus(lastSeen: number): 'online' | 'away' | 'offline' {
  const now = Date.now()
  const diff = now - lastSeen
  
  if (diff < 60000) return 'online' // Last seen within 1 minute
  if (diff < 300000) return 'away' // Last seen within 5 minutes
  return 'offline'
}

export function formatLastSeen(lastSeen: number): string {
  const now = Date.now()
  const diff = now - lastSeen
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(lastSeen).toLocaleDateString()
}
