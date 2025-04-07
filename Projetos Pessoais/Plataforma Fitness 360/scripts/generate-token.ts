import * as jwt from 'jsonwebtoken';

const generateTestToken = () => {
  const payload = {
    sub: 'test-user',
    email: 'joao@teste.com',
    tenantId: 'academia-teste',
    roles: ['MEMBER']
  };

  const token = jwt.sign(payload, 'local-dev-secret', {
    expiresIn: '1h'
  });

  console.log('Test JWT Token:', token);
};

generateTestToken(); 