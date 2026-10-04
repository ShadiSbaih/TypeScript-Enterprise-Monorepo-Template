/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/utils"],
  output: "standalone"
};

module.exports = nextConfig;
