/**
 * Image conversion utilities with client-side canvas processing
 * Supports PNG, JPG, WebP, AVIF, GIF, SVG with quality and resize
 */

export interface ImageConversionOptions {
  quality?: number
  width?: number
  height?: number
  maintainAspectRatio?: boolean
}

export async function convertImageToFormat(
  file: File,
  format: string,
  options: ImageConversionOptions = {},
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          if (options.width && options.height) {
            width = options.width
            height = options.height
          } else if (options.width) {
            width = options.width
            if (options.maintainAspectRatio) {
              height = Math.round((img.height * width) / img.width)
            }
          } else if (options.height) {
            height = options.height
            if (options.maintainAspectRatio) {
              width = Math.round((img.width * height) / img.height)
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Failed to get canvas context")

          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) reject(new Error("Canvas conversion failed"))
              else resolve(blob)
            },
            `image/${format === "jpg" ? "jpeg" : format === "svg" ? "svg+xml" : format}`,
            format === "png" || format === "gif" ? undefined : (options.quality ?? 0.85),
          )
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export async function convertToSvg(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          // Create SVG with embedded image
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
              <image width="${img.width}" height="${img.height}" href="${e.target?.result}"/>
            </svg>
          `
          const blob = new Blob([svg], { type: "image/svg+xml" })
          resolve(blob)
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export async function getImageMetadata(file: File): Promise<{ width: number; height: number; format: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "unknown"
        resolve({
          width: img.width,
          height: img.height,
          format: ext,
        })
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}
