import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/grants/g-ca-general",
        destination: "/grants/g-ca-arts-youth",
        permanent: true,
      },
      {
        source: "/grants/g-zff",
        destination: "/grants/g-zff-community-arts",
        permanent: true,
      },
      {
        source: "/grants/g-fleish",
        destination: "/grants/g-fleish-small-arts",
        permanent: true,
      },
      {
        source: "/grants/g-acta-lc",
        destination: "/grants/g-acta-living-cultures",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
