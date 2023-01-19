/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
      INFURA_ID: process.env.INFURA_ID,
  },
}