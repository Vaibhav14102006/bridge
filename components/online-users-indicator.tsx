"use client"

import { useState, useEffect } from "react"
import { onOnlineUsersChange, type OnlineUser } from "@/lib/firebase"
import { Users, Circle } from "lucide-react"

interface OnlineUsersIndicatorProps {
  groupName: string
  currentUserId: string
}

export default function OnlineUsersIndicator({ groupName, currentUserId }: OnlineUsersIndicatorProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const unsubscribe = onOnlineUsersChange(groupName, (users) => {
      // Filter out current user and only show truly online users
      const activeUsers = users.filter(user => 
        user.uid !== currentUserId && 
        user.s === "online" &&
        (Date.now() - user.la) < 300000 // Active within last 5 minutes
      )
      setOnlineUsers(activeUsers)
    })

    return unsubscribe
  }, [groupName, currentUserId])

  const onlineCount = onlineUsers.length

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center gap-1 sm:gap-2 hover:bg-white/20 p-1 sm:p-2 rounded-full transition-all hover:scale-110 active:scale-95 touch-manipulation"
        title={`${onlineCount} users online`}
      >
        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        {onlineCount > 0 && (
          <span className="bg-green-500 text-white text-xs rounded-full min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 flex items-center justify-center font-bold">
            {onlineCount}
          </span>
        )}
      </button>

      {/* Online Users Dropdown - Mobile optimized */}
      {showList && (
        <div className="absolute top-full right-0 mt-1 sm:mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[180px] sm:min-w-[200px] z-50 max-w-[280px]">
          <div className="p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
              Online Users ({onlineCount})
            </h3>
          </div>
          
          <div className="max-h-48 sm:max-h-64 overflow-y-auto">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <div key={user.uid} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(user.un || 'U').charAt(0).toUpperCase()}
                    </div>
                    <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user.un || 'Unknown User'}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Online now
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No other users online
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {showList && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowList(false)}
        />
      )}
    </div>
  )
}