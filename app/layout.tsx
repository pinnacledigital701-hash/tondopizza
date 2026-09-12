import type {Metadata} from 'next';
import { Anton, Bebas_Neue, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-anton',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-bebas',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tondo Pizza Co. • Woodfired Neapolitan Pizza',
  description: 'Artisanal woodfired Neapolitan pizza featuring 48-hour fermented dough, San Marzano tomatoes, and 450°C wood oven craft.',
  icons: {
    icon: [
      { url: '/tondologo.png', type: 'image/png' },
    ],
    shortcut: '/tondologo.png',
    apple: '/tondologo.png',
  },
  openGraph: {
    title: 'Tondo Pizza Co. • Woodfired Neapolitan Pizza',
    description: 'Artisanal woodfired Neapolitan pizza featuring 48-hour fermented dough, San Marzano tomatoes, and 450°C wood oven craft.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tondo Pizza Co. • Woodfired Neapolitan Pizza',
    description: 'Artisanal woodfired Neapolitan pizza featuring 48-hour fermented dough, San Marzano tomatoes, and 450°C wood oven craft.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${anton.variable} ${bebasNeue.variable} ${plusJakarta.variable}`}
    >
      <body suppressHydrationWarning className="bg-[#F7F4EE] text-[#181514] antialiased selection:bg-[#E5381B] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}

