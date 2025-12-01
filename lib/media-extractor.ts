/**
 * Media extraction utilities for cross-format conversions
 * Handles video-to-audio extraction and audio stream processing
 */

export interface MediaMetadata {
  duration: number
  width?: number
  height?: number
  bitrate?: number
  frameRate?: number
}

export interface AudioStreamInfo {
  codec: string
  bitrate: number
  sampleRate: number
  channels: number
}

/**
 * Extract audio track from video with proper audio context handling
 */
export async function extractAudioTrack(
  file: File,
  targetFormat: string,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video")
      video.crossOrigin = "anonymous"
      const objectUrl = URL.createObjectURL(file)
      video.src = objectUrl

      video.onloadedmetadata = () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const source = audioContext.createMediaElementAudioSource(video)
          const destination = audioContext.createMediaStreamDestination()

          source.connect(destination)
          source.connect(audioContext.destination)

          const mimeType = getAudioMimeType(targetFormat)
          const mediaRecorder = new MediaRecorder(destination.stream, { mimeType })

          const chunks: BlobPart[] = []

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
            if (onProgress) {
              const progress = (video.currentTime / video.duration) * 100
              onProgress(Math.min(progress, 99))
            }
          }

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: mimeType })
            resolve(blob)
            URL.revokeObjectURL(objectUrl)
            onProgress?.(100)
          }

          mediaRecorder.onerror = (e) => {
            reject(new Error(`Media recorder error: ${e.error}`))
          }

          mediaRecorder.start()
          video.play().catch(() => {
            console.log("[v0] Video autoplay blocked, trying manual play")
          })

          video.onended = () => {
            mediaRecorder.stop()
          }

          // Fallback: Stop after duration
          setTimeout(
            () => {
              if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop()
              }
            },
            video.duration * 1000 + 1000,
          )
        } catch (error) {
          reject(error)
        }
      }

      video.onerror = () => {
        reject(new Error("Failed to load video file"))
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Get appropriate MIME type for audio format
 */
function getAudioMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    opus: "audio/opus",
    webm: "audio/webm",
    weba: "audio/webp",
  }

  return mimeTypes[format.toLowerCase()] || "audio/mpeg"
}

/**
 * Get video dimensions and duration
 */
export async function getVideoInfo(file: File): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.crossOrigin = "anonymous"
    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl

    video.onloadedmetadata = () => {
      const metadata: MediaMetadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      }
      URL.revokeObjectURL(objectUrl)
      resolve(metadata)
    }

    video.onerror = () => {
      reject(new Error("Failed to load video"))
    }
  })
}

/**
 * Convert audio between different formats using Web Audio API
 * Useful for audio-to-audio conversions
 */
export async function processAudioData(file: File, targetFormat: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const arrayBuffer = e.target?.result as ArrayBuffer

      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer) => {
          const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate,
          )

          const source = offlineContext.createBufferSource()
          source.buffer = audioBuffer
          source.connect(offlineContext.destination)
          source.start(0)

          offlineContext.startRendering().then((renderedBuffer) => {
            const blob = audioBufferToBlob(renderedBuffer, targetFormat)
            resolve(blob)
          })
        },
        (error) => {
          reject(new Error(`Audio decoding failed: ${error.message}`))
        },
      )
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Convert AudioBuffer to Blob
 */
function audioBufferToBlob(audioBuffer: AudioBuffer, format: string): Blob {
  const mimeType = getAudioMimeType(format)

  // Create WAV-like blob from AudioBuffer
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format_code = 1 // PCM
  const blockAlign = (numberOfChannels * 16) / 8
  const byteRate = sampleRate * blockAlign
  const dataSize = audioBuffer.length * blockAlign

  const arrayBuffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(arrayBuffer)
  const channels = []

  // WAV header
  const setUint16 = (data: number, offset: number) => view.setUint16(offset, data, true)
  const setUint32 = (data: number, offset: number) => view.setUint32(offset, data, true)

  setUint32(0x46464952, 0) // "RIFF"
  setUint32(36 + dataSize, 4)
  setUint32(0x45564157, 8) // "WAVE"
  setUint32(0x20746d66, 12) // "fmt " subchunk
  setUint32(16, 16) // subchunk1Size
  setUint16(format_code, 20)
  setUint16(numberOfChannels, 22)
  setUint32(sampleRate, 24)
  setUint32(byteRate, 28)
  setUint16(blockAlign, 32)
  setUint16(16, 34) // bits per sample
  setUint32(0x61746164, 36) // "data" subchunk
  setUint32(dataSize, 40)

  // Copy audio data
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i))
  }

  let offset = 44
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: mimeType })
}
