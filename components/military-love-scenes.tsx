"use client"

import { useState, useEffect } from "react"
import { Heart, Mail, Plane, Home } from "lucide-react"

interface Scene3D {
  id: string
  title: string
  description: string
  icon: any
  backgroundImage: string
  lighting: "sunset" | "moonlight" | "campfire" | "dawn"
  emotion: "goodbye" | "longing" | "reunion" | "love"
}

const MilitaryLoveScenes = () => {
  const [activeScene, setActiveScene] = useState(0)
  const [animationPhase, setAnimationPhase] = useState("enter")

  const scenes: Scene3D[] = [
    {
      id: "goodbye",
      title: "The Goodbye",
      description: "Military airfield at dawn - A gentle touch, an exchange of dog tags, helicopter rotors in the distance",
      icon: Plane,
      backgroundImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&h=800&fit=crop",
      lighting: "dawn",
      emotion: "goodbye"
    },
    {
      id: "letters",
      title: "Letters Across the Distance", 
      description: "Split worlds - one writing at a desk, the other reading under tent light. Words float through space",
      icon: Mail,
      backgroundImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=800&fit=crop",
      lighting: "moonlight",
      emotion: "longing"
    },
    {
      id: "reunion",
      title: "The Reunion",
      description: "Base gate at sunset - They drop their bags, run forward, meet halfway in a golden embrace",
      icon: Heart,
      backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop", 
      lighting: "sunset",
      emotion: "reunion"
    },
    {
      id: "love",
      title: "Forever Home",
      description: "The feeling of home in someone's eyes - hands clasped, light glowing between fingers",
      icon: Home,
      backgroundImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=800&fit=crop",
      lighting: "campfire",
      emotion: "love"
    }
  ]

  // Auto-cycle scenes with animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase("exit")
      setTimeout(() => {
        setActiveScene((prev) => (prev + 1) % scenes.length)
        setAnimationPhase("enter")
      }, 1000)
    }, 8000)
    return () => clearInterval(interval)
  }, [scenes.length])

  // Get lighting colors based on scene
  const getLightingStyle = (lighting: string) => {
    switch (lighting) {
      case "sunset":
        return {
          gradient: "from-amber-300 via-orange-400 to-red-400",
          glow: "shadow-amber-500/50",
          particles: "bg-yellow-200"
        }
      case "moonlight":
        return {
          gradient: "from-blue-300 via-slate-400 to-gray-500", 
          glow: "shadow-blue-500/50",
          particles: "bg-blue-200"
        }
      case "campfire":
        return {
          gradient: "from-orange-400 via-red-400 to-pink-400",
          glow: "shadow-orange-500/50", 
          particles: "bg-orange-200"
        }
      case "dawn":
        return {
          gradient: "from-pink-300 via-purple-400 to-blue-400",
          glow: "shadow-pink-500/50",
          particles: "bg-pink-200"
        }
      default:
        return {
          gradient: "from-gray-300 via-gray-400 to-gray-500",
          glow: "shadow-gray-500/50",
          particles: "bg-gray-200"
        }
    }
  }

  const currentScene = scenes[activeScene]
  const lighting = getLightingStyle(currentScene.lighting)
  const IconComponent = currentScene.icon

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {/* 3D Scene Background */}
      <div className="absolute inset-0">
        <img
          src={currentScene.backgroundImage}
          alt={currentScene.title}
          className={`w-full h-full object-cover transition-all duration-2000 ease-in-out ${
            animationPhase === "enter" ? "scale-100 opacity-100" : "scale-110 opacity-70"
          }`}
        />
        
        {/* Dynamic Lighting Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${lighting.gradient} opacity-40 mix-blend-overlay`} />
        
        {/* Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
      </div>

      {/* Floating 3D Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${lighting.particles} rounded-full opacity-60 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* 3D Animated Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Icon with 3D Effect */}
        <div className={`relative ${lighting.glow} shadow-2xl`}>
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${lighting.gradient} flex items-center justify-center border-4 border-white/30 backdrop-blur-sm ${
            animationPhase === "enter" ? "animate-bounce" : "animate-pulse"
          }`}>
            <IconComponent className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          
          {/* Glowing Ring Effect */}
          <div className={`absolute inset-0 rounded-full border-2 border-white/50 animate-ping`} />
        </div>
      </div>

      {/* Animated 3D Text */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className={`transition-all duration-1000 ${
          animationPhase === "enter" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          <h2 className="text-4xl font-bold mb-4 drop-shadow-2xl">
            {currentScene.title}
          </h2>
          <p className="text-lg leading-relaxed drop-shadow-lg max-w-2xl">
            {currentScene.description}
          </p>
          
          {/* Emotional Quote */}
          <div className="mt-4 italic text-xl font-light opacity-90">
            {currentScene.emotion === "goodbye" && '"I\'ll find my way back to you"'}
            {currentScene.emotion === "longing" && '"Your letters are my lifeline"'}
            {currentScene.emotion === "reunion" && '"You\'re worth every mile traveled"'}
            {currentScene.emotion === "love" && '"In your eyes, I\'m finally home"'}
          </div>
        </div>
      </div>

      {/* Scene Navigation */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => {
              setActiveScene(index)
              setAnimationPhase("enter")
            }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              activeScene === index
                ? `bg-white ${lighting.glow} scale-125`
                : "bg-white/50 hover:bg-white/75"
            }`}
            title={scene.title}
          />
        ))}
      </div>

      {/* 3D Progress Bar */}
      <div className="absolute bottom-4 left-8 right-8">
        <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${lighting.gradient} transition-all duration-8000 ease-linear`}
            style={{ width: `${((activeScene + 1) / scenes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lens Flare Effect */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 pointer-events-none">
        <div className={`w-full h-full rounded-full bg-gradient-radial from-white/30 via-transparent to-transparent animate-pulse opacity-50`} />
      </div>
    </div>
  )
}

export default MilitaryLoveScenes