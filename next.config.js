/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: [
      'localhost',
      // Add your S3/CDN domains here
      's3.amazonaws.com',
      'your-bucket.s3.region.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // Enable if using Server Components optimizations
    serverActions: true,
  },

  webpack: (config, { isServer }) => {
    // Fix for canvas package (used by @react-pdf/renderer)
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }
    return config;
  },

  // Environment variables available in browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'Aid Management Platform',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/student/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
