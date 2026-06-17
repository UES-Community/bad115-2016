import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isPages ? "/BAD115-2016" : undefined,
  assetPrefix: isPages ? "/BAD115-2016/" : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
