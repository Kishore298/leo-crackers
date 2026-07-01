import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
