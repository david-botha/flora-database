import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-28b3d765f3384db0b9ca6aeecbdf9c7d.r2.dev' },
    ],
  },
}

export default nextConfig
