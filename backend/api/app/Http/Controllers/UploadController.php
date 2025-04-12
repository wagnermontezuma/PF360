namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function getPresignedUrl(Request $request)
    {
        $request->validate([
            'fileName' => 'required|string',
            'fileType' => 'required|string|in:image/jpeg,image/png,image/webp,video/mp4,video/webm'
        ]);

        $fileName = $request->input('fileName');
        $fileType = $request->input('fileType');
        
        // Gera um nome único para o arquivo
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $key = sprintf(
            '%s/%s.%s',
            Str::startsWith($fileType, 'video/') ? 'videos' : 'images',
            Str::uuid(),
            $extension
        );

        // Gera URL pré-assinada para upload direto
        $disk = Storage::disk('s3');
        $client = $disk->getClient();
        $bucket = config('filesystems.disks.s3.bucket');

        $command = $client->getCommand('PutObject', [
            'Bucket' => $bucket,
            'Key' => $key,
            'ContentType' => $fileType,
            'ACL' => 'public-read'
        ]);

        $presignedRequest = $client->createPresignedRequest($command, '+1 hour');
        
        return response()->json([
            'url' => (string) $presignedRequest->getUri(),
            'fields' => [
                'key' => $key,
                'acl' => 'public-read',
                'Content-Type' => $fileType
            ]
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'key' => 'required|string'
        ]);

        $key = $request->input('key');
        
        // Verifica se o arquivo pertence ao usuário antes de deletar
        // TODO: Implementar verificação de propriedade
        
        Storage::disk('s3')->delete($key);
        
        return response()->json(['message' => 'Arquivo deletado com sucesso']);
    }
} 