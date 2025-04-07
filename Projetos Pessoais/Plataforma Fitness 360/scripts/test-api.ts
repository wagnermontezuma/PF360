import fetch from 'node-fetch';

const testApi = async () => {
  const token = process.env.JWT_TOKEN;
  
  if (!token) {
    console.error('Please set JWT_TOKEN environment variable');
    process.exit(1);
  }

  const query = `
    query TestQuery {
      membersByEmail(email: "joao@teste.com") {
        id
        name
        email
      }
    }
  `;

  try {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-tenant-id': 'academia-teste'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testApi(); 