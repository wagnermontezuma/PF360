import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CorosModule } from './coros.module';
import { CorosService } from './coros.service';

describe('CorosModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => ({
            providers: {
              coros: {
                clientId: 'test-client-id',
                clientSecret: 'test-client-secret',
                redirectUri: 'http://localhost:3000/callback',
                apiBaseUrl: 'https://api.coros.com',
                authUrl: 'https://auth.coros.com',
                webhookSecret: 'test-webhook-secret',
              },
            },
          })],
        }),
        CorosModule,
      ],
    }).compile();

    expect(module).toBeDefined();
    const service = module.get<CorosService>(CorosService);
    expect(service).toBeInstanceOf(CorosService);
  });
}); 