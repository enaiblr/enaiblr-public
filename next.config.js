/** @type {import('next').NextConfig} */

const nextConfig = {
  //  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  metadata: {
    metadataBase: 'https://enaiblr.org',
  },
};

module.exports = nextConfig;
