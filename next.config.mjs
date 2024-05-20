/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { taint: true },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;
