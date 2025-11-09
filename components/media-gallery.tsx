"use client"
import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, Maximize } from 'lucide-react'

const mediaGallery = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop",
    title: "4K Video Conferencing",
    description: "Crystal clear HD video calls with up to 100 participants"
  },
  {
    type: "image", 
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    title: "Real-time Messaging",
    description: "Instant messaging with typing indicators and read receipts"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    title: "File Collaboration",
    description: "Share and collaborate on documents in real-time"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    title: "Screen Sharing",
    description: "Share your screen with anyone, anywhere in the world"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    title: "Voice Messages",
    description: "High-quality voice messages with noise cancellation"
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
    title: "Mobile Integration",
    description: "Seamless experience across all your devices"
  }
]

export default function MediaGallery() {
  const [currentMedia, setCurrentMedia] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMedia((prev) => (prev + 1) % mediaGallery.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentItem = mediaGallery[currentMedia]

  return (
    <div className="space-y-6">
      {/* Main Media Display */}
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-blue-900">
          <img
            src={currentItem.src}
            alt={currentItem.title}
            className="w-full h-80 object-cover"
          />
          
          {/* Media Controls Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
                <Volume2 className="w-8 h-8 text-white" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200">
                <Maximize className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>

          {/* Media Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentItem.title}
            </h3>
            <p className="text-white/90 text-lg">
              {currentItem.description}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {mediaGallery.map((item, index) => (
          <div
            key={index}
            onClick={() => setCurrentMedia(index)}
            className={`relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${
              index === currentMedia
                ? 'ring-4 ring-blue-500 shadow-lg scale-105'
                : 'hover:scale-105 hover:shadow-md'
            }`}
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-16 object-cover"
            />
            <div className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentMedia ? 'bg-blue-500/20' : 'bg-black/20 hover:bg-black/10'
            }`}></div>
            
            {/* Play button for video items */}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-1">
                  <Play className="w-3 h-3 text-gray-800" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentMedia + 1) / mediaGallery.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}