/** @type {import('next').NextConfig} */
const nextConfig = {
  // ! Alert: Disabling React Strict Mode may hide potential issues
  reactStrictMode: false,

  // * Highlight: Set output to 'standalone' for improved performance
   // output: 'standalone',

  // * Highlight: Enable file system based routing
  useFileSystemPublicRoutes: true,

  // * Highlight: Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  // * Highlight: Custom webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // * Highlight: Add fallbacks for Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // * Highlight: Add source-map-loader for better debugging
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: [
        /node_modules/,
        /\.next\//,
      ],
    });

    return config;
  },

  // * Highlight: Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // * Highlight: Custom rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/d/:id',
        destination: `http://localhost:${process.env.DOWNLOAD_PORT || 3023}/:id`,
      },
    ];
  },
};

module.exports = nextConfig;