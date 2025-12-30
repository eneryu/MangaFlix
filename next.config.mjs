/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uploads.mangadex.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'd28hgpri8am2if.cloudfront.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.mangadex.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cmdxd98sb0x3yprd.mangadex.network',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
