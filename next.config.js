const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      {
      protocol: "https",
      hostname: "**.amazonaws.com",
    },
      
    ],
  },

  typescript: {
    ignoreBuildErrors: !isDev,
  },

  eslint: {
    ignoreDuringBuilds: !isDev,
  },

  productionBrowserSourceMaps: true,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "dikshantias.com",
          },
        ],
        destination: "https://www.dikshantias.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
