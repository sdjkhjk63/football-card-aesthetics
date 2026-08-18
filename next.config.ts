import type { NextConfig } from "next";

const desktopBuild = process.env.DESKTOP_BUILD === "1";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  ...(desktopBuild
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
