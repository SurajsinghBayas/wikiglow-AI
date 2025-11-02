import './globals.css'
import { Inter } from 'next/font/google'
import Toaster from '@/components/Toaster'
import ClientBoot from '@/components/ClientBoot'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WikiGlow',
  description: 'Beautiful readable Wikipedia articles'
}

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?
          family=Inter:wght@400;600;800&
          family=Lexend:wght@400;600;800&
          family=Poppins:wght@400;600;800&
          family=Roboto:wght@400;500;700&
          family=Open+Sans:wght@400;600;700&
          family=IBM+Plex+Sans:wght@400;600;700&
          family=Source+Serif+4:wght@400;700&
          family=Merriweather:wght@400;700&
          family=Lora:wght@400;700&display=swap" rel="stylesheet" />
        {/* Google AdSense (auto ads) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8037321916392892"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientBoot />
        <Toaster />
        {children}
      </body>
    </html>
  )
}
