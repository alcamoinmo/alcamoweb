/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ndouarmfpuzdfnkbulay.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 