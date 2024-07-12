/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  useFileSystemPublicRoutes: true,
  productionBrowserSourceMaps: true,
};

export default nextConfig;