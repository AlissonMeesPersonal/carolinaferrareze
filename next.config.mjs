/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Links antigos continuam acessíveis e redirecionam para o nome correto.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'carolineferrareze.vercel.app' }],
        destination: 'https://carolinaferrareze.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
