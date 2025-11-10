"use client"

import { useState, useEffect } from "react"
import { Camera, Video, MessageSquare, Mic, Share2, Users } from "lucide-react"

const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      id: "messaging",
      title: "Instant Messaging",
      description: "Real-time communication with advanced features",
      icon: MessageSquare,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "video",
      title: "HD Video Calls",
      description: "Crystal clear video communication worldwide",
      icon: Video,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "voice",
      title: "Voice Calls",
      description: "High-quality audio with noise cancellation",
      icon: Mic,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      color: "from-green-500 to-teal-500"
    },
    {
      id: "groups",
      title: "Group Collaboration",
      description: "Connect teams and communities effortlessly",
      icon: Users,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "sharing",
      title: "File Sharing",
      description: "Share documents, images, and media instantly",
      icon: Share2,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "capture",
      title: "Media Capture",
      description: "Built-in camera and recording capabilities",
      icon: Camera,
      image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=400&fit=crop",
      color: "from-yellow-500 to-orange-500"
    }
  ]

  // Auto-cycle features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  const currentFeature = features[activeFeature]
  const IconComponent = currentFeature.icon

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentFeature.image}
          alt={currentFeature.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out opacity-30"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-20 mix-blend-overlay`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          {/* Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentFeature.color} flex items-center justify-center shadow-2xl`}>
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">
            {currentFeature.title}
          </h3>

          {/* Description */}
          <p className="text-lg opacity-90 leading-relaxed drop-shadow-lg">
            {currentFeature.description}
          </p>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {features.map((feature, index) => {
          const FeatureIcon = feature.icon
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className={`p-2 rounded-full transition-all duration-300 ${
                activeFeature === index
                  ? "bg-white text-gray-900 scale-110 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              title={feature.title}
            >
              <FeatureIcon size={16} />
            </button>
          )
        })}
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-4 right-4">
        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${currentFeature.color} transition-all duration-5000 ease-linear`}
            style={{ width: `${((activeFeature + 1) / features.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default FeatureShowcase