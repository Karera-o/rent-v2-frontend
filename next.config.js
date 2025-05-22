/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840], // Support larger sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512], // Support larger sizes
  },
  // Configure specific pages to be server-rendered
  experimental: {
    serverComponentsExternalPackages: ['next-pwa'],
  },
}

module.exports = withPWA(nextConfig);
