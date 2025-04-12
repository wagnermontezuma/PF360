import { FC, useEffect, useState } from 'react'
import { FaPause, FaPlay, FaRedo } from 'react-icons/fa'

interface TimerProps {
  duration: number // duração em segundos
  onComplete?: () => void
  autoStart?: boolean
}

export const Timer: FC<TimerProps> = ({ duration, onComplete, autoStart = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(autoStart)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval)
            setIsActive(false)
            onComplete?.()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft, onComplete])

  const toggleTimer = () => setIsActive(!isActive)
  
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(duration)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <div className="text-4xl font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={isActive ? 'Pausar timer' : 'Iniciar timer'}
        >
          {isActive ? <FaPause /> : <FaPlay />}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-2 text-white bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Reiniciar timer"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  )
} 