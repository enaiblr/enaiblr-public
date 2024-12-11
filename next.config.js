/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'groq-sdk'];
    return config;
  },
};

module.exports = nextConfig;