import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { moonbaseAlpha } from "viem/chains";

// Project ID from WalletConnect Cloud
export const projectId = "f7e8d177a26c7ae27a5745f256a8668b";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Используем только Moonbase Alpha
export const networks = [moonbaseAlpha];

// Настройка Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
