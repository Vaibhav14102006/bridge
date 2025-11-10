/**
 * Media Compression Utility
 * Compresses images and videos before uploading to reduce database storage
 */

export interface CompressionResult {
  compressed: string | Blob
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * Compress image to maximum 800px width/height and reduce quality
 * @param file - Image file to compress
 * @param maxWidth - Maximum width (default: 800px)
 * @param maxHeight - Maximum height (default: 800px)
 * @param quality - JPEG quality 0-1 (default: 0.6 for 60%)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.6
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const originalSize = file.size

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        // Create canvas and draw compressed image
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Use better image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to compressed format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"))
              return
            }

            const compressedSize = blob.size
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

            console.log(`[Compression] Image: ${originalSize} → ${compressedSize} bytes (${compressionRatio.toFixed(1)}% saved)`)

            resolve({
              compressed: blob,
              originalSize,
              compressedSize,
              compressionRatio,
            })
          },
          "image/jpeg",
          quality
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Compress video by reducing quality and resolution
 * Note: Browser-based video compression is limited. This creates a lower quality preview.
 * For production, use server-side compression with ffmpeg
 */
export async function compressVideo(file: File): Promise<CompressionResult> {
  // For now, we'll just return the original file with a note
  // In production, you'd want server-side compression
  const originalSize = file.size

  console.log(`[Compression] Video compression requires server-side processing`)
  console.log(`[Compression] Original video size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
  
  // Limit video file size to 5MB
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (originalSize > maxSize) {
    throw new Error(`Video size exceeds 5MB limit. Please compress it externally first.`)
  }

  return {
    compressed: file,
    originalSize,
    compressedSize: originalSize,
    compressionRatio: 0,
  }
}

/**
 * Convert file to base64 string (for small files only)
 * @param file - File to convert
 * @param maxSize - Maximum allowed size in bytes (default: 1MB)
 */
export async function fileToBase64(file: File, maxSize: number = 1024 * 1024): Promise<string> {
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Check if file type is supported for compression
 */
export function isCompressibleImage(file: File): boolean {
  return file.type.startsWith("image/") && !file.type.includes("gif")
}

export function isCompressibleVideo(file: File): boolean {
  return file.type.startsWith("video/")
}
