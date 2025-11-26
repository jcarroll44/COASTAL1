// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Do not fail the build because of ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
