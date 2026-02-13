import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* output: 'export', // Disabled for dynamic features */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
