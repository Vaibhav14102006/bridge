"use client"

import { File } from "lucide-react"

interface MessageMediaProps {
  type: "image" | "video" | "file"
  src: string
  fileName?: string
}

export default function MessageMedia({ type, src, fileName }: MessageMediaProps) {
  if (type === "image") {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt="Shared image"
        className="max-w-xs rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      />
    )
  }

  if (type === "video") {
    return <video src={src} controls className="max-w-xs rounded-lg shadow-lg hover:shadow-xl transition-shadow" />
  }

  return (
    <a
      href={src}
      download
      className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
    >
      <File className="w-5 h-5 text-primary" />
      <span className="text-sm text-primary hover:underline">{fileName || "Download file"}</span>
    </a>
  )
}
