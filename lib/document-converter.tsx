/**
 * Document conversion utilities
 * Supports CSV <-> JSON, basic text conversions
 * Note: Full PDF/DOCX/XLSX require server-side processing due to format complexity
 */

export interface DocumentConversionOptions {
  delimiter?: string
  includeHeader?: boolean
  prettyPrint?: boolean
}

// CSV to JSON conversion
export async function csvToJson(file: File, options: DocumentConversionOptions = {}): Promise<Blob> {
  const { delimiter = ",", includeHeader = true } = options

  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length === 0) {
    throw new Error("Empty CSV file")
  }

  const data: any[] = []
  let headers: string[] = []

  // Parse CSV
  lines.forEach((line, index) => {
    const values = parseCSVLine(line, delimiter)
    if (index === 0 && includeHeader) {
      headers = values
    } else {
      if (headers.length === 0) {
        // If no headers, create generic ones
        headers = values.map((_, i) => `column_${i + 1}`)
      }
      const obj: Record<string, string> = {}
      headers.forEach((header, i) => {
        obj[header] = values[i] || ""
      })
      data.push(obj)
    }
  })

  const json = JSON.stringify(data, null, 2)
  return new Blob([json], { type: "application/json" })
}

// JSON to CSV conversion
export async function jsonToCsv(file: File, options: DocumentConversionOptions = {}): Promise<Blob> {
  const { delimiter = "," } = options

  const text = await file.text()
  let data: any[]

  try {
    data = JSON.parse(text)
  } catch (error) {
    throw new Error("Invalid JSON file")
  }

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects")
  }

  if (data.length === 0) {
    throw new Error("Empty JSON array")
  }

  // Extract headers from first object
  const headers = Object.keys(data[0])
  const rows = data.map((obj) => headers.map((header) => formatCSVValue(obj[header] || "")))

  // Build CSV
  const csv = [headers.map((h) => formatCSVValue(h)), ...rows].map((row) => row.join(delimiter)).join("\n")

  return new Blob([csv], { type: "text/csv" })
}

// CSV to HTML table
export async function csvToHtml(file: File, options: DocumentConversionOptions = {}): Promise<Blob> {
  const { delimiter = ",", includeHeader = true } = options

  const text = await file.text()
  const lines = text.trim().split("\n")

  if (lines.length === 0) {
    throw new Error("Empty CSV file")
  }

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <table>`

  lines.forEach((line, index) => {
    const values = parseCSVLine(line, delimiter)
    const tag = index === 0 && includeHeader ? "th" : "td"
    const row = values.map((value) => `<${tag}>${escapeHtml(value)}</${tag}>`).join("")
    const rowTag = index === 0 && includeHeader ? "thead" : "tbody"
    html += `<tr>${row}</tr>`
  })

  html += `
  </table>
</body>
</html>`

  return new Blob([html], { type: "text/html" })
}

// JSON to YAML-like format (simplified)
export async function jsonToYaml(file: File): Promise<Blob> {
  const text = await file.text()
  let data: any

  try {
    data = JSON.parse(text)
  } catch (error) {
    throw new Error("Invalid JSON file")
  }

  const yaml = convertToYaml(data, 0)
  return new Blob([yaml], { type: "text/plain" })
}

// JSON pretty print
export async function prettifyJson(file: File): Promise<Blob> {
  const text = await file.text()

  try {
    const data = JSON.parse(text)
    const pretty = JSON.stringify(data, null, 2)
    return new Blob([pretty], { type: "application/json" })
  } catch (error) {
    throw new Error("Invalid JSON file")
  }
}

// JSON minify
export async function minifyJson(file: File): Promise<Blob> {
  const text = await file.text()

  try {
    const data = JSON.parse(text)
    const minified = JSON.stringify(data)
    return new Blob([minified], { type: "application/json" })
  } catch (error) {
    throw new Error("Invalid JSON file")
  }
}

// Helper functions
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ""
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === delimiter && !insideQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function formatCSVValue(value: any): string {
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}""`
  }
  return str
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function convertToYaml(obj: any, indent = 0): string {
  const spaces = " ".repeat(indent)
  let yaml = ""

  if (typeof obj !== "object" || obj === null) {
    return String(obj)
  }

  if (Array.isArray(obj)) {
    yaml = obj
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return `\n${spaces}  ${convertToYaml(item, indent + 2)}`
        }
        return `\n${spaces}  - ${item}`
      })
      .join("")
  } else {
    yaml = Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return `\n${spaces}${key}:${convertToYaml(value, indent + 2)}`
        }
        return `\n${spaces}${key}: ${value}`
      })
      .join("")
  }

  return yaml.trim()
}
