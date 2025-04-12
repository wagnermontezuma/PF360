<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthTest extends TestCase
{
    use RefreshDatabase;

    protected $google2fa;

    public function setUp(): void
    {
        parent::setUp();
        $this->google2fa = new Google2FA();
    }

    public function test_usuario_pode_habilitar_2fa()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/enable');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'secret',
                'qr_code'
            ]);

        $this->assertNotNull($user->fresh()->two_factor_secret);
    }

    public function test_usuario_pode_confirmar_2fa()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        // Primeiro habilita 2FA
        $enableResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/enable');

        $secret = $user->fresh()->two_factor_secret;
        $code = $this->google2fa->getCurrentOtp($secret);

        // Confirma 2FA
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/confirm', [
            'code' => $code
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'recovery_codes'
            ]);

        $this->assertNotNull($user->fresh()->two_factor_confirmed_at);
    }

    public function test_usuario_nao_pode_confirmar_2fa_com_codigo_invalido()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        // Primeiro habilita 2FA
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/enable');

        // Tenta confirmar com código inválido
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/confirm', [
            'code' => '000000'
        ]);

        $response->assertStatus(422);
        $this->assertNull($user->fresh()->two_factor_confirmed_at);
    }

    public function test_usuario_pode_desabilitar_2fa()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        // Habilita e confirma 2FA
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/enable');

        $secret = $user->fresh()->two_factor_secret;
        $code = $this->google2fa->getCurrentOtp($secret);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/confirm', [
            'code' => $code
        ]);

        // Desabilita 2FA
        $disableCode = $this->google2fa->getCurrentOtp($secret);
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/disable', [
            'code' => $disableCode
        ]);

        $response->assertStatus(200);
        $this->assertNull($user->fresh()->two_factor_secret);
        $this->assertNull($user->fresh()->two_factor_confirmed_at);
    }

    public function test_usuario_pode_verificar_codigo_2fa()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        // Habilita e confirma 2FA
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/enable');

        $secret = $user->fresh()->two_factor_secret;
        $code = $this->google2fa->getCurrentOtp($secret);

        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/confirm', [
            'code' => $code
        ]);

        // Verifica código
        $verifyCode = $this->google2fa->getCurrentOtp($secret);
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/2fa/verify', [
            'code' => $verifyCode
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Código válido']);
    }
} 