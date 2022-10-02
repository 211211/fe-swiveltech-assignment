/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
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
