import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class VerifyTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  tempToken: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class EnableTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class AuthResponse {
  accessToken: string;
  refreshToken: string;
  requires2FA?: boolean;
  tempToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    twoFactorEnabled: boolean;
  };
} 