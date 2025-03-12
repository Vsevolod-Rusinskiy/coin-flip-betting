import type { Metadata } from "next";
import "./globals.css";

import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "Coin Flip Betting",
  description: "Betting game on Moonbeam network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={null}>{children}</ContextProvider>
      </body>
    </html>
  );
}
