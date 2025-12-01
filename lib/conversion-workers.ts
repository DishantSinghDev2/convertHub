/**
 * Conversion worker registry and management
 * Each conversion type can register handlers
 */

export type ConversionHandler = (file: File, targetFormat: string, options?: Record<string, any>) => Promise<Blob>

interface ConversionWorkerRegistry {
  [key: string]: ConversionHandler
}

const registry: ConversionWorkerRegistry = {}

export function registerConversionHandler(key: string, handler: ConversionHandler) {
  registry[key] = handler
}

export function getConversionHandler(key: string): ConversionHandler | undefined {
  return registry[key]
}

export async function executeConversion(
  key: string,
  file: File,
  targetFormat: string,
  options?: Record<string, any>,
): Promise<Blob> {
  const handler = getConversionHandler(key)
  if (!handler) {
    throw new Error(`No conversion handler registered for: ${key}`)
  }
  return handler(file, targetFormat, options)
}
