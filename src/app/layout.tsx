import type { Metadata } from "next";
import "./globals.css";

import Web3Provider from "@/app/context/web3-provider";

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
        <Web3Provider cookies={null}>{children}</Web3Provider>
      </body>
    </html>
  );
}
