import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/tiny-note',
  assetPrefix: '/tiny-note',
  // 开发模式下启用准确的 sourcemap
  productionBrowserSourceMaps: false, // 生产环境不生成 sourcemap（静态导出不支持）
  // 开发模式下的 webpack 配置
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 开发模式下使用更准确的 sourcemap
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};

export default nextConfig;
