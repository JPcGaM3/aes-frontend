/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: "/aes",
	assetPrefix: "/aes/",
	images: {
		path: "/aes/_next/image",
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
};

module.exports = nextConfig;
