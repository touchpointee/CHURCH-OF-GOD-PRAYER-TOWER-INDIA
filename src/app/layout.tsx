import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Church of God Prayer Tower India",
  description: 'A place of Faith, Hope & Community',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NND7509M45"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NND7509M45');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-background-light text-text-light transition-colors duration-300">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
