import type { Metadata } from "next";
import "./globals.css";
import Navigation from './components/Navigation/Navigation'
import Footer from './components/Footer/Footer'
import { Inter, Poppins } from 'next/font/google'



const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})


const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})


export const metadata: Metadata = {
  title: "Laboratoire de test informatiques",
  description: "Expérimentations de différentes stacks technologiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
