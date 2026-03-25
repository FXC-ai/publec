import type { Metadata } from "next";
import "./globals.css";
import Navigation from './components/Navigation/Navigation'
import Footer from './components/Footer/Footer'

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
    <html lang="fr">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
