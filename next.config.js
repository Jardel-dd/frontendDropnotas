/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/apps/mail',
        destination: '/apps/mail/inbox',
        permanent: true
      }
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.riv$/i,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[contenthash][ext]",
      },
    });
    return config;
  },
};

module.exports = nextConfig;
