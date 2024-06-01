/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
            },
        ],
        dangerouslyAllowSVG: true,
    },
};


export default nextConfig;
