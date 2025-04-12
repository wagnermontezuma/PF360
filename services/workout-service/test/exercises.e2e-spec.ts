import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateExerciseDto } from '../src/exercises/dto/create-exercise.dto';
import { UpdateExerciseDto } from '../src/exercises/dto/update-exercise.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

describe('ExercisesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let cacheManager: jest.Mocked<Cache>;
  let exerciseId: string;
  let authToken: string;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCacheManager)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    cacheManager = app.get(CACHE_MANAGER);

    await app.init();

    // Create test user and generate token
    await prisma.$executeRaw`INSERT INTO users (id, email, name, password) VALUES ('1', 'test@example.com', 'Test User', 'hashedpassword')`;
    authToken = jwtService.sign({ sub: '1', email: 'test@example.com' });

    // Create test equipment and muscle group
    await prisma.$executeRaw`INSERT INTO equipment (id, name, description) VALUES ('1', 'Test Equipment', 'Test Description')`;
    await prisma.$executeRaw`INSERT INTO muscle_groups (id, name, description) VALUES ('1', 'Test Muscle Group', 'Test Description')`;
  });

  beforeEach(async () => {
    // Clear cache before each test
    await mockCacheManager.reset();

    // Create test exercise
    await prisma.$executeRaw`INSERT INTO exercises (id, name, description, instructions, video_url) VALUES ('1', 'Test Exercise', 'Test Description', 'Test Instructions', 'https://example.com/test')`;
    exerciseId = '1';

    // Create exercise relationships
    await prisma.$executeRaw`INSERT INTO exercise_equipment (exercise_id, equipment_id) VALUES ('1', '1')`;
    await prisma.$executeRaw`INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id) VALUES ('1', '1')`;
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.$executeRaw`DELETE FROM exercise_equipment WHERE exercise_id = '1'`;
    await prisma.$executeRaw`DELETE FROM exercise_muscle_groups WHERE exercise_id = '1'`;
    await prisma.$executeRaw`DELETE FROM exercises WHERE id = '1'`;
  });

  afterAll(async () => {
    // Clean up all test data
    await prisma.$executeRaw`DELETE FROM exercise_equipment`;
    await prisma.$executeRaw`DELETE FROM exercise_muscle_groups`;
    await prisma.$executeRaw`DELETE FROM exercises`;
    await prisma.$executeRaw`DELETE FROM equipment`;
    await prisma.$executeRaw`DELETE FROM muscle_groups`;
    await prisma.$executeRaw`DELETE FROM users`;
    await app.close();
  });

  const mockExercise: CreateExerciseDto = {
    name: 'Supino Reto',
    description: 'Exercício para peitoral',
    instructions: 'Deite no banco e empurre a barra',
    videoUrl: 'https://example.com/video',
    equipmentIds: ['1'],
    muscleGroupIds: ['1'],
  };

  describe('/exercises (GET)', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      const cachedExercises = [{ id: '1', name: 'Cached Exercise' }];
      mockCacheManager.get.mockResolvedValueOnce(cachedExercises);

      const response = await request(app.getHttpServer())
        .get('/exercises')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedExercises);
      expect(mockCacheManager.get).toHaveBeenCalledWith('exercises:list');
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('deve buscar exercícios do banco quando não estão em cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .get('/exercises')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Test Exercise');
      expect(mockCacheManager.get).toHaveBeenCalledWith('exercises:list');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'exercises:list',
        expect.any(Array),
        expect.any(Number),
      );
    });
  });

  describe('/exercises/:id (GET)', () => {
    it('deve retornar exercício do cache quando disponível', async () => {
      const cachedExercise = { id: exerciseId, name: 'Cached Exercise' };
      mockCacheManager.get.mockResolvedValueOnce(cachedExercise);

      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedExercise);
      expect(mockCacheManager.get).toHaveBeenCalledWith(
        `exercises:${exerciseId}`,
      );
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });

    it('deve buscar exercício do banco quando não está em cache', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Test Exercise');
      expect(mockCacheManager.get).toHaveBeenCalledWith(
        `exercises:${exerciseId}`,
      );
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        `exercises:${exerciseId}`,
        expect.any(Object),
        expect.any(Number),
      );
    });
  });

  describe('/exercises (POST)', () => {
    it('deve criar exercício e invalidar cache', async () => {
      const response = await request(app.getHttpServer())
        .post('/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockExercise);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', mockExercise.name);
      expect(mockCacheManager.del).toHaveBeenCalledWith('exercises:list');
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const invalidExercise = { ...mockExercise, name: '' };
      await request(app.getHttpServer())
        .post('/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExercise)
        .expect(400);
    });
  });

  describe('/exercises/:id (PATCH)', () => {
    it('deve atualizar exercício e invalidar cache', async () => {
      const updateDto: UpdateExerciseDto = {
        name: 'Updated Exercise',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updateDto.name);
      expect(mockCacheManager.del).toHaveBeenCalledWith(
        `exercises:${exerciseId}`,
      );
      expect(mockCacheManager.del).toHaveBeenCalledWith('exercises:list');

      // Verificar se o exercício foi atualizado no banco
      const [updatedExercise] = await prisma.$queryRaw`
        SELECT name, description FROM exercises WHERE id = ${exerciseId}
      `;
      expect(updatedExercise).toMatchObject({
        name: updateDto.name,
        description: updateDto.description,
      });
    });
  });

  describe('/exercises/:id (DELETE)', () => {
    it('deve remover exercício e invalidar cache', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
      expect(mockCacheManager.del).toHaveBeenCalledWith(
        `exercises:${exerciseId}`,
      );
      expect(mockCacheManager.del).toHaveBeenCalledWith('exercises:list');

      // Verificar se o exercício foi removido do banco
      const [deletedExercise] = await prisma.$queryRaw`
        SELECT id FROM exercises WHERE id = ${exerciseId}
      `;
      expect(deletedExercise).toBeUndefined();
    });
  });

  describe('/exercises/muscle-group/:id (GET)', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      const cachedExercises = [{ id: '1', name: 'Cached Exercise' }];
      mockCacheManager.get.mockResolvedValueOnce(cachedExercises);

      const response = await request(app.getHttpServer())
        .get('/exercises/muscle-group/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual(cachedExercises);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:muscleGroup:1');
    });

    it('deve buscar exercícios do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .get('/exercises/muscle-group/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(cacheManager.set).toHaveBeenCalled();
    });
  });

  describe('/exercises/equipment/:id (GET)', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      const cachedExercises = [{ id: '1', name: 'Cached Exercise' }];
      mockCacheManager.get.mockResolvedValueOnce(cachedExercises);

      const response = await request(app.getHttpServer())
        .get('/exercises/equipment/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual(cachedExercises);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:equipment:1');
    });

    it('deve buscar exercícios do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer())
        .get('/exercises/equipment/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(cacheManager.set).toHaveBeenCalled();
    });
  });

  describe('GET /exercises', () => {
    it('should return exercises from cache if available', async () => {
      const exercises = [
        {
          id: exerciseId,
          name: 'Test Exercise',
          description: 'Test Description',
          instructions: 'Test Instructions',
          video_url: 'https://example.com/test',
        },
      ];

      await cacheManager.set('exercises', exercises);

      const response = await request(app.getHttpServer())
        .get('/exercises')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(exercises);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises');
    });

    it('should fetch exercises from database if not in cache', async () => {
      const response = await request(app.getHttpServer())
        .get('/exercises')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'exercises',
        expect.any(Array),
      );
    });
  });

  describe('GET /exercises/:id', () => {
    it('should return exercise from cache if available', async () => {
      const exercise = {
        id: exerciseId,
        name: 'Test Exercise',
        description: 'Test Description',
        instructions: 'Test Instructions',
        video_url: 'https://example.com/test',
      };

      await cacheManager.set(`exercise:${exerciseId}`, exercise);

      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(exercise);
      expect(cacheManager.get).toHaveBeenCalledWith(`exercise:${exerciseId}`);
    });

    it('should fetch exercise from database if not in cache', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(exerciseId);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `exercise:${exerciseId}`,
        expect.any(Object),
      );
    });
  });

  describe('POST /exercises', () => {
    it('should create a new exercise and invalidate cache', async () => {
      const createExerciseDto: CreateExerciseDto = {
        name: 'New Exercise',
        description: 'New Description',
        instructions: 'New Instructions',
        videoUrl: 'https://example.com/new',
        equipmentIds: ['1'],
        muscleGroupIds: ['1'],
      };

      const response = await request(app.getHttpServer())
        .post('/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createExerciseDto);

      expect(response.status).toBe(201);
      expect(cacheManager.del).toHaveBeenCalledWith('exercises');
    });
  });

  describe('PATCH /exercises/:id', () => {
    it('should update exercise and invalidate cache', async () => {
      const updateExerciseDto: UpdateExerciseDto = {
        name: 'Updated Exercise',
      };

      const response = await request(app.getHttpServer())
        .patch(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateExerciseDto);

      expect(response.status).toBe(200);
      expect(cacheManager.del).toHaveBeenCalledWith(`exercise:${exerciseId}`);
      expect(cacheManager.del).toHaveBeenCalledWith('exercises');
    });
  });

  describe('DELETE /exercises/:id', () => {
    it('should delete exercise and invalidate cache', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(cacheManager.del).toHaveBeenCalledWith(`exercise:${exerciseId}`);
      expect(cacheManager.del).toHaveBeenCalledWith('exercises');
    });
  });
});
