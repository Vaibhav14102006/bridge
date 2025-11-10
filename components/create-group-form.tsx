"use client"

import type React from "react"
import { useState } from "react"
import { validateGroupName, hashPassword } from "@/lib/security"
import { createGroup } from "@/lib/firebase"

interface CreateGroupFormProps {
  onGroupCreated: () => void
}

export default function CreateGroupForm({ onGroupCreated }: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!groupName.trim() || !password.trim()) {
        setError("Please fill in all fields")
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

      const passwordHash = await hashPassword(password)
      await createGroup(groupName, passwordHash)

      setSuccess(`Group "${groupName}" created successfully!`)
      setGroupName("")
      setPassword("")

      setTimeout(() => {
        onGroupCreated()
      }, 1500)
    } catch (err) {
      console.error("[v0] Create group error:", err)
      setError("Failed to create group. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel p-6 elegant-shadow mb-6">
      <h2 className="text-lg font-serif font-bold gradient-text mb-4">Create New Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            maxLength={50}
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-dark/50"
          />
          <p className="text-xs text-muted mt-1">{groupName.length}/50 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Group Passcode</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter passcode for group members"
            className="w-full px-4 py-3 rounded-lg bg-white/50 border border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-dark/50"
          />
        </div>

        {error && <div className="p-3 bg-rose/10 border border-rose/30 rounded-lg text-rose text-sm">{error}</div>}
        {success && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary via-rose-light to-accent text-muted-dark font-medium button-hover elegant-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  )
}
