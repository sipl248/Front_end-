/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pokiigame.com", "img.gamemonetize.com"],
  },
  async headers() {
    return [
      {
        // Apply to all image assets in the public directory
        source: "/(.*)\\.(png|jpg|jpeg|webp|svg|gif|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(), // 1 year from now
          },
        ],
      },
    ];
  },
};

export default nextConfig;
