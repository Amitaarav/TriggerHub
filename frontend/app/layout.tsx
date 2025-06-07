import type { Metadata } from "next";
import "./globals.css";
import { twMerge } from "tailwind-merge";
export const metadata: Metadata = {
  title: "TriggerHub",
  description: "Automate your workflow in no code way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
