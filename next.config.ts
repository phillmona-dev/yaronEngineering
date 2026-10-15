import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920, 2560],
    // Uploaded media is served by the Spring Boot API (local dev + configured public host).
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/media/**" },
      { protocol: "http", hostname: "backend", port: "8080", pathname: "/media/**" },
      ...(process.env.MEDIA_HOSTNAME
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.MEDIA_HOSTNAME,
              pathname: "/media/**",
            },
          ]
        : []),
    ],
  },
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
