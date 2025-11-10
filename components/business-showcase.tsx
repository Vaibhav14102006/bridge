"use client"
import React, { useState, useEffect } from 'react'

const businessImages = [
  {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    title: "Corporate Excellence",
    description: "Leading teams to success worldwide"
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    title: "Global Network",
    description: "Connected across 6 continents"
  },
  {
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
    title: "Innovation Hub",
    description: "Where breakthrough ideas come to life"
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    title: "Digital Transformation",
    description: "Revolutionizing business communication"
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
    title: "Strategic Planning",
    description: "Data-driven decisions for growth"
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    title: "Communication Tech",
    description: "Next-generation messaging platform"
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop",
    title: "Team Synergy",
    description: "Collaborative excellence in action"
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    title: "Future Workspace",
    description: "Hybrid work environment mastery"
  }
]

export default function BusinessShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % businessImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl shadow-2xl overflow-hidden">
      {/* Main Showcase Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={businessImages[currentIndex].src}
          alt={businessImages[currentIndex].title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-bold mb-2">
            {businessImages[currentIndex].title}
          </h3>
          <p className="text-lg opacity-90">
            {businessImages[currentIndex].description}
          </p>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 right-6 flex space-x-2">
          {businessImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-3">
          {businessImages.slice(0, 4).map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-20 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}