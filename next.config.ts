import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Root level property for latest Next.js versions
  allowedDevOrigins: ['192.168.188.1', 'localhost:3000'],
};

export default nextConfig;
