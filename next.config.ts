import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["three"],

  async rewrites() {
    return [
      {
        source: "/:path*",    // match ANY route
        destination: "/",      // always show homepage
      },
    ];
  },
};

export default nextConfig;
