import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.BUILD_TARGET === 'capacitor' ? 'export' : undefined,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
}

export default nextConfig
