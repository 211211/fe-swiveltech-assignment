/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['randomuser.me'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL
  }
  // async rewrites() {
  //   return [
  //     {
  //       source: "/employee",
  //       destination: `${process.env.API_URL}/employee`,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
