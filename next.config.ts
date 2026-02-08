import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoName,
  assetPrefix: repoName,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
