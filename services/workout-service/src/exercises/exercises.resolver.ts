import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';

@Resolver(() => Exercise)
export class ExercisesResolver {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Mutation(() => Exercise)
  createExercise(
    @Args('createExerciseInput') createExerciseInput: CreateExerciseInput,
  ) {
    return this.exercisesService.create(createExerciseInput);
  }

  @Query(() => [Exercise], { name: 'exercises' })
  findAll() {
    return this.exercisesService.findAll();
  }

  @Query(() => Exercise, { name: 'exercise' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.exercisesService.findOne(id);
  }

  @Mutation(() => Exercise)
  updateExercise(
    @Args('updateExerciseInput') updateExerciseInput: UpdateExerciseInput,
  ) {
    return this.exercisesService.update(
      updateExerciseInput.id,
      updateExerciseInput,
    );
  }

  @Mutation(() => Exercise)
  removeExercise(@Args('id', { type: () => Int }) id: number) {
    return this.exercisesService.remove(id);
  }
}
