import type { NextConfig } from "next";

const desktopBuild = process.env.DESKTOP_BUILD === "1";
const githubPagesBuild = process.env.GITHUB_PAGES === "1";
const staticExport = desktopBuild || githubPagesBuild;
const githubPagesBasePath = "/football-card-aesthetics";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(githubPagesBuild
    ? {
        basePath: githubPagesBasePath,
        env: { NEXT_PUBLIC_BASE_PATH: githubPagesBasePath },
      }
    : {}),
};

export default nextConfig;
