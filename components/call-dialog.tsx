"use client"

import { Phone, Video, X } from "lucide-react"
import { useState } from "react"

interface CallDialogProps {
  groupName: string
  userName: string
  onClose: () => void
  callType: "voice" | "video"
}

export default function CallDialog({ groupName, userName, onClose, callType }: CallDialogProps) {
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">("ringing")
  const [duration, setDuration] = useState(0)

  const handleEndCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white">
        {/* Call Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center animate-pulse">
            {callType === "voice" ? (
              <Phone className="w-12 h-12" />
            ) : (
              <Video className="w-12 h-12" />
            )}
          </div>
        </div>

        {/* Group Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{groupName}</h2>
          <p className="text-white/80 text-sm mb-1">
            {callType === "voice" ? "Voice Call" : "Video Call"}
          </p>
          {callStatus === "ringing" && (
            <p className="text-white/60 text-sm animate-pulse">Ringing...</p>
          )}
          {callStatus === "connected" && (
            <p className="text-green-300 text-sm">Connected • {duration}s</p>
          )}
          {callStatus === "ended" && (
            <p className="text-red-300 text-sm">Call Ended</p>
          )}
        </div>

        {/* Feature Notice */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <p className="text-sm text-center text-white/90">
            🚧 <strong>Coming Soon!</strong>
          </p>
          <p className="text-xs text-center text-white/70 mt-2">
            {callType === "voice" ? "Voice" : "Video"} calling feature is under development. 
            This is a preview of the calling interface.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setCallStatus("connected")}
            disabled={callStatus !== "ringing"}
            className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 rounded-full font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Accept
          </button>
          <button
            onClick={handleEndCall}
            className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 rounded-full font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            {callStatus === "ringing" ? "Decline" : "End Call"}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-center text-white/50 mt-4">
          Calling from: {userName}
        </p>
      </div>
    </div>
  )
}
