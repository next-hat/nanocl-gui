/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  swcMinify: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
// module.exports = nextConfig
