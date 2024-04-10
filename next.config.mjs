/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "kcdgbombnfaplnejrmut.supabase.co",
      },
    ],
  },
};

export default nextConfig;
