"use client";

import { type FC, useEffect } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider, createConfig, useAccount } from "wagmi";
import { moonbaseAlpha } from "viem/chains";
import { http } from "viem";
import { type Web3ProviderProps } from "../model/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Создаем QueryClient для React Query
const queryClient = new QueryClient();

// Добавляем лог для отслеживания инициализации
console.log("🔍 Инициализация Web3Provider начата");

// Создаем конфигурацию
const config = createConfig({
  chains: [moonbaseAlpha],
  transports: {
    [moonbaseAlpha.id]: http("https://rpc.api.moonbase.moonbeam.network"),
  },
});

console.log("🔍 Конфигурация создана:", {
  chainId: moonbaseAlpha.id,
  chainName: moonbaseAlpha.name,
});

// Инициализируем Web3Modal
try {
  console.log("🔍 Попытка инициализации Web3Modal");
  createWeb3Modal({
    wagmiConfig: config,
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
    defaultChain: moonbaseAlpha,
    featuredWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    ],
    tokens: {
      [moonbaseAlpha.id]: {
        address: "0x0000000000000000000000000000000000000000",
      },
    },
    metadata: {
      name: "Coin Flip Betting",
      description: "Betting game on Moonbeam network",
      url: "http://localhost:3000",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
    enableAnalytics: false,
  });
  console.log("✅ Web3Modal успешно инициализирован");
} catch (error) {
  console.error("❌ Ошибка при инициализации Web3Modal:", error);
}

// Компонент для отслеживания статуса подключения
const ConnectionLogger: FC = () => {
  const { address, isConnected, status } = useAccount();

  useEffect(() => {
    console.log("🔄 Статус подключения изменился:", {
      status,
      isConnected,
      address: address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : undefined,
      timestamp: new Date().toISOString(),
    });
  }, [status, isConnected, address]);

  return null;
};

export const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  console.log("🔍 Рендер Web3Provider");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectionLogger />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
