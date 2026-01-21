import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone untuk optimasi Docker image
  output: "standalone",
};

export default nextConfig;
