/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client"],
    // İstemci gezinmesi eski RSC kopyasını tutmasın; tıklayınca güncel veri gelsin.
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    // AVIF ilk istekte yavaş kodlanır; boş/geç yanıt gibi görünür. WebP yeterli.
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/((?!_next/).*)",
        headers: [{ key: "Link", value: '</llms.txt>; rel="describedby"' }],
      },
    ];
  },
};
export default nextConfig;

