/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pokiifuns.com" },
      { protocol: "https", hostname: "www.pokiifuns.com" },
      { protocol: "https", hostname: "pokiigame.com" },
      { protocol: "https", hostname: "www.pokiigame.com" },
      { protocol: "https", hostname: "img.gamemonetize.com" },
      { protocol: "https", hostname: "blogcafeai.s3.eu-north-1.amazonaws.com" },
      { protocol: "https", hostname: "blogcafeai.s3.amazonaws.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Allow unoptimized images for local games
    unoptimized: false,
  },
  async headers() {
    return [
      {
        // Apply to all routes: grant iframe features for smoother gameplay
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "gamepad=*; fullscreen=*; autoplay=*; accelerometer=*; gyroscope=*; clipboard-read=*; clipboard-write=*; encrypted-media=*; picture-in-picture=*; xr-spatial-tracking=*",
          },
        ],
      },
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
      {
        source: "/fonts/(.*)\\.(woff|woff2)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(),
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
