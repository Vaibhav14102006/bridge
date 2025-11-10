"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateGroupPassword, deleteGroup, getMessages } from "@/lib/firebase"
import { hashPassword } from "@/lib/security"
import { MessageCircle } from "lucide-react"

interface GroupPasswordChangerProps {
  groupName: string
}

interface GroupStats {
  totalMessages: number
  totalUsers: number
  usersList: string[]
  lastMessageTime: string
}

export default function GroupPasswordChanger({ groupName }: GroupPasswordChangerProps) {
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<GroupStats>({
    totalMessages: 0,
    totalUsers: 0,
    usersList: [],
    lastMessageTime: "N/A",
  })

  useEffect(() => {
    loadStats()
  }, [groupName])

  const loadStats = async () => {
    try {
      const messages = await getMessages(groupName)
      const users = new Set(messages.map((m) => m.un))
      const lastMessage = messages[messages.length - 1]

      setStats({
        totalMessages: messages.length,
        totalUsers: users.size,
        usersList: Array.from(users),
        lastMessageTime: lastMessage ? new Date(lastMessage.ts).toLocaleString() : "N/A",
      })
    } catch (error) {
      console.error("[GroupPasswordChanger] Error loading stats:", error)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim()) {
      setError("Please enter a new password")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Hash the new password before storing
      const passwordHash = await hashPassword(newPassword)
      await updateGroupPassword(groupName, passwordHash)
      
      setSuccess(true)
      setNewPassword("")
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("[GroupPasswordChanger] Failed to change password:", error)
      setError("Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (confirm(`Are you sure you want to delete "${groupName}"? This will delete all messages and cannot be undone.`)) {
      setLoading(true)
      try {
        await deleteGroup(groupName)
        alert(`Group "${groupName}" has been deleted successfully.`)
        window.location.reload()
      } catch (error) {
        console.error("[GroupPasswordChanger] Failed to delete group:", error)
        alert("Failed to delete group. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const router = useRouter()

  const handleOpenChat = () => {
    // Create a temporary session for admin
    const sessionId = `admin_session_${Date.now()}`
    const userId = `admin_${Date.now()}`
    const displayName = "Admin"
    
    const adminSession = {
      displayName,
      groupName,
      userId,
      joinedAt: new Date().toISOString(),
      sessionId,
    }
    
    // Store session info in localStorage as backup
    localStorage.setItem("currentSessionId", sessionId)
    localStorage.setItem("displayName", displayName)
    localStorage.setItem("userId", userId)
    localStorage.setItem("currentGroup", groupName)
    localStorage.setItem(`session_${sessionId}`, JSON.stringify(adminSession))
    
    console.log("[Admin] Opening chat with session:", adminSession)
    router.push(`/chat/${encodeURIComponent(groupName)}`)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
          {groupName}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleOpenChat}
            className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 transition-all shadow-md flex items-center gap-2"
            title="Open this group chat"
          >
            <MessageCircle className="w-4 h-4" />
            Open Chat
          </button>
          <button
            type="button"
            onClick={() => setShowStats(!showStats)}
            className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm"
          >
            {showStats ? "Hide Stats" : "View Stats"}
          </button>
        </div>
      </div>

      {showStats && (
        <div className="mb-4 p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-yellow-900/20 rounded-lg border border-pink-200 dark:border-purple-700/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <p className="text-muted-foreground font-medium">Total Messages</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {stats.totalMessages}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Active Users</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.totalUsers}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-muted-foreground font-medium">Last Activity</p>
              <p className="text-xs text-foreground mt-1">{stats.lastMessageTime}</p>
            </div>
          </div>
          {stats.usersList.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Active Users:</p>
              <div className="flex flex-wrap gap-2">
                {stats.usersList.map((user) => (
                  <span key={user} className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs font-medium shadow-sm">
                    {user}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-foreground"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap items-center">
          <button
            type="submit"
            disabled={loading || !newPassword.trim()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
          {success && (
            <div className="px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Password updated!
            </div>
          )}
          <button
            type="button"
            onClick={handleDeleteGroup}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Group
          </button>
        </div>
      </form>
    </div>
  )
}
