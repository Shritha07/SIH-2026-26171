/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@privacy-agent/shared-types',
    '@privacy-agent/action-protocol',
    '@privacy-agent/privacy-core',
  ],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
};

export default nextConfig;
