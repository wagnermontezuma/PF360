/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_MEMBERS_API_URL: process.env.NEXT_PUBLIC_MEMBERS_API_URL || 'http://localhost:3003',
    NEXT_PUBLIC_WORKOUTS_API_URL: process.env.NEXT_PUBLIC_WORKOUTS_API_URL || 'http://localhost:3007',
    NEXT_PUBLIC_NUTRITION_API_URL: process.env.NEXT_PUBLIC_NUTRITION_API_URL || 'http://localhost:3008',
  },
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 