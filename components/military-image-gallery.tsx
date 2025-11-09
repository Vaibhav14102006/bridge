"use client"

import { useState, useEffect } from "react"
import { Heart, Star, Users, Camera, MapPin } from "lucide-react"

interface MilitaryImage {
  id: string
  url: string
  caption: string
  category: "reunion" | "goodbye" | "letters" | "memories" | "base" | "love"
  emotion: "hopeful" | "nostalgic" | "intimate" | "peaceful"
}

const MilitaryImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Military love story images (placeholder URLs - in real app, these would be actual images)
  const militaryImages: MilitaryImage[] = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=600&fit=crop",
      caption: "The final goodbye at the airfield - 'I'll come back to you'",
      category: "goodbye",
      emotion: "intimate"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
      caption: "Writing letters under the stars - Distance means nothing",
      category: "letters",
      emotion: "nostalgic"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      caption: "The moment of reunion - You're my peace",
      category: "reunion", 
      emotion: "hopeful"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      caption: "Military base at sunset - Memories of home",
      category: "base",
      emotion: "peaceful"
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop",
      caption: "Love that conquers all distances",
      category: "love",
      emotion: "intimate"
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&h=600&fit=crop",
      caption: "Cherished memories - The quiet moments before goodbye", 
      category: "memories",
      emotion: "nostalgic"
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800&h=600&fit=crop",
      caption: "Golden sunset reunion - Hope and fulfillment",
      category: "reunion",
      emotion: "hopeful"
    },
    {
      id: "8",
      url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop",
      caption: "The feeling of home in someone's eyes",
      category: "love",
      emotion: "intimate"
    }
  ]

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % militaryImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [militaryImages.length])

  // Color schemes based on emotion
  const getEmotionColors = (emotion: string) => {
    switch (emotion) {
      case "hopeful":
        return "from-amber-200 via-yellow-300 to-orange-300" // Golden sunset
      case "nostalgic":
        return "from-pink-200 via-rose-300 to-red-300" // Warm pink/gold
      case "intimate":
        return "from-purple-200 via-pink-300 to-rose-300" // Soft lavender
      case "peaceful":
        return "from-blue-200 via-slate-300 to-gray-300" // Gray-blue
      default:
        return "from-gray-200 via-gray-300 to-gray-400"
    }
  }

  const currentImg = militaryImages[currentImage]

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-xl shadow-2xl">
      {/* Background Image with Emotion-Based Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentImg.url}
          alt={currentImg.caption}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          onLoad={() => setIsLoaded(true)}
        />
        {/* Emotion-based gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getEmotionColors(currentImg.emotion)} opacity-30 mix-blend-overlay`} />
        
        {/* Cinematic lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-white/20 animate-bounce"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
            size={16}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
            {currentImg.category === "reunion" && <Heart size={12} />}
            {currentImg.category === "letters" && <Star size={12} />}
            {currentImg.category === "base" && <MapPin size={12} />}
            {currentImg.category === "love" && <Heart size={12} />}
            {currentImg.category === "memories" && <Camera size={12} />}
            {currentImg.category === "goodbye" && <Users size={12} />}
            {currentImg.category.charAt(0).toUpperCase() + currentImg.category.slice(1)}
          </span>
        </div>

        {/* Caption with 3D Text Effect */}
        <h3 className="text-xl font-bold mb-2 drop-shadow-lg text-shadow-lg leading-tight">
          {currentImg.caption}
        </h3>

        {/* Emotional Quote */}
        <p className="text-sm opacity-90 italic font-light">
          {currentImg.emotion === "hopeful" && "Love that endures separation and sacrifice"}
          {currentImg.emotion === "nostalgic" && "Warm memories across the distance"}
          {currentImg.emotion === "intimate" && "The quiet moments that matter most"}
          {currentImg.emotion === "peaceful" && "Finding peace in connection"}
        </p>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {militaryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImage === index
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* 3D Animated Text - Emotional Messages */}
      <div className="absolute top-6 right-6 text-right">
        <div className="text-white font-bold text-sm drop-shadow-lg animate-pulse">
          {currentImg.emotion === "hopeful" && "I came back for you"}
          {currentImg.emotion === "nostalgic" && "Distance means nothing"}  
          {currentImg.emotion === "intimate" && "You're my peace"}
          {currentImg.emotion === "peaceful" && "Home is where you are"}
        </div>
      </div>

      {/* Loading Indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default MilitaryImageGallery