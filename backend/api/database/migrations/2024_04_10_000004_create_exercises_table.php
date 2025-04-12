use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('muscle_group');
            $table->string('equipment')->nullable();
            $table->string('difficulty_level')->default('intermediate');
            $table->string('video_url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('instructions');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('muscle_group');
            $table->index('difficulty_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
}; 