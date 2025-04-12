import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FileUpload } from '../FileUpload'
import { UploadService } from '../../../services/uploadService'

// Mock do serviço de upload
jest.mock('../../../services/uploadService')

describe('FileUpload', () => {
  const mockOnUploadComplete = jest.fn()
  const mockOnError = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza a área de drop corretamente', () => {
    render(<FileUpload onUploadComplete={mockOnUploadComplete} />)
    expect(screen.getByText(/Arraste um arquivo ou clique para selecionar/i)).toBeInTheDocument()
  })

  it('mostra mensagem de drag quando arquivo é arrastado', () => {
    render(<FileUpload onUploadComplete={mockOnUploadComplete} />)
    const dropzone = screen.getByText(/Arraste um arquivo ou clique para selecionar/i)
    
    fireEvent.dragEnter(dropzone)
    expect(screen.getByText(/Solte o arquivo aqui/i)).toBeInTheDocument()
  })

  it('processa upload de imagem com sucesso', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const mockUrl = 'https://example.com/test.png'
    
    // Mock das funções do serviço
    ;(UploadService.validateFile as jest.Mock).mockResolvedValue(null)
    ;(UploadService.createPreview as jest.Mock).mockResolvedValue({
      url: 'data:image/png;base64,dummy',
      type: 'image',
      name: 'test.png',
      size: 1024
    })
    ;(UploadService.uploadFile as jest.Mock).mockResolvedValue({ url: mockUrl })

    render(<FileUpload onUploadComplete={mockOnUploadComplete} />)
    
    const input = screen.getByRole('button')
    const dataTransfer = { files: [file] }
    
    fireEvent.drop(input, { dataTransfer })
    
    await waitFor(() => {
      expect(UploadService.validateFile).toHaveBeenCalledWith(file)
      expect(UploadService.createPreview).toHaveBeenCalledWith(file)
      expect(UploadService.uploadFile).toHaveBeenCalledWith(file)
      expect(mockOnUploadComplete).toHaveBeenCalledWith(mockUrl)
    })
  })

  it('mostra erro quando arquivo é muito grande', async () => {
    const file = new File(['dummy content'], 'large.png', { type: 'image/png' })
    const errorMessage = 'Arquivo muito grande. Tamanho máximo: 10MB'
    
    ;(UploadService.validateFile as jest.Mock).mockResolvedValue(errorMessage)

    render(<FileUpload onUploadComplete={mockOnUploadComplete} onError={mockOnError} />)
    
    const input = screen.getByRole('button')
    const dataTransfer = { files: [file] }
    
    fireEvent.drop(input, { dataTransfer })
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(mockOnError).toHaveBeenCalledWith(errorMessage)
      expect(UploadService.uploadFile).not.toHaveBeenCalled()
    })
  })

  it('aceita apenas tipos de arquivo permitidos baseado na prop accept', () => {
    render(<FileUpload onUploadComplete={mockOnUploadComplete} accept="image" />)
    const input = screen.getByRole('button').querySelector('input')
    expect(input).toHaveAttribute('accept', '.jpeg,.jpg,.png,.webp')
  })

  it('permite remover preview após upload', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    
    ;(UploadService.validateFile as jest.Mock).mockResolvedValue(null)
    ;(UploadService.createPreview as jest.Mock).mockResolvedValue({
      url: 'data:image/png;base64,dummy',
      type: 'image',
      name: 'test.png',
      size: 1024
    })

    render(<FileUpload onUploadComplete={mockOnUploadComplete} />)
    
    const input = screen.getByRole('button')
    const dataTransfer = { files: [file] }
    
    fireEvent.drop(input, { dataTransfer })
    
    await waitFor(() => {
      const removeButton = screen.getByLabelText('Remover arquivo')
      fireEvent.click(removeButton)
      expect(screen.getByText(/Arraste um arquivo ou clique para selecionar/i)).toBeInTheDocument()
    })
  })
}) 