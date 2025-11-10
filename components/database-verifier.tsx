"use client"

import { useState, useEffect } from "react"
import { getMessages } from "@/lib/firebase"

interface DatabaseVerifierProps {
  groupName: string
  onMessageCountChange?: (count: number) => void
}

export default function DatabaseVerifier({ groupName, onMessageCountChange }: DatabaseVerifierProps) {
  const [messageCount, setMessageCount] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyDatabase = async () => {
    try {
      setIsVerifying(true)
      const messages = await getMessages(groupName)
      const count = messages.length
      setMessageCount(count)
      setLastUpdated(new Date().toLocaleTimeString())
      onMessageCountChange?.(count)
    } catch (error) {
      console.error("Error verifying database:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    verifyDatabase()
  }, [groupName])

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isVerifying ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
        <span>Database: {messageCount} messages</span>
      </div>
      <div className="text-xs text-gray-500">
        Last verified: {lastUpdated}
      </div>
      <button
        onClick={verifyDatabase}
        disabled={isVerifying}
        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
      >
        {isVerifying ? "Verifying..." : "Verify Now"}
      </button>
    </div>
  )
}