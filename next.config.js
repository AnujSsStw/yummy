/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.buzzfeed.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
