"use client"

import Link from "next/link"
import { ArrowLeft, MoreVertical, Search } from "lucide-react"
import RealTimeImage, { RealTimeGroupImage } from "./real-time-image"
import OnlineUsersIndicator from "./online-users-indicator"

interface NavbarProps {
  groupName: string
  userName: string
  userId?: string
}

export default function Navbar({ groupName, userName, userId }: NavbarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white shadow-lg">
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 min-w-0 flex-1">
        {/* Back button */}
        <Link
          href="/"
          className="hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-all hover:scale-110 active:scale-95 flex-shrink-0"
          title="Back to home"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>

        {/* Group info with real-time group image */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 min-w-0 flex-1">
          <RealTimeGroupImage userCount={3} />
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-sm sm:text-base md:text-lg truncate">{groupName}</h1>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
              <span className="truncate hidden xs:inline">Online now • Bridge Chat</span>
              <span className="truncate xs:hidden">Online</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 flex-shrink-0">
        {/* Search - Hidden on small screens */}
        <button
          className="hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition-all hover:scale-110 active:scale-95 hidden md:flex"
          title="Search messages"
        >
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Online Users - More mobile-friendly */}
        <div className="hidden sm:block">
          <OnlineUsersIndicator groupName={groupName} currentUserId={userId || ""} />
        </div>
        
        {/* Mobile-only online users indicator - simplified */}
        <div className="sm:hidden">
          <OnlineUsersIndicator groupName={groupName} currentUserId={userId || ""} />
        </div>

        {/* Real-time user avatar - smaller on mobile */}
        <div className="ml-0.5 sm:ml-1 md:ml-2">
          <RealTimeImage size="sm" showLive={true} userName={userName} />
        </div>

        {/* More options */}
        <button
          className="hover:bg-white/20 p-1 sm:p-1.5 md:p-2 rounded-full transition-all hover:scale-110 active:scale-95"
          title="More options"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </nav>
  )
}