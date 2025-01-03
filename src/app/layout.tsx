import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Food Recipe App",
  description: "Find and save your favorite recipes!",
};

const poppins = Poppins({
  weight: ["400", "500", "700"], // Regular, medium, bold
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
