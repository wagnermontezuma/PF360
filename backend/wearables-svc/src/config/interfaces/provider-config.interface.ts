export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  authorizationUrl: string;
  tokenUrl: string;
}

export interface GarminConfig extends OAuthConfig {
  apiBaseUrl: string;
  webhookVerificationToken: string;
}

export interface PolarConfig extends OAuthConfig {
  apiBaseUrl: string;
  webhookSecret: string;
}

export interface HealthKitConfig {
  bundleId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}

export interface ProvidersConfig {
  garmin: GarminConfig;
  polar: PolarConfig;
  healthkit: HealthKitConfig;
} 