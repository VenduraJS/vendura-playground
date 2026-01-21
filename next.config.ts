/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "vendura-core",
    "@vendura/mongodb",
    "@vendura/razorpay",
    "@vendura/webhooks",
    "@vendura/next"
  ]
};

module.exports = nextConfig;
