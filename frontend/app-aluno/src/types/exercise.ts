export interface Exercise {
  id: number
  name: string
  description?: string
  instructions: string
  image_url?: string
  video_url?: string
  equipment?: string
  difficulty_level: 'iniciante' | 'intermediário' | 'avançado'
  sets?: number
  reps?: number
  rest_time?: number
  duration?: number
  calories_burned?: number
  muscle_groups?: string[]
  created_at?: string
  updated_at?: string
}

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'abs' | 'cardio'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' 