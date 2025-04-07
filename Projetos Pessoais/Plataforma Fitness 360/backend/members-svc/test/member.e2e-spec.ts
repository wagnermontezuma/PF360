import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MemberResolver (e2e)', () => {
  let app: INestApplication;
  const tenantId = 'test-tenant';
  const authToken = 'test-token';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createMemberMutation = `
    mutation CreateMember($input: CreateMemberInput!) {
      createMember(input: $input) {
        id
        name
        email
        cpf
        phone
      }
    }
  `;

  it('should create a new member', () => {
    const memberData = {
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678900',
      phone: '11999999999',
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-tenant-id', tenantId)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: createMemberMutation,
        variables: { input: memberData },
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.createMember).toMatchObject({
          name: memberData.name,
          email: memberData.email,
          cpf: memberData.cpf,
          phone: memberData.phone,
        });
        expect(res.body.data.createMember.id).toBeDefined();
      });
  });
}); 