import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Karrot Market",
    default: "Karrot Market",
  },
  description: "Sell and buy all the things",
};

export default function RootLayout({
  children,
  //@ts-ignore
  potato,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(potato);
  return (
    <html lang="en">
      <body
        className={`${inter.className} mx-auto max-w-screen-sm bg-neutral-900 text-white`}
      >
        {potato}
        {children}
      </body>
    </html>
  );
}
