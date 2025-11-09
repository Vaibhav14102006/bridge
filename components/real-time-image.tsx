"use client"

import { useState, useEffect } from "react"
import { Camera, Users, Video } from "lucide-react"

interface RealTimeImageProps {
  size?: "sm" | "md" | "lg"
  showLive?: boolean
  userName?: string
}

const RealTimeImage = ({ size = "md", showLive = true, userName }: RealTimeImageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLive, setIsLive] = useState(showLive)

  // Update time every second for real-time effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div className="relative">
      {/* Real-time avatar with live indicator */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Animated background for "live" effect */}
        {isLive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        )}
        
        {/* Camera icon representing real-time image */}
        <Camera className={`${iconSizes[size]} text-white relative z-10`} />
        
        {/* Live indicator dot */}
        {isLive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white">
            <div className="w-full h-full bg-red-400 rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {/* Real-time timestamp */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full whitespace-nowrap">
        {currentTime.toLocaleTimeString("en-US", { 
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}
      </div>

      {/* User name if provided */}
      {userName && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium text-center">
          {userName}
        </div>
      )}
    </div>
  )
}

// Real-time group image showing multiple live feeds
export const RealTimeGroupImage = ({ userCount = 3 }: { userCount?: number }) => {
  const [liveUsers, setLiveUsers] = useState(userCount)

  useEffect(() => {
    // Simulate users going online/offline
    const interval = setInterval(() => {
      setLiveUsers(Math.max(1, Math.floor(Math.random() * 5) + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-16 h-16">
      {/* Main group container */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        
        {/* Group icon */}
        <Users className="w-8 h-8 text-white relative z-10" />
        
        {/* Live counter */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          {liveUsers}
        </div>
      </div>
      
      {/* Real-time indicators around the group */}
      <div className="absolute -top-1 left-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
      <div className="absolute top-2 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute -bottom-1 left-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
  )
}

// Video call real-time image
export const RealTimeVideoImage = ({ isActive = false }: { isActive?: boolean }) => {
  const [isStreaming, setIsStreaming] = useState(isActive)

  return (
    <div className="relative">
      <div className={`w-12 h-12 rounded-full ${isStreaming ? 'bg-gradient-to-br from-red-500 via-pink-500 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-600'} flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Streaming effect */}
        {isStreaming && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        )}
        
        <Video className="w-6 h-6 text-white relative z-10" />
        
        {/* Recording indicator */}
        {isStreaming && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse">
            <div className="w-full h-full bg-red-500 rounded-full animate-ping"></div>
          </div>
        )}
      </div>
      
      {/* Status text */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isStreaming ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {isStreaming ? 'LIVE' : 'OFF'}
        </span>
      </div>
    </div>
  )
}

export default RealTimeImage