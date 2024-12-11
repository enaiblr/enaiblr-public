/** @type {import('next').NextConfig} */

const nextConfig = {
  //  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // metadata: {
  //   metadataBase: 'https://enaiblr.org',
  // },
  serverExternalPackages: ['groq-sdk'], // Moved outside of experimental
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

module.exports = nextConfig;