const isPWA = process.env.VERCEL === "1";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: !isPWA,
});

const nextConfig = {
  /* config options here */
};

module.exports = isPWA ? withPWA(nextConfig) : nextConfig;
