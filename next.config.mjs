/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@clerk/nextjs"],
    serverComponentsExternalPackages: [
      "pdf-parse",
      "@pinecone-database/pinecone",
    ],
  },
};

export default nextConfig;
