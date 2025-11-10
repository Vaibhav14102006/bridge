"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TypingIndicatorProps {
  users: string[]
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  const displayText = users.length === 1 ? `${users[0]} is typing` : `${users.join(", ")} are typing`

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`
  }

  return (
    <div className="flex gap-2 justify-start message-enter mb-2">
      <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
        <AvatarImage src={getAvatarUrl(users[0])} alt={users[0]} />
        <AvatarFallback className="bg-primary text-white text-xs">{getInitials(users[0])}</AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg shadow-sm max-w-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
            <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
            <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{displayText}...</p>
        </div>
      </div>
    </div>
  )
}
