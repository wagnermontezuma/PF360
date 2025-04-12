import { api } from '../lib/api'
import { Exercise } from '../types/exercise'

export const exerciseService = {
  async getAll(): Promise<Exercise[]> {
    const response = await api.get('/exercises')
    return response.data.data
  },

  async getByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    const response = await api.get(`/exercises/muscle-group/${muscleGroup}`)
    return response.data.data
  },

  async getById(id: number): Promise<Exercise> {
    const response = await api.get(`/exercises/${id}`)
    return response.data.data
  },

  async create(exercise: Partial<Exercise>): Promise<Exercise> {
    const response = await api.post('/exercises', exercise)
    return response.data.data
  },

  async update(id: number, exercise: Partial<Exercise>): Promise<Exercise> {
    const response = await api.put(`/exercises/${id}`, exercise)
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`)
  },

  getMuscleGroups(): Record<string, string> {
    return {
      chest: 'Peitoral',
      back: 'Costas',
      shoulders: 'Ombros',
      biceps: 'Bíceps',
      triceps: 'Tríceps',
      legs: 'Pernas',
      abs: 'Abdômen',
      cardio: 'Cardio'
    }
  },

  getDifficultyLevels(): Record<string, string> {
    return {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    }
  }
} 