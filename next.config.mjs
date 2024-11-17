/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add rule for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  async headers () {
    return [
      {
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      },
    ]
  },
  output: 'standalone',
}

export default nextConfig
