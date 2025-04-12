import { FC, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiX } from 'react-icons/fi'
import { UploadService, FilePreview } from '../../services/uploadService'

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  onError?: (error: string) => void
  accept?: 'image' | 'video' | 'both'
}

export const FileUpload: FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  accept = 'both'
}) => {
  const [preview, setPreview] = useState<FilePreview | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAcceptedTypes = () => {
    switch (accept) {
      case 'image':
        return { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
      case 'video':
        return { 'video/*': ['.mp4', '.webm'] }
      default:
        return {
          'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
          'video/*': ['.mp4', '.webm']
        }
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setError(null)
      
      // Valida arquivo
      const validationError = await UploadService.validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Cria preview
      const previewData = await UploadService.createPreview(file)
      setPreview(previewData)

      // Inicia upload
      setUploading(true)
      const { url } = await UploadService.uploadFile(file)
      onUploadComplete(url)
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload'
      setError(message)
      onError?.(message)
    } finally {
      setUploading(false)
    }
  }, [onUploadComplete, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    maxFiles: 1
  })

  const clearPreview = () => {
    setPreview(null)
    setError(null)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearPreview()
              }}
              className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full
                hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FiX />
            </button>
            
            {preview.type === 'image' ? (
              <img
                src={preview.url}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
            ) : (
              <video
                src={preview.url}
                controls
                className="max-h-48 mx-auto rounded"
              />
            )}
            
            <p className="mt-2 text-sm text-gray-500">
              {preview.name} ({(preview.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          </div>
        ) : (
          <div>
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {isDragActive
                ? 'Solte o arquivo aqui...'
                : `Arraste um arquivo ou clique para selecionar`}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
} 