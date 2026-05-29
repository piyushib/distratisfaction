/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Trailing slash needed for Capacitor file:// loading
  trailingSlash: true,
}
module.exports = nextConfig
