import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--roboto-text",
});

const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubick-text",
});

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(roboto);
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubick.variable} mx-auto max-w-screen-sm bg-neutral-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
