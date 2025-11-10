"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { validateGroupName, validateDisplayName, checkRateLimit, hashPassword } from "@/lib/security"
import { 
  getGroupPassword, 
  saveUserSession, 
  getAllGroups, 
  registerUser,
  getRegisteredUser,
  updateUserLastActive,
  type Group,
  type RegisteredUser 
} from "@/lib/firebase"

export default function JoinForm() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [groupName, setGroupName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableGroups, setAvailableGroups] = useState<Group[]>([])
  const [showGroups, setShowGroups] = useState(false)
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null)
  const [isNewUser, setIsNewUser] = useState(true)

  useEffect(() => {
    loadAvailableGroups()
    loadRegisteredUser()
  }, [])

  const loadRegisteredUser = async () => {
    try {
      const storedUserId = localStorage.getItem("registeredUserId")
      if (storedUserId) {
        const user = await getRegisteredUser(storedUserId)
        if (user) {
          setRegisteredUser(user)
          setDisplayName(user.dn)
          setIsNewUser(false)
          console.log("[JoinForm] Loaded registered user:", user)
        }
      }
    } catch (error) {
      console.error("[JoinForm] Error loading registered user:", error)
    }
  }

  const loadAvailableGroups = async () => {
    setLoadingGroups(true)
    try {
      const groups = await getAllGroups()
      setAvailableGroups(groups)
    } catch (error) {
      console.error("[JoinForm] Error loading groups:", error)
    } finally {
      setLoadingGroups(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!displayName.trim() || !groupName.trim() || !password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      if (!validateDisplayName(displayName)) {
        setError("Display name must be between 1-30 characters")
        setLoading(false)
        return
      }

      if (!validateGroupName(groupName)) {
        setError(
          "Group name must be between 1-50 characters and contain only letters, numbers, spaces, dashes, and underscores",
        )
        setLoading(false)
        return
      }

      if (!checkRateLimit(`join_${groupName}`, 10, 300000)) {
        setError("Too many join attempts. Please try again later.")
        setLoading(false)
        return
      }

      const existingPassword = await getGroupPassword(groupName)
      if (!existingPassword) {
        setError("This group does not exist. Please ask an admin to create it.")
        setLoading(false)
        return
      }

      const passwordHash = await hashPassword(password)
      if (existingPassword !== passwordHash) {
        setError("Incorrect group password")
        setLoading(false)
        return
      }

      // Register or get existing user
      let userId: string
      if (registeredUser) {
        // User already registered, use existing ID
        userId = registeredUser.uid
        await updateUserLastActive(userId)
        console.log("[Join] Existing user joining:", registeredUser.dn)
      } else {
        // New user, register them
        const newUser = await registerUser(displayName)
        userId = newUser.uid
        setRegisteredUser(newUser)
        localStorage.setItem("registeredUserId", userId)
        console.log("[Join] New user registered:", newUser)
      }

      const sessionId = `session_${Date.now()}`

      const userSession = {
        dn: displayName, // Shortened field name
        gn: groupName, // Shortened field name  
        uid: userId, // Shortened field name
        ja: new Date().toISOString(), // Shortened field name
        sid: sessionId, // Shortened field name
      }

      await saveUserSession(userSession)
      
      // Store session info in localStorage as backup
      localStorage.setItem("currentSessionId", sessionId)
      localStorage.setItem("displayName", displayName)
      localStorage.setItem("userId", userId)
      localStorage.setItem("currentGroup", groupName)
      
      console.log("[Join] Session created:", userSession)
      router.push(`/chat/${encodeURIComponent(groupName)}`)
    } catch (err) {
      console.error("[v0] Join error:", err)
      setError("Failed to join group. Please try again.")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickJoin = (selectedGroup: string) => {
    setGroupName(selectedGroup)
    setShowGroups(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Back Message for Registered Users */}
      {registeredUser && !isNewUser && (
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 border-2 border-pink-300 dark:border-pink-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {displayName && displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                Welcome back, {displayName}! 👋
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You're already registered. Just select a group and join! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Message for New Users */}
      {isNewUser && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                <strong>First time here?</strong> Enter your name to register!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Your name will be saved so you won't need to enter it again. 🎯
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-8 shadow-md">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name {!isNewUser && <span className="text-xs text-pink-600 dark:text-pink-400">(Registered ✓)</span>}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
                disabled={!isNewUser}
                className={`w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-foreground transition-all ${!isNewUser ? 'opacity-75 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isNewUser ? `${(displayName || '').length}/30 characters` : '✓ Name is locked for registered users'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">Group Name</label>
                <button
                  type="button"
                  onClick={() => setShowGroups(!showGroups)}
                  className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  {showGroups ? "Hide Groups" : "View Available Groups"}
                </button>
              </div>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Name of the group to join"
                maxLength={50}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-foreground transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">{groupName.length}/50 characters</p>
            </div>

            {showGroups && (
              <div className="p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-yellow-900/20 rounded-lg border border-pink-200 dark:border-purple-700/50">
                <p className="text-sm font-semibold text-foreground mb-3">Available Groups:</p>
                {loadingGroups ? (
                  <p className="text-sm text-muted-foreground">Loading groups...</p>
                ) : availableGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No groups available. Ask admin to create one!</p>
                ) : (
                  <div className="grid gap-2">
                    {availableGroups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => handleQuickJoin(group.n)}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all text-left border border-purple-200 dark:border-purple-700 group"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
                            {group.n}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(group.ca).toLocaleDateString()}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Group Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter group password"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-foreground transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 hover:from-pink-600 hover:via-purple-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Open Chat
            </span>
          )}
        </button>

        {/* Change User Button for Registered Users */}
        {!isNewUser && registeredUser && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`Switch to a different user? Your current name "${displayName}" will be cleared.`)) {
                localStorage.removeItem("registeredUserId")
                setRegisteredUser(null)
                setDisplayName("")
                setIsNewUser(true)
              }
            }}
            className="w-full py-2 px-4 rounded-lg border-2 border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
          >
            🔄 Switch User Account
          </button>
        )}

        <p className="text-center text-sm text-muted-foreground">
          or{" "}
          <a href="/admin" className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700">
            Admin Login
          </a>
        </p>
      </form>
    </div>
  )
}
