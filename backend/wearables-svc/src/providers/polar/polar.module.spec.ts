import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PolarModule } from './polar.module';
import { PolarService } from './polar.service';

describe('PolarModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        PolarModule,
        ConfigModule.forRoot({
          load: [
            () => ({
              providers: {
                polar: {
                  clientId: 'test-client-id',
                  clientSecret: 'test-client-secret',
                  redirectUri: 'http://localhost:3000/callback',
                  apiBaseUrl: 'https://api.polar.com',
                  authUrl: 'https://auth.polar.com',
                  webhookSecret: 'test-webhook-secret',
                },
              },
            }),
          ],
        }),
      ],
    }).compile();

    expect(module).toBeDefined();
    const service = module.get<PolarService>(PolarService);
    expect(service).toBeInstanceOf(PolarService);
  });
}); 