"use client"

import { useState, useEffect } from "react"
import { Camera, Users, Globe, Zap, Shield, Wifi } from "lucide-react"

const ProfessionalImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(0)

  // Professional communication images
  const images = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      title: "Global Communication",
      description: "Connect with teams worldwide instantly"
    },
    {
      id: "2", 
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
      title: "Seamless Collaboration",
      description: "Work together from anywhere in the world"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      title: "Team Excellence",
      description: "Building stronger connections through technology"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      title: "Innovation Hub",
      description: "Where ideas meet cutting-edge technology"
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
      title: "Digital Workspace",
      description: "Modern solutions for modern challenges"
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      title: "Connected Future",
      description: "Next-generation communication platform"
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop",
      title: "Professional Network",
      description: "Build meaningful professional relationships"
    },
    {
      id: "8",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      title: "Global Reach",
      description: "Connect across continents with ease"
    }
  ]

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  const currentImg = images[currentImage]

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentImg.url}
          alt={currentImg.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        {/* Professional overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 mix-blend-overlay" />
        
        {/* Professional lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
            <Globe size={12} />
            Professional
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 drop-shadow-lg leading-tight">
          {currentImg.title}
        </h3>

        {/* Description */}
        <p className="text-sm opacity-90 font-light">
          {currentImg.description}
        </p>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
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
    </div>
  )
}

export default ProfessionalImageGallery