import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // 静的エクスポート
  trailingSlash: true, // GitHub Pages対応
  basePath: process.env.NODE_ENV === 'production' ? '/picture-book-reader-nextjs' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/picture-book-reader-nextjs/' : '',
  distDir: 'out',
  images: {
    unoptimized: true, // 静的エクスポート時は必須
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintチェックを無効化
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScriptエラーも一時的に無視
  },
}

export default nextConfig
