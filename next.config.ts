import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Project screenshots are uploaded through a Server Action (limit is 4 MB in the form).
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
