"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File, type: "image" | "video" | "file") => void
  isLoading?: boolean
}

export default function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      onFileSelect(file, "image")
    } else if (file.type.startsWith("video/")) {
      onFileSelect(file, "video")
    } else {
      onFileSelect(file, "file")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files?.length) {
      handleFile(files[0])
    }
  }

  return (
    <label
      className={`relative cursor-pointer p-2 rounded-full transition-all hover:bg-muted ${
        isDragging ? "bg-primary/20" : ""
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      title="Attach file"
    >
      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      <input
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleInputChange}
        disabled={isLoading}
        className="hidden"
        aria-label="Upload file"
      />
    </label>
  )
}
