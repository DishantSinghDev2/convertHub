/**
 * Bulk file conversion utilities
 * Handles multiple file conversions simultaneously with cross-format support
 */

export interface BulkConversionTask {
  file: File
  sourceFormat: string
  targetFormat: string
  options?: Record<string, any>
}

export interface BulkConversionResult {
  filename: string
  success: boolean
  blob?: Blob
  error?: string
  processingTime: number
}

export interface BulkConversionProgress {
  completed: number
  total: number
  currentFile: string
  results: BulkConversionResult[]
}

const IMAGE_FORMATS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "avif",
  "bmp",
  "tiff",
  "ico",
  "heic",
  "jfif",
  "apng",
  "jp2",
]

const AUDIO_FORMATS = [
  "mp3",
  "wav",
  "flac",
  "aac",
  "m4a",
  "ogg",
  "wma",
  "opus",
  "webm",
  "ac3",
  "dts",
  "alac",
  "ape",
  "mid",
  "midi",
  "aiff",
  "au",
  "voc",
  "speex",
  "tta",
  "wv",
  "vorbis",
  "weba",
  "webma",
]

const VIDEO_FORMATS = [
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "flv",
  "wmv",
  "m4v",
  "mpeg",
  "mpg",
  "ts",
  "mts",
  "vob",
  "ogv",
  "3gp",
  "f4v",
  "m2ts",
  "asf",
  "divx",
]

function isImageFormat(format: string): boolean {
  return IMAGE_FORMATS.includes(format.toLowerCase())
}

function isVideoFormat(format: string): boolean {
  return VIDEO_FORMATS.includes(format.toLowerCase())
}

function isAudioFormat(format: string): boolean {
  return AUDIO_FORMATS.includes(format.toLowerCase())
}

export async function performBulkConversion(
  tasks: BulkConversionTask[],
  onProgress: (progress: BulkConversionProgress) => void,
  maxConcurrent = 3,
): Promise<BulkConversionResult[]> {
  const results: BulkConversionResult[] = []
  const queue = [...tasks]
  let inProgress = 0
  let completed = 0

  const processTask = async (task: BulkConversionTask): Promise<void> => {
    const startTime = Date.now()
    const newName = `${task.file.name.split(".")[0]}_converted.${task.targetFormat}`

    try {
      onProgress({
        completed,
        total: tasks.length,
        currentFile: task.file.name,
        results,
      })

      let blob: Blob

      if (isImageFormat(task.sourceFormat) && isImageFormat(task.targetFormat)) {
        console.log("[v0] Image conversion:", task.file.name, "→", task.targetFormat)
        const { convertImageToFormat } = await import("./image-converter.tsx")
        blob = await convertImageToFormat(task.file, task.targetFormat, task.options || { quality: 0.85 })
      } else if (isVideoFormat(task.sourceFormat) && isAudioFormat(task.targetFormat)) {
        console.log("[v0] Audio extraction:", task.file.name, "→", task.targetFormat)
        const { extractAudioFromVideo } = await import("./format-converter")
        blob = await extractAudioFromVideo(task.file, task.targetFormat)
      } else if (isAudioFormat(task.sourceFormat) && isAudioFormat(task.targetFormat)) {
        console.log("[v0] Audio conversion:", task.file.name, "→", task.targetFormat)
        blob = await convertViaServer(task.file, task.targetFormat)
      } else if (isVideoFormat(task.sourceFormat) && isVideoFormat(task.targetFormat)) {
        console.log("[v0] Video conversion:", task.file.name, "→", task.targetFormat)
        blob = await convertViaServer(task.file, task.targetFormat)
      } else {
        console.log("[v0] Document conversion:", task.file.name, "→", task.targetFormat)
        blob = await convertViaServer(task.file, task.targetFormat)
      }

      results.push({
        filename: newName,
        success: true,
        blob,
        processingTime: Date.now() - startTime,
      })
    } catch (error) {
      console.error("[v0] Conversion error:", error)
      results.push({
        filename: `${task.file.name.split(".")[0]}_converted.${task.targetFormat}`,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        processingTime: Date.now() - startTime,
      })
    }

    completed++
    inProgress--

    if (queue.length > 0) {
      const nextTask = queue.shift()
      if (nextTask) {
        inProgress++
        processTask(nextTask)
      }
    }

    onProgress({
      completed,
      total: tasks.length,
      currentFile: "",
      results,
    })
  }

  // Start initial concurrent batch
  while (inProgress < maxConcurrent && queue.length > 0) {
    const task = queue.shift()
    if (task) {
      inProgress++
      processTask(task)
    }
  }

  // Wait for all to complete
  while (inProgress > 0 || queue.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return results
}

async function convertViaServer(file: File, targetFormat: string): Promise<Blob> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("targetFormat", targetFormat)

  const response = await fetch("/api/convert", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Server conversion failed: ${response.statusText}`)
  }

  return response.blob()
}
