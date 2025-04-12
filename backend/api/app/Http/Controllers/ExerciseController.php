namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use App\Http\Requests\ExerciseRequest;
use Illuminate\Http\JsonResponse;

class ExerciseController extends Controller
{
    public function index(): JsonResponse
    {
        $exercises = Exercise::where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $exercises,
            'muscle_groups' => Exercise::getMuscleGroups(),
            'difficulty_levels' => Exercise::getDifficultyLevels()
        ]);
    }

    public function store(ExerciseRequest $request): JsonResponse
    {
        $exercise = Exercise::create($request->validated());

        return response()->json([
            'message' => 'Exercício criado com sucesso',
            'data' => $exercise
        ], 201);
    }

    public function show(Exercise $exercise): JsonResponse
    {
        return response()->json([
            'data' => $exercise
        ]);
    }

    public function update(ExerciseRequest $request, Exercise $exercise): JsonResponse
    {
        $exercise->update($request->validated());

        return response()->json([
            'message' => 'Exercício atualizado com sucesso',
            'data' => $exercise
        ]);
    }

    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->update(['is_active' => false]);

        return response()->json([
            'message' => 'Exercício removido com sucesso'
        ]);
    }

    public function byMuscleGroup(string $muscleGroup): JsonResponse
    {
        $exercises = Exercise::where('muscle_group', $muscleGroup)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $exercises
        ]);
    }
} 