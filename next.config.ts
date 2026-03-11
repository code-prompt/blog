import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/library",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/library/:slug",
        destination: "/blogs/:slug",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/workflows",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/api",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
