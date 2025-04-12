namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Exercise;

class ExerciseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'muscle_group' => ['required', 'string', 'in:' . implode(',', array_keys(Exercise::getMuscleGroups()))],
            'equipment' => ['nullable', 'string', 'max:255'],
            'difficulty_level' => ['required', 'string', 'in:' . implode(',', array_keys(Exercise::getDifficultyLevels()))],
            'video_url' => ['nullable', 'url', 'max:255'],
            'image_url' => ['nullable', 'url', 'max:255'],
            'instructions' => ['required', 'string'],
            'is_active' => ['boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do exercício é obrigatório',
            'name.max' => 'O nome não pode ter mais que 255 caracteres',
            'muscle_group.required' => 'O grupo muscular é obrigatório',
            'muscle_group.in' => 'Grupo muscular inválido',
            'difficulty_level.required' => 'O nível de dificuldade é obrigatório',
            'difficulty_level.in' => 'Nível de dificuldade inválido',
            'video_url.url' => 'URL do vídeo inválida',
            'image_url.url' => 'URL da imagem inválida',
            'instructions.required' => 'As instruções são obrigatórias'
        ];
    }
} 