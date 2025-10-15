import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Script from 'next/script';

export const metadata = {
  title: "JoyHoops | Empowering Youth Through Sports",
  description: "Join JoyHoops to support youth basketball programs and sports.",
  openGraph: {
    title: "JoyHoops",
    description: "Empowering youth through sports.",
    url: "https://joyhoops.org",
    siteName: "JoyHoops",
    locale: "en_US",
    type: "website",
  }
};
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Nonprofit Organization",
    "name": "JoyHoops",
    "url": "https://joyhoops.org"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
            html {
              font-family: ${GeistSans.style.fontFamily};
              --font-sans: ${GeistSans.variable};
              --font-mono: ${GeistMono.variable};
            }
        `}</style>
      </head>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <body>
        {children}
      </body>
    </html>
  )
}
