import axios from 'axios'

export interface UploadResponse {
  url: string
  key: string
}

export interface FilePreview {
  url: string
  type: 'image' | 'video'
  name: string
  size: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

export class UploadService {
  static async validateFile(file: File): Promise<string | null> {
    if (file.size > MAX_FILE_SIZE) {
      return 'Arquivo muito grande. Tamanho máximo: 10MB'
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return 'Formato de arquivo não suportado'
    }

    return null
  }

  static createPreview(file: File): Promise<FilePreview> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({
          url: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name,
          size: file.size
        })
      }
      reader.readAsDataURL(file)
    })
  }

  static async uploadFile(file: File): Promise<UploadResponse> {
    // Primeiro solicita URL assinada do backend
    const { data: { url, fields } } = await axios.post('/api/upload/presigned', {
      fileName: file.name,
      fileType: file.type
    })

    // Prepara FormData para upload
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
    formData.append('file', file)

    // Faz upload direto para S3
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Retorna URL final do arquivo
    return {
      url: `${url}/${fields.key}`,
      key: fields.key
    }
  }
} 