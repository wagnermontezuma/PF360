<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Hash;

class TwoFactorAuthController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->middleware('auth:api');
        $this->google2fa = new Google2FA();
    }

    public function enable(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return response()->json([
                'message' => '2FA já está habilitado'
            ], 400);
        }

        $secret = $this->google2fa->generateSecretKey();
        
        $user->two_factor_secret = $secret;
        $user->save();

        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code' => $qrCodeUrl
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => '2FA não está habilitado'
            ], 400);
        }

        $valid = $this->google2fa->verifyKey(
            $user->two_factor_secret,
            $request->code
        );

        if (!$valid) {
            return response()->json([
                'message' => 'Código inválido'
            ], 422);
        }

        $user->two_factor_confirmed_at = now();
        $user->two_factor_recovery_codes = json_encode($this->generateRecoveryCodes());
        $user->save();

        return response()->json([
            'message' => '2FA habilitado com sucesso',
            'recovery_codes' => json_decode($user->two_factor_recovery_codes)
        ]);
    }

    public function disable(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => '2FA não está habilitado'
            ], 400);
        }

        $valid = $this->google2fa->verifyKey(
            $user->two_factor_secret,
            $request->code
        );

        if (!$valid) {
            return response()->json([
                'message' => 'Código inválido'
            ], 422);
        }

        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        return response()->json([
            'message' => '2FA desabilitado com sucesso'
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret || !$user->two_factor_confirmed_at) {
            return response()->json([
                'message' => '2FA não está habilitado'
            ], 400);
        }

        $valid = $this->google2fa->verifyKey(
            $user->two_factor_secret,
            $request->code
        );

        if (!$valid) {
            return response()->json([
                'message' => 'Código inválido'
            ], 422);
        }

        return response()->json([
            'message' => 'Código válido'
        ]);
    }

    protected function generateRecoveryCodes()
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = sprintf(
                '%s-%s-%s-%s',
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4),
                substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4)
            );
        }
        return $codes;
    }
} 