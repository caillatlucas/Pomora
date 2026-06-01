import withPWAInit from "@ducanh2912/next-pwa";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = "Pomora";
const basePath = isGithubActions ? `/${repo}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
