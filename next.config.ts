import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // app/global-not-found.tsx: the site has two root layouts (app/[lang] and app/admin).
    globalNotFound: true,
    serverActions: {
      // Project screenshots are uploaded through a Server Action (limit is 4 MB in the form).
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
