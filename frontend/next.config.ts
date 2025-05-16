import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  images: {
    domains: ['external-content.duckduckgo.com', 'tse1.mm.bing.net'], // add other sources too
  },
}

export default nextConfig;
