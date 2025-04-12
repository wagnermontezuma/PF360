<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use App\Models\WorkoutSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkoutController extends Controller
{
    public function index()
    {
        $workouts = Workout::with('exercises')->get();
        return response()->json(['workouts' => $workouts]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty_level' => 'required|integer|min:1|max:5',
            'estimated_time' => 'required|integer',
            'exercises' => 'required|array|min:1',
            'exercises.*.name' => 'required|string|max:255',
            'exercises.*.sets' => 'required|integer|min:1',
            'exercises.*.reps' => 'required|integer|min:1',
            'exercises.*.weight' => 'required|numeric|min:0',
            'exercises.*.rest_time' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $workout = Workout::create($request->except('exercises'));
        
        foreach ($request->exercises as $exerciseData) {
            $workout->exercises()->create($exerciseData);
        }

        return response()->json(['workout' => $workout->load('exercises')], 201);
    }

    public function show($id)
    {
        $workout = Workout::with('exercises')->findOrFail($id);
        return response()->json(['workout' => $workout]);
    }

    public function update(Request $request, $id)
    {
        $workout = Workout::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'difficulty_level' => 'required|integer|min:1|max:5',
            'estimated_time' => 'required|integer',
            'exercises' => 'sometimes|array|min:1',
            'exercises.*.name' => 'required|string|max:255',
            'exercises.*.sets' => 'required|integer|min:1',
            'exercises.*.reps' => 'required|integer|min:1',
            'exercises.*.weight' => 'required|numeric|min:0',
            'exercises.*.rest_time' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $workout->update($request->except('exercises'));

        if ($request->has('exercises')) {
            $workout->exercises()->delete();
            foreach ($request->exercises as $exerciseData) {
                $workout->exercises()->create($exerciseData);
            }
        }

        return response()->json(['workout' => $workout->load('exercises')]);
    }

    public function destroy($id)
    {
        $workout = Workout::findOrFail($id);
        $workout->delete();
        return response()->json(null, 204);
    }

    public function start($id)
    {
        $workout = Workout::findOrFail($id);
        
        $session = WorkoutSession::create([
            'user_id' => Auth::id(),
            'workout_id' => $workout->id,
            'started_at' => now(),
        ]);

        return response()->json(['session' => $session], 201);
    }

    public function complete(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'performance_rating' => 'required|integer|min:1|max:5',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $session = WorkoutSession::where('workout_id', $id)
            ->where('user_id', Auth::id())
            ->whereNull('completed_at')
            ->latest()
            ->firstOrFail();

        $session->update([
            'completed_at' => now(),
            'performance_rating' => $request->performance_rating,
            'notes' => $request->notes
        ]);

        return response()->json(['session' => $session]);
    }
} 