import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
    after: true,
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

export default withSentryConfig(nextConfig, {
  org: "cs-arena",
  project: "cs-arena",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  sourcemaps: {
    disable: false,
  },
  disableLogger: true,
  automaticVercelMonitors: true,
});