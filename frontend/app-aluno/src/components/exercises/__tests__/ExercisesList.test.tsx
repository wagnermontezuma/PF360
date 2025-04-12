import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExercisesList } from '../ExercisesList'
import { exerciseService } from '../../../services/exerciseService'

jest.mock('../../../services/exerciseService')

const mockExercises = [
  {
    id: 1,
    name: 'Supino Reto',
    description: 'Exercício para peitoral',
    muscle_group: 'chest',
    equipment: 'Barra e banco',
    difficulty_level: 'intermediate',
    instructions: 'Deite no banco...',
    is_active: true,
    created_at: '2024-04-10T00:00:00.000Z',
    updated_at: '2024-04-10T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Agachamento',
    description: 'Exercício para pernas',
    muscle_group: 'legs',
    equipment: 'Barra',
    difficulty_level: 'advanced',
    instructions: 'Em pé, com a barra...',
    is_active: true,
    created_at: '2024-04-10T00:00:00.000Z',
    updated_at: '2024-04-10T00:00:00.000Z'
  }
]

describe('ExercisesList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar lista de exercícios', async () => {
    const mockGetAll = jest.spyOn(exerciseService, 'getAll')
      .mockResolvedValue(mockExercises)

    render(<ExercisesList />)

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalled()
      expect(screen.getByText('Supino Reto')).toBeInTheDocument()
      expect(screen.getByText('Agachamento')).toBeInTheDocument()
    })
  })

  it('deve filtrar exercícios por grupo muscular', async () => {
    const mockGetByMuscleGroup = jest.spyOn(exerciseService, 'getByMuscleGroup')
      .mockResolvedValue([mockExercises[0]])

    render(<ExercisesList muscleGroup="chest" />)

    await waitFor(() => {
      expect(mockGetByMuscleGroup).toHaveBeenCalledWith('chest')
      expect(screen.getByText('Supino Reto')).toBeInTheDocument()
      expect(screen.queryByText('Agachamento')).not.toBeInTheDocument()
    })
  })

  it('deve chamar onSelectExercise ao clicar em um exercício', async () => {
    const mockOnSelect = jest.fn()
    jest.spyOn(exerciseService, 'getAll').mockResolvedValue(mockExercises)

    render(<ExercisesList onSelectExercise={mockOnSelect} />)

    await waitFor(() => {
      const exerciseCard = screen.getByText('Supino Reto').closest('div')
      fireEvent.click(exerciseCard!)
      expect(mockOnSelect).toHaveBeenCalledWith(mockExercises[0])
    })
  })

  it('deve mostrar mensagem quando não houver exercícios', async () => {
    jest.spyOn(exerciseService, 'getAll').mockResolvedValue([])

    render(<ExercisesList />)

    await waitFor(() => {
      expect(screen.getByText('Nenhum exercício encontrado')).toBeInTheDocument()
    })
  })

  it('deve mostrar mensagem de erro quando a requisição falhar', async () => {
    jest.spyOn(exerciseService, 'getAll').mockRejectedValue(new Error('Erro'))

    render(<ExercisesList />)

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar exercícios')).toBeInTheDocument()
    })
  })
}) 