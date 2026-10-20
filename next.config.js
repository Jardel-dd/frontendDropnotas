/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove o painel/indicador de problemas exibido apenas pelo Next.js em desenvolvimento.
  devIndicators: false,
  agentRules: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    // Evita a exposicao de dados de negocio, credenciais ou respostas de API pelo Console em producao.
    removeConsole: process.env.NODE_ENV === 'production'
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "base-uri 'self'; frame-ancestors 'none'; object-src 'none'" },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
        ]
      }
    ];
  },
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
