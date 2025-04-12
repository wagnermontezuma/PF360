import { render, screen, fireEvent, act } from '@testing-library/react'
import { Timer } from '../Timer'

jest.useFakeTimers()

describe('Timer', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('renderiza o timer com o tempo inicial correto', () => {
    render(<Timer duration={65} />)
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('inicia automaticamente quando autoStart é true', () => {
    render(<Timer duration={60} autoStart={true} />)
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    expect(screen.getByText('00:58')).toBeInTheDocument()
  })

  it('pausa e retoma a contagem ao clicar no botão de play/pause', () => {
    render(<Timer duration={60} />)
    
    const playButton = screen.getByLabelText('Iniciar timer')
    fireEvent.click(playButton)
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    expect(screen.getByText('00:58')).toBeInTheDocument()
    
    const pauseButton = screen.getByLabelText('Pausar timer')
    fireEvent.click(pauseButton)
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    expect(screen.getByText('00:58')).toBeInTheDocument()
  })

  it('reseta o timer ao clicar no botão de reset', () => {
    render(<Timer duration={60} />)
    
    const playButton = screen.getByLabelText('Iniciar timer')
    fireEvent.click(playButton)
    
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    const resetButton = screen.getByLabelText('Reiniciar timer')
    fireEvent.click(resetButton)
    
    expect(screen.getByText('01:00')).toBeInTheDocument()
  })

  it('chama onComplete quando o timer chega a zero', () => {
    const onComplete = jest.fn()
    render(<Timer duration={2} autoStart={true} onComplete={onComplete} />)
    
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    expect(onComplete).toHaveBeenCalled()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })
}) 