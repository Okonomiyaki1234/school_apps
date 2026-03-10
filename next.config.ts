import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

const baseConfig: NextConfig = {
  // 他のNext.js設定があればここに追加
};

const pwaConfig = {
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
  // manifestやswのパスはデフォルトでOK
};

export default isProd ? withPWA({ ...baseConfig, pwa: pwaConfig }) : baseConfig;
