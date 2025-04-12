<?php

namespace App\Http\Controllers;

use App\Models\WorkoutHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class WorkoutHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkoutHistory::forUser(Auth::id())
            ->with(['workout'])
            ->orderBy('created_at', 'desc');

        // Filtros
        if ($request->has('completed')) {
            $query->where('completed', $request->boolean('completed'));
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', Carbon::parse($request->date_from));
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', Carbon::parse($request->date_to));
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'workout_id' => 'required|exists:workouts,id',
            'started_at' => 'required|date',
            'completed_at' => 'nullable|date|after:started_at',
            'duration_seconds' => 'nullable|integer|min:0',
            'calories_burned' => 'nullable|integer|min:0',
            'exercise_progress' => 'nullable|array',
            'exercise_progress.*.exercise_id' => 'required|exists:exercises,id',
            'exercise_progress.*.sets_completed' => 'required|integer|min:0',
            'exercise_progress.*.reps_completed' => 'required|integer|min:0',
            'exercise_progress.*.weight_used' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'difficulty_rating' => 'nullable|in:easy,moderate,hard',
            'completed' => 'required|boolean'
        ]);

        $history = new WorkoutHistory($validated);
        $history->user_id = Auth::id();
        $history->save();

        return response()->json($history, 201);
    }

    public function show(WorkoutHistory $history)
    {
        $this->authorize('view', $history);
        
        return response()->json($history->load('workout'));
    }

    public function update(Request $request, WorkoutHistory $history)
    {
        $this->authorize('update', $history);

        $validated = $request->validate([
            'completed_at' => 'nullable|date|after:started_at',
            'duration_seconds' => 'nullable|integer|min:0',
            'calories_burned' => 'nullable|integer|min:0',
            'exercise_progress' => 'nullable|array',
            'exercise_progress.*.exercise_id' => 'required|exists:exercises,id',
            'exercise_progress.*.sets_completed' => 'required|integer|min:0',
            'exercise_progress.*.reps_completed' => 'required|integer|min:0',
            'exercise_progress.*.weight_used' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'difficulty_rating' => 'nullable|in:easy,moderate,hard',
            'completed' => 'required|boolean'
        ]);

        $history->update($validated);

        return response()->json($history);
    }

    public function destroy(WorkoutHistory $history)
    {
        $this->authorize('delete', $history);
        
        $history->delete();
        
        return response()->json(null, 204);
    }

    public function stats(Request $request)
    {
        $userId = Auth::id();
        $dateFrom = $request->get('date_from', Carbon::now()->subDays(30));
        $dateTo = $request->get('date_to', Carbon::now());

        $stats = [
            'total_workouts' => WorkoutHistory::forUser($userId)
                ->completed()
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),

            'total_duration' => WorkoutHistory::forUser($userId)
                ->completed()
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->sum('duration_seconds'),

            'total_calories' => WorkoutHistory::forUser($userId)
                ->completed()
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->sum('calories_burned'),

            'workouts_by_difficulty' => WorkoutHistory::forUser($userId)
                ->completed()
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->selectRaw('difficulty_rating, count(*) as count')
                ->groupBy('difficulty_rating')
                ->get(),

            'workouts_by_date' => WorkoutHistory::forUser($userId)
                ->completed()
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->selectRaw('DATE(created_at) as date, count(*) as count')
                ->groupBy('date')
                ->get()
        ];

        return response()->json($stats);
    }
} 