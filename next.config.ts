import type { NextConfig } from "next";
const isPWA = process.env.VERCEL === "1";

let nextConfig: NextConfig = {
  /* config options here */
};

if (isPWA) {
  const withPWA = require("next-pwa")({
    dest: "public",
    disable: !isPWA,
  });
  nextConfig = withPWA(nextConfig);
}

export default nextConfig;
