import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studyn AI OS",
  description: "Your intelligent study workspace",
  icons: {
    icon: "/logo.png",
  },
};

import ThemeEngine from "@/components/os/ThemeEngine";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeEngine />
        {children}
      </body>
    </html>
  );
}
