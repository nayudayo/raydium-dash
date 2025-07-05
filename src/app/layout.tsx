import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raydium Dashboard",
  description: "Analytics dashboard for Raydium and Solana DEX ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {/* Mobile and Tablet View */}
        <div className="lg:hidden flex flex-col items-center justify-center h-screen bg-black text-white px-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Raydium Dashboard
            </h1>
            <p className="text-lg md:text-xl mb-2">
              View on Desktop for Best Experience
            </p>
            <p className="text-sm md:text-base text-gray-400">
              This dashboard is optimized for desktop viewing
            </p>
          </div>
        </div>
        
        {/* Desktop View */}
        <div className="hidden lg:block">
          {children}
        </div>
      </body>
    </html>
  );
}
