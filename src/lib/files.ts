import {createReadStream} from 'node:fs'
import {stat} from 'node:fs/promises'
import path from 'node:path'

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp',
}

export type UploadFileInput = {
  contentLength: number
  file: ReturnType<typeof createReadStream>
  fileName: string
  mimeType: string
}

export async function resolveUploadFile(filePath: string): Promise<UploadFileInput> {
  const stats = await stat(filePath)

  if (!stats.isFile()) {
    throw new Error(`Upload path is not a file: ${filePath}`)
  }

  const extension = path.extname(filePath).toLowerCase()
  const mimeType = MIME_TYPES_BY_EXTENSION[extension]

  if (!mimeType) {
    throw new Error(`Could not infer image MIME type from file extension: ${extension || '(none)'}`)
  }

  return {
    contentLength: stats.size,
    file: createReadStream(filePath),
    fileName: path.basename(filePath),
    mimeType,
  }
}
