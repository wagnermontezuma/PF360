import { Prisma } from '@prisma/client';

export type Feedback = {
  id: string;
  userId: string;
  nota: number;
  comentario: string;
  createdAt: Date;
};

export type CreateFeedbackDto = {
  userId: string;
  nota: number;
  comentario: string;
}; 