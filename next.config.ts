import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],

    unoptimized: true
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // ← limite augmentée à 20 MB
    },
  },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
