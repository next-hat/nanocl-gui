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
  transpilePackages: ["nanocl-gui-toolkit"],
}

export default nextConfig
