/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_API_SERVER_URL: process.env.NEXT_PUBLIC_API_SERVER_URL,
	},
};

module.exports = nextConfig;
