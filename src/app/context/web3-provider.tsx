"use client";

import { wagmiAdapter, projectId } from "@/app/config/web3-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { moonbaseAlpha } from "viem/chains";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Создаем QueryClient для React Query
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Настройка метаданных для AppKit
const metadata = {
  name: "Coin Flip Betting",
  description: "Betting game on Moonbeam network",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Создаем модальное окно AppKit для подключения кошельков
export const walletModal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [moonbaseAlpha],
  defaultNetwork: moonbaseAlpha,
  metadata: metadata,
  features: {
    analytics: false,
  },
});

// Провайдер для Web3 функциональности
function Web3Provider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  // Используем initialState только если cookies доступны
  const initialState = cookies
    ? cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    : undefined;

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3Provider;
