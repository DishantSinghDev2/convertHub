/**
 * Cross-format conversion utilities
 * Handles MP4→MP3, MP3→WAV, document conversions, etc.
 */

export interface ConversionConfig {
  sourceFormats: string[]
  targetFormats: string[]
  clientSide: boolean
  requiresServer: boolean
}

export const CROSS_FORMAT_CONVERSIONS: Record<string, ConversionConfig> = {
  "mp4-to-mp3": {
    sourceFormats: ["mp4", "mov", "avi", "webm", "mkv", "flv"],
    targetFormats: ["mp3", "wav", "aac", "flac", "ogg"],
    clientSide: true,
    requiresServer: false,
  },
  "mp3-to-wav": {
    sourceFormats: ["mp3", "aac", "flac", "ogg", "weba"],
    targetFormats: ["wav", "mp3", "flac"],
    clientSide: true,
    requiresServer: false,
  },
  "image-to-pdf": {
    sourceFormats: ["png", "jpg", "jpeg", "webp", "gif"],
    targetFormats: ["pdf"],
    clientSide: false,
    requiresServer: true,
  },
  "text-to-pdf": {
    sourceFormats: ["txt", "csv", "json", "xml", "html"],
    targetFormats: ["pdf"],
    clientSide: false,
    requiresServer: true,
  },
}

export async function extractAudioFromVideo(file: File, targetFormat: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.src = URL.createObjectURL(file)
    video.crossOrigin = "anonymous"

    video.onloadedmetadata = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioContext.createMediaElementAudioSource(video)
        const destination = audioContext.createMediaStreamDestination()

        source.connect(destination)
        source.connect(audioContext.destination)

        const mediaRecorder = new MediaRecorder(destination.stream, {
          mimeType: getMimeType(targetFormat),
        })

        const chunks: BlobPart[] = []
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: getMimeType(targetFormat) })
          resolve(blob)
          URL.revokeObjectURL(video.src)
        }

        mediaRecorder.start()
        video.play()

        video.onended = () => {
          mediaRecorder.stop()
        }
      } catch (error) {
        reject(error)
      }
    }

    video.onerror = () => reject(new Error("Failed to load video"))
  })
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    weba: "audio/webp",
    webm: "audio/webm",
  }
  return mimeTypes[format] || "audio/mpeg"
}

// Get video metadata
export async function getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.src = URL.createObjectURL(file)
    video.crossOrigin = "anonymous"

    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => reject(new Error("Failed to load video"))
  })
}

// Get audio metadata
export async function getAudioMetadata(file: File): Promise<{ duration: number }> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio")
    audio.src = URL.createObjectURL(file)
    audio.crossOrigin = "anonymous"

    audio.onloadedmetadata = () => {
      resolve({ duration: audio.duration })
      URL.revokeObjectURL(audio.src)
    }

    audio.onerror = () => reject(new Error("Failed to load audio"))
  })
}
