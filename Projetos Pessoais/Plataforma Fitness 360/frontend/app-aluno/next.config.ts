import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    PORT: process.env.PORT || "3006",
  },
  experimental: {
  },
};

export default nextConfig;
