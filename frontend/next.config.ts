import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'external-content.duckduckgo.com' },
      { hostname: 'tse1.mm.bing.net' },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
