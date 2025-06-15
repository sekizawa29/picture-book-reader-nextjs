import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NODE_ENV === 'production' ? '/picture-book-reader-nextjs' : '';

export const metadata: Metadata = {
  title: "📚 絵本リーダー",
  description: "子どもと一緒に絵本を楽しむモバイル最適化リーダー",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "絵本リーダー",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: `${basePath}/icon-192.png`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#ff9800" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href={`${basePath}/icon-192.png`} />
      </head>
      <body className="library-page">
        {children}
      </body>
    </html>
  );
}
