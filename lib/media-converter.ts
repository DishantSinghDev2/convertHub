/**
 * Media (video/audio) conversion utilities
 * Note: Full transcoding requires ffmpeg.wasm for client-side processing
 * or server-side ffmpeg for larger files
 * This module provides the integration layer
 */

export interface MediaConversionOptions {
  bitrate?: string // e.g., '128k', '256k', '320k' for audio
  videoCodec?: string
  audioCodec?: string
  preset?: "fast" | "medium" | "slow" // compression preset
  duration?: number // limit duration in seconds
}

export interface MediaMetadata {
  duration: number
  width?: number
  height?: number
  audioCodec?: string
  videoCodec?: string
  bitrate?: string
}

// Placeholder for client-side conversion
// In production, integrate with ffmpeg.wasm or similar
export async function convertMediaClientSide(
  file: File,
  targetFormat: string,
  options: MediaConversionOptions = {},
): Promise<Blob> {
  throw new Error("Client-side media conversion requires FFmpeg.wasm integration. File will be processed server-side.")
}

// Get media metadata from file
export async function getMediaMetadata(file: File): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const video = document.createElement("video")

    const isAudio = file.type.startsWith("audio/")
    const isVideo = file.type.startsWith("video/")

    if (isAudio) {
      audio.addEventListener(
        "loadedmetadata",
        () => {
          resolve({
            duration: audio.duration,
          })
        },
        { once: true },
      )
      audio.addEventListener("error", () => reject(new Error("Failed to load audio metadata")), { once: true })
      audio.src = URL.createObjectURL(file)
    } else if (isVideo) {
      video.addEventListener(
        "loadedmetadata",
        () => {
          resolve({
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
          })
        },
        { once: true },
      )
      video.addEventListener("error", () => reject(new Error("Failed to load video metadata")), { once: true })
      video.src = URL.createObjectURL(file)
    } else {
      reject(new Error("Invalid media file"))
    }
  })
}

// Audio extraction from video (client-side using Web Audio API)
export async function extractAudioFromVideo(file: File, targetFormat: string): Promise<Blob> {
  // This requires Web Audio API and offline audio context
  // Simplified version returns placeholder
  // Full implementation would need audio processing
  throw new Error("Audio extraction from video requires advanced processing. Will use server-side conversion.")
}

// Format preset suggestions
export const AUDIO_BITRATES = [
  { value: "64k", label: "64 kbps - Small files (speech)" },
  { value: "128k", label: "128 kbps - Balanced (default)" },
  { value: "192k", label: "192 kbps - High quality" },
  { value: "320k", label: "320 kbps - Lossless quality" },
]

export const VIDEO_PRESETS = [
  { value: "fast", label: "Fast - Larger files, quick conversion" },
  { value: "medium", label: "Medium - Balanced quality and size" },
  { value: "slow", label: "Slow - Best compression, takes longer" },
]
