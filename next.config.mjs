/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
