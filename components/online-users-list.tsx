"use client"

import { useState, useEffect } from "react"
import { onOnlineUsersChange, type OnlineUser } from "@/lib/firebase"
import { Users, Circle } from "lucide-react"

interface OnlineUsersListProps {
  groupName: string
  currentUserId: string
}

export default function OnlineUsersList({ groupName, currentUserId }: OnlineUsersListProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const unsubscribe = onOnlineUsersChange(groupName, (users) => {
      setOnlineUsers(users)
    })

    return () => unsubscribe()
  }, [groupName])

  const otherUsers = onlineUsers.filter((user) => user.uid !== currentUserId)
  const onlineCount = otherUsers.length

  return (
    <div className="relative">
      {/* Online Count Badge */}
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
        title="Online users"
      >
        <Users className="w-5 h-5" />
        {onlineCount > 0 && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {onlineCount}
          </span>
        )}
      </button>

      {/* Online Users Dropdown */}
      {showList && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-pink-200 dark:border-purple-700 p-4 min-w-[200px] z-50">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Circle className="w-3 h-3 text-green-500 fill-green-500" />
            Online Users ({onlineCount})
          </h3>
          
          {otherUsers.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">No other users online</p>
          ) : (
            <div className="space-y-2">
              {otherUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user.un.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user.un}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-green-500" />
                      {user.s === "online" ? "Active now" : "Away"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
