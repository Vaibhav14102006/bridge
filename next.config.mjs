/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simple configuration for Next.js 16 with Turbopack
  turbopack: {
    root: process.cwd(), // Set explicit root directory
  },
  
  // Enable optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Optimize images for smaller memory usage
  images: {
    formats: ['image/webp'],
    imageSizes: [16, 32, 48, 64],
    deviceSizes: [640, 750, 828, 1080],
  },
  
  // Enable compression
  compress: true,
  
  // Remove source maps in production for smaller bundle
  productionBrowserSourceMaps: false,
  
  // Remove powered by header
  poweredByHeader: false,
}

export default nextConfig
