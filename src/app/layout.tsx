import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins, Inter, Roboto } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--poppins',
  subsets: ['latin'],
  weight: ['400'],
});

const inter = Inter({
  variable: '--inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--roboto',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Booking',
  description: 'Site de reservas de salas de reunião',
  applicationName: 'Booking',
  icons: '/icons/favicon.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} ${roboto.variable} font-sans antialiased bg-[#F7F9FB] overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
