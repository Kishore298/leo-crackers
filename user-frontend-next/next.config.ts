import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  experimental: {
    scrollRestoration: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.leocrackers.com",
          },
        ],
        destination: "https://leocrackers.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;