/**
 * Core file conversion utilities and configuration
 * Handles file size detection, format validation, and conversion strategies
 */

export const FILE_SIZE_THRESHOLDS = {
  CLIENT_SIDE_LIMIT: 50 * 1024 * 1024, // 50MB
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
} as const

export interface FileConversionConfig {
  name: string
  extensions: string[]
  mimeTypes: string[]
  category: "image" | "document" | "video" | "audio" | "archive" | "text"
  clientSideConverter?: (file: File) => Promise<Blob>
  apiEndpoint?: string
  description: string
}

export interface ConversionResult {
  success: boolean
  blob?: Blob
  filename?: string
  error?: string
  processingTime?: number
  processedClientSide?: boolean
}

export const SUPPORTED_FORMATS: Record<string, FileConversionConfig> = {
  // Image formats (14 total)
  png: {
    name: "PNG Image",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    category: "image",
    description: "Portable Network Graphics - Lossless, supports transparency",
    apiEndpoint: "/api/convert/image",
  },
  jpg: {
    name: "JPEG Image",
    extensions: ["jpg", "jpeg"],
    mimeTypes: ["image/jpeg"],
    category: "image",
    description: "JPEG - Lossy compression, best for photographs",
    apiEndpoint: "/api/convert/image",
  },
  jpeg: {
    name: "JPEG Image",
    extensions: ["jpeg"],
    mimeTypes: ["image/jpeg"],
    category: "image",
    description: "JPEG - Lossy compression, best for photographs",
    apiEndpoint: "/api/convert/image",
  },
  webp: {
    name: "WebP Image",
    extensions: ["webp"],
    mimeTypes: ["image/webp"],
    category: "image",
    description: "WebP - Modern format with better compression",
    apiEndpoint: "/api/convert/image",
  },
  gif: {
    name: "GIF Image",
    extensions: ["gif"],
    mimeTypes: ["image/gif"],
    category: "image",
    description: "GIF - Supports animation and transparency",
    apiEndpoint: "/api/convert/image",
  },
  svg: {
    name: "SVG Image",
    extensions: ["svg"],
    mimeTypes: ["image/svg+xml"],
    category: "image",
    description: "Scalable Vector Graphics - Resolution-independent",
    apiEndpoint: "/api/convert/image",
  },
  avif: {
    name: "AVIF Image",
    extensions: ["avif"],
    mimeTypes: ["image/avif"],
    category: "image",
    description: "AVIF - Next-gen format with superior compression",
    apiEndpoint: "/api/convert/image",
  },
  bmp: {
    name: "BMP Image",
    extensions: ["bmp"],
    mimeTypes: ["image/bmp"],
    category: "image",
    description: "Bitmap - Uncompressed image format",
    apiEndpoint: "/api/convert/image",
  },
  tiff: {
    name: "TIFF Image",
    extensions: ["tiff", "tif"],
    mimeTypes: ["image/tiff"],
    category: "image",
    description: "TIFF - Tagged image format for scanning/printing",
    apiEndpoint: "/api/convert/image",
  },
  ico: {
    name: "ICO Image",
    extensions: ["ico"],
    mimeTypes: ["image/x-icon"],
    category: "image",
    description: "ICO - Icon format for web",
    apiEndpoint: "/api/convert/image",
  },
  heic: {
    name: "HEIC Image",
    extensions: ["heic", "heif"],
    mimeTypes: ["image/heic"],
    category: "image",
    description: "HEIC - High Efficiency Image Container",
    apiEndpoint: "/api/convert/image",
  },
  jfif: {
    name: "JFIF Image",
    extensions: ["jfif"],
    mimeTypes: ["image/jpeg"],
    category: "image",
    description: "JFIF - JPEG File Interchange Format",
    apiEndpoint: "/api/convert/image",
  },
  apng: {
    name: "APNG Image",
    extensions: ["apng"],
    mimeTypes: ["image/apng"],
    category: "image",
    description: "APNG - Animated PNG format",
    apiEndpoint: "/api/convert/image",
  },
  jp2: {
    name: "JPEG 2000",
    extensions: ["jp2", "j2k"],
    mimeTypes: ["image/jp2"],
    category: "image",
    description: "JPEG 2000 - Advanced image compression",
    apiEndpoint: "/api/convert/image",
  },

  // Document formats (20+ total)
  pdf: {
    name: "PDF Document",
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"],
    category: "document",
    description: "PDF - Portable Document Format",
    apiEndpoint: "/api/convert/document",
  },
  docx: {
    name: "Word Document",
    extensions: ["docx"],
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    category: "document",
    description: "DOCX - Microsoft Word format",
    apiEndpoint: "/api/convert/document",
  },
  doc: {
    name: "Word Document",
    extensions: ["doc"],
    mimeTypes: ["application/msword"],
    category: "document",
    description: "DOC - Microsoft Word 97-2003",
    apiEndpoint: "/api/convert/document",
  },
  xlsx: {
    name: "Excel Spreadsheet",
    extensions: ["xlsx"],
    mimeTypes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    category: "document",
    description: "XLSX - Microsoft Excel format",
    apiEndpoint: "/api/convert/document",
  },
  xls: {
    name: "Excel Spreadsheet",
    extensions: ["xls"],
    mimeTypes: ["application/vnd.ms-excel"],
    category: "document",
    description: "XLS - Microsoft Excel 97-2003",
    apiEndpoint: "/api/convert/document",
  },
  pptx: {
    name: "PowerPoint Presentation",
    extensions: ["pptx"],
    mimeTypes: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    category: "document",
    description: "PPTX - Microsoft PowerPoint",
    apiEndpoint: "/api/convert/document",
  },
  ppt: {
    name: "PowerPoint Presentation",
    extensions: ["ppt"],
    mimeTypes: ["application/vnd.ms-powerpoint"],
    category: "document",
    description: "PPT - Microsoft PowerPoint 97-2003",
    apiEndpoint: "/api/convert/document",
  },
  csv: {
    name: "CSV File",
    extensions: ["csv"],
    mimeTypes: ["text/csv"],
    category: "document",
    description: "CSV - Comma-separated values",
    apiEndpoint: "/api/convert/document",
  },
  json: {
    name: "JSON File",
    extensions: ["json"],
    mimeTypes: ["application/json"],
    category: "document",
    description: "JSON - JavaScript Object Notation",
    apiEndpoint: "/api/convert/document",
  },
  xml: {
    name: "XML File",
    extensions: ["xml"],
    mimeTypes: ["application/xml"],
    category: "document",
    description: "XML - Extensible Markup Language",
    apiEndpoint: "/api/convert/document",
  },
  yaml: {
    name: "YAML File",
    extensions: ["yaml", "yml"],
    mimeTypes: ["application/yaml"],
    category: "document",
    description: "YAML - YAML Ain't Markup Language",
    apiEndpoint: "/api/convert/document",
  },
  toml: {
    name: "TOML File",
    extensions: ["toml"],
    mimeTypes: ["application/toml"],
    category: "document",
    description: "TOML - Tom's Obvious, Minimal Language",
    apiEndpoint: "/api/convert/document",
  },
  txt: {
    name: "Text File",
    extensions: ["txt"],
    mimeTypes: ["text/plain"],
    category: "text",
    description: "TXT - Plain text file",
    apiEndpoint: "/api/convert/document",
  },
  html: {
    name: "HTML Document",
    extensions: ["html", "htm"],
    mimeTypes: ["text/html"],
    category: "document",
    description: "HTML - HyperText Markup Language",
    apiEndpoint: "/api/convert/document",
  },
  rtf: {
    name: "Rich Text Format",
    extensions: ["rtf"],
    mimeTypes: ["application/rtf"],
    category: "document",
    description: "RTF - Rich Text Format",
    apiEndpoint: "/api/convert/document",
  },
  odt: {
    name: "OpenDocument Text",
    extensions: ["odt"],
    mimeTypes: ["application/vnd.oasis.opendocument.text"],
    category: "document",
    description: "ODT - OpenDocument Text format",
    apiEndpoint: "/api/convert/document",
  },
  ods: {
    name: "OpenDocument Spreadsheet",
    extensions: ["ods"],
    mimeTypes: ["application/vnd.oasis.opendocument.spreadsheet"],
    category: "document",
    description: "ODS - OpenDocument Spreadsheet",
    apiEndpoint: "/api/convert/document",
  },
  odp: {
    name: "OpenDocument Presentation",
    extensions: ["odp"],
    mimeTypes: ["application/vnd.oasis.opendocument.presentation"],
    category: "document",
    description: "ODP - OpenDocument Presentation",
    apiEndpoint: "/api/convert/document",
  },
  tsv: {
    name: "Tab-Separated Values",
    extensions: ["tsv"],
    mimeTypes: ["text/tab-separated-values"],
    category: "document",
    description: "TSV - Tab-separated values file",
    apiEndpoint: "/api/convert/document",
  },
  latex: {
    name: "LaTeX Document",
    extensions: ["tex", "latex"],
    mimeTypes: ["application/x-latex"],
    category: "document",
    description: "LaTeX - Document typesetting format",
    apiEndpoint: "/api/convert/document",
  },

  // Video formats (20+ total)
  mp4: {
    name: "MP4 Video",
    extensions: ["mp4"],
    mimeTypes: ["video/mp4"],
    category: "video",
    description: "MP4 - Most compatible video format",
    apiEndpoint: "/api/convert/video",
  },
  webm: {
    name: "WebM Video",
    extensions: ["webm"],
    mimeTypes: ["video/webm"],
    category: "video",
    description: "WebM - Open-source format for web",
    apiEndpoint: "/api/convert/video",
  },
  mov: {
    name: "MOV Video",
    extensions: ["mov"],
    mimeTypes: ["video/quicktime"],
    category: "video",
    description: "MOV - QuickTime video format",
    apiEndpoint: "/api/convert/video",
  },
  avi: {
    name: "AVI Video",
    extensions: ["avi"],
    mimeTypes: ["video/x-msvideo"],
    category: "video",
    description: "AVI - Audio Video Interleave format",
    apiEndpoint: "/api/convert/video",
  },
  mkv: {
    name: "Matroska Video",
    extensions: ["mkv"],
    mimeTypes: ["video/x-matroska"],
    category: "video",
    description: "MKV - Matroska multimedia container",
    apiEndpoint: "/api/convert/video",
  },
  flv: {
    name: "Flash Video",
    extensions: ["flv"],
    mimeTypes: ["video/x-flv"],
    category: "video",
    description: "FLV - Flash video format",
    apiEndpoint: "/api/convert/video",
  },
  wmv: {
    name: "Windows Media Video",
    extensions: ["wmv"],
    mimeTypes: ["video/x-ms-wmv"],
    category: "video",
    description: "WMV - Windows Media Video",
    apiEndpoint: "/api/convert/video",
  },
  m4v: {
    name: "MPEG-4 Video",
    extensions: ["m4v"],
    mimeTypes: ["video/x-m4v"],
    category: "video",
    description: "M4V - MPEG-4 video (usually protected)",
    apiEndpoint: "/api/convert/video",
  },
  mpg: {
    name: "MPEG Video",
    extensions: ["mpg", "mpeg"],
    mimeTypes: ["video/mpeg"],
    category: "video",
    description: "MPEG - Motion Picture Experts Group",
    apiEndpoint: "/api/convert/video",
  },
  ts: {
    name: "MPEG Transport Stream",
    extensions: ["ts", "mts"],
    mimeTypes: ["video/mp2t"],
    category: "video",
    description: "TS - MPEG Transport Stream",
    apiEndpoint: "/api/convert/video",
  },
  vob: {
    name: "DVD Video",
    extensions: ["vob"],
    mimeTypes: ["video/x-msvideo"],
    category: "video",
    description: "VOB - DVD Video Object",
    apiEndpoint: "/api/convert/video",
  },
  ogv: {
    name: "Ogg Video",
    extensions: ["ogv"],
    mimeTypes: ["video/ogg"],
    category: "video",
    description: "OGV - Ogg Theora video",
    apiEndpoint: "/api/convert/video",
  },
  "3gp": {
    name: "3G Mobile Video",
    extensions: ["3gp"],
    mimeTypes: ["video/3gpp"],
    category: "video",
    description: "3GP - 3G mobile phone video",
    apiEndpoint: "/api/convert/video",
  },
  f4v: {
    name: "Flash Video",
    extensions: ["f4v"],
    mimeTypes: ["video/x-f4v"],
    category: "video",
    description: "F4V - Flash MP4 video",
    apiEndpoint: "/api/convert/video",
  },
  m2ts: {
    name: "MPEG-2 Transport Stream",
    extensions: ["m2ts"],
    mimeTypes: ["video/mp2t"],
    category: "video",
    description: "M2TS - MPEG-2 Transport Stream",
    apiEndpoint: "/api/convert/video",
  },
  asf: {
    name: "Advanced Systems Format",
    extensions: ["asf"],
    mimeTypes: ["video/x-ms-asf"],
    category: "video",
    description: "ASF - Windows Advanced Systems Format",
    apiEndpoint: "/api/convert/video",
  },
  divx: {
    name: "DivX Video",
    extensions: ["divx"],
    mimeTypes: ["video/x-divx"],
    category: "video",
    description: "DIVX - DivX video format",
    apiEndpoint: "/api/convert/video",
  },

  // Audio formats (25+ total)
  mp3: {
    name: "MP3 Audio",
    extensions: ["mp3"],
    mimeTypes: ["audio/mpeg"],
    category: "audio",
    description: "MP3 - Most popular audio format",
    apiEndpoint: "/api/convert/audio",
  },
  wav: {
    name: "WAV Audio",
    extensions: ["wav"],
    mimeTypes: ["audio/wav"],
    category: "audio",
    description: "WAV - Uncompressed audio format",
    apiEndpoint: "/api/convert/audio",
  },
  webma: {
    name: "WebA Audio",
    extensions: ["weba"],
    mimeTypes: ["audio/webp"],
    category: "audio",
    description: "WebA - WebP audio format",
    apiEndpoint: "/api/convert/audio",
  },
  flac: {
    name: "FLAC Audio",
    extensions: ["flac"],
    mimeTypes: ["audio/flac"],
    category: "audio",
    description: "FLAC - Free Lossless Audio Codec",
    apiEndpoint: "/api/convert/audio",
  },
  aac: {
    name: "AAC Audio",
    extensions: ["aac", "m4a"],
    mimeTypes: ["audio/aac", "audio/mp4"],
    category: "audio",
    description: "AAC - Advanced Audio Codec",
    apiEndpoint: "/api/convert/audio",
  },
  m4a: {
    name: "MPEG-4 Audio",
    extensions: ["m4a"],
    mimeTypes: ["audio/mp4"],
    category: "audio",
    description: "M4A - MPEG-4 audio (iTunes)",
    apiEndpoint: "/api/convert/audio",
  },
  ogg: {
    name: "OGG Audio",
    extensions: ["ogg", "oga"],
    mimeTypes: ["audio/ogg"],
    category: "audio",
    description: "OGG - Ogg Vorbis audio",
    apiEndpoint: "/api/convert/audio",
  },
  wma: {
    name: "Windows Media Audio",
    extensions: ["wma"],
    mimeTypes: ["audio/x-ms-wma"],
    category: "audio",
    description: "WMA - Windows Media Audio",
    apiEndpoint: "/api/convert/audio",
  },
  opus: {
    name: "Opus Audio",
    extensions: ["opus"],
    mimeTypes: ["audio/opus"],
    category: "audio",
    description: "Opus - Highly efficient audio codec",
    apiEndpoint: "/api/convert/audio",
  },
  webmAudio: {
    name: "WebM Audio",
    extensions: ["webm"],
    mimeTypes: ["audio/webm"],
    category: "audio",
    description: "WebM - WebM audio format",
    apiEndpoint: "/api/convert/audio",
  },
  ac3: {
    name: "Dolby Digital Audio",
    extensions: ["ac3"],
    mimeTypes: ["audio/ac3"],
    category: "audio",
    description: "AC3 - Dolby Digital audio",
    apiEndpoint: "/api/convert/audio",
  },
  dts: {
    name: "DTS Audio",
    extensions: ["dts"],
    mimeTypes: ["audio/vnd.dts"],
    category: "audio",
    description: "DTS - DTS digital audio",
    apiEndpoint: "/api/convert/audio",
  },
  alac: {
    name: "Apple Lossless",
    extensions: ["alac"],
    mimeTypes: ["audio/alac"],
    category: "audio",
    description: "ALAC - Apple Lossless Audio Codec",
    apiEndpoint: "/api/convert/audio",
  },
  ape: {
    name: "Monkey's Audio",
    extensions: ["ape"],
    mimeTypes: ["audio/ape"],
    category: "audio",
    description: "APE - Monkey's Audio lossless format",
    apiEndpoint: "/api/convert/audio",
  },
  mid: {
    name: "MIDI Audio",
    extensions: ["mid", "midi"],
    mimeTypes: ["audio/midi"],
    category: "audio",
    description: "MIDI - Musical Instrument Digital Interface",
    apiEndpoint: "/api/convert/audio",
  },
  aiff: {
    name: "AIFF Audio",
    extensions: ["aiff", "aif"],
    mimeTypes: ["audio/aiff"],
    category: "audio",
    description: "AIFF - Audio Interchange File Format",
    apiEndpoint: "/api/convert/audio",
  },
  au: {
    name: "Au Audio",
    extensions: ["au", "snd"],
    mimeTypes: ["audio/basic"],
    category: "audio",
    description: "AU - Sun audio format",
    apiEndpoint: "/api/convert/audio",
  },
  voc: {
    name: "VOC Audio",
    extensions: ["voc"],
    mimeTypes: ["audio/x-voc"],
    category: "audio",
    description: "VOC - Creative Voice Format",
    apiEndpoint: "/api/convert/audio",
  },
  speex: {
    name: "Speex Audio",
    extensions: ["speex", "spx"],
    mimeTypes: ["audio/speex"],
    category: "audio",
    description: "Speex - Speech audio compression",
    apiEndpoint: "/api/convert/audio",
  },
  tta: {
    name: "True Audio",
    extensions: ["tta"],
    mimeTypes: ["audio/x-tta"],
    category: "audio",
    description: "TTA - True Audio lossless codec",
    apiEndpoint: "/api/convert/audio",
  },
  wavpack: {
    name: "WavPack Audio",
    extensions: ["wv"],
    mimeTypes: ["audio/wavpack"],
    category: "audio",
    description: "WavPack - Lossless/hybrid audio compression",
    apiEndpoint: "/api/convert/audio",
  },
  vorbis: {
    name: "Vorbis Audio",
    extensions: ["ogg"],
    mimeTypes: ["audio/vorbis"],
    category: "audio",
    description: "Vorbis - Ogg Vorbis audio",
    apiEndpoint: "/api/convert/audio",
  },

  // Archive formats (15+ total)
  zip: {
    name: "ZIP Archive",
    extensions: ["zip"],
    mimeTypes: ["application/zip"],
    category: "archive",
    description: "ZIP - Most common archive format",
    apiEndpoint: "/api/convert/archive",
  },
  tar: {
    name: "TAR Archive",
    extensions: ["tar"],
    mimeTypes: ["application/x-tar"],
    category: "archive",
    description: "TAR - Unix tape archive format",
    apiEndpoint: "/api/convert/archive",
  },
  gz: {
    name: "GZIP Archive",
    extensions: ["gz", "gzip"],
    mimeTypes: ["application/gzip"],
    category: "archive",
    description: "GZIP - Compressed archive format",
    apiEndpoint: "/api/convert/archive",
  },
  bz2: {
    name: "BZIP2 Archive",
    extensions: ["bz2", "tbz"],
    mimeTypes: ["application/x-bzip2"],
    category: "archive",
    description: "BZIP2 - High compression archive",
    apiEndpoint: "/api/convert/archive",
  },
  rar: {
    name: "RAR Archive",
    extensions: ["rar"],
    mimeTypes: ["application/x-rar-compressed"],
    category: "archive",
    description: "RAR - Superior compression, proprietary",
    apiEndpoint: "/api/convert/archive",
  },
  "7z": {
    name: "7-Zip Archive",
    extensions: ["7z"],
    mimeTypes: ["application/x-7z-compressed"],
    category: "archive",
    description: "7Z - High compression, open source",
    apiEndpoint: "/api/convert/archive",
  },
  xz: {
    name: "XZ Archive",
    extensions: ["xz", "txz"],
    mimeTypes: ["application/x-xz"],
    category: "archive",
    description: "XZ - LZMA2 compression format",
    apiEndpoint: "/api/convert/archive",
  },
  lz: {
    name: "LZ Archive",
    extensions: ["lz"],
    mimeTypes: ["application/x-lz"],
    category: "archive",
    description: "LZ - Lempel-Ziv compression",
    apiEndpoint: "/api/convert/archive",
  },
  zst: {
    name: "Zstandard Archive",
    extensions: ["zst"],
    mimeTypes: ["application/zstd"],
    category: "archive",
    description: "Zstandard - Modern compression algorithm",
    apiEndpoint: "/api/convert/archive",
  },
  iso: {
    name: "ISO Image",
    extensions: ["iso"],
    mimeTypes: ["application/x-iso9660-image"],
    category: "archive",
    description: "ISO - Disc image format",
    apiEndpoint: "/api/convert/archive",
  },
  dmg: {
    name: "DMG Image",
    extensions: ["dmg"],
    mimeTypes: ["application/x-apple-diskimage"],
    category: "archive",
    description: "DMG - Mac disk image",
    apiEndpoint: "/api/convert/archive",
  },
  exe: {
    name: "Windows Executable",
    extensions: ["exe"],
    mimeTypes: ["application/x-msdownload"],
    category: "archive",
    description: "EXE - Windows executable/installer",
    apiEndpoint: "/api/convert/archive",
  },
}

export function getFormatFromExtension(ext: string): FileConversionConfig | null {
  const normalizedExt = ext.toLowerCase().replace(/^\./, "")
  return SUPPORTED_FORMATS[normalizedExt] || null
}

export function getFormatFromMimeType(mimeType: string): FileConversionConfig | null {
  for (const format of Object.values(SUPPORTED_FORMATS)) {
    if (format.mimeTypes.includes(mimeType)) {
      return format
    }
  }
  return null
}

export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_SIZE_THRESHOLDS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${FILE_SIZE_THRESHOLDS.MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }
  return { valid: true }
}

export function shouldUseClientSideProcessing(file: File): boolean {
  return file.size <= FILE_SIZE_THRESHOLDS.CLIENT_SIDE_LIMIT
}

export async function convertFileViaAPI(
  file: File,
  targetFormat: string,
  config?: FileConversionConfig,
): Promise<ConversionResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("targetFormat", targetFormat)

    const endpoint = config?.apiEndpoint || "/api/convert"
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const blob = await response.blob()
    const filename = `converted_${Date.now()}.${targetFormat}`

    return {
      success: true,
      blob,
      filename,
      processedClientSide: false,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Conversion failed",
      processedClientSide: false,
    }
  }
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
