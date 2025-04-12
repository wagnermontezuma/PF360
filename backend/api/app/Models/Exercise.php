namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Exercise extends Model
{
    protected $fillable = [
        'name',
        'description',
        'muscle_group',
        'equipment',
        'difficulty_level',
        'video_url',
        'image_url',
        'instructions',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function workouts(): BelongsToMany
    {
        return $this->belongsToMany(Workout::class, 'workout_exercises')
            ->withPivot(['sets', 'reps', 'rest_time', 'notes'])
            ->withTimestamps();
    }

    public static function getMuscleGroups(): array
    {
        return [
            'chest' => 'Peitoral',
            'back' => 'Costas',
            'shoulders' => 'Ombros',
            'biceps' => 'Bíceps',
            'triceps' => 'Tríceps',
            'legs' => 'Pernas',
            'abs' => 'Abdômen',
            'cardio' => 'Cardio'
        ];
    }

    public static function getDifficultyLevels(): array
    {
        return [
            'beginner' => 'Iniciante',
            'intermediate' => 'Intermediário',
            'advanced' => 'Avançado'
        ];
    }
} 