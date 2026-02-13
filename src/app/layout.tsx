import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Church of God Prayer Tower India",
  description: 'A place of Faith, Hope & Community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background-light text-text-light transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
