"use client";

import { useAccount, useChainId } from "wagmi";
import { moonbaseAlpha } from "viem/chains";

export const useWalletStatus = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();

  const isCorrectNetwork = chainId === moonbaseAlpha.id;

  console.log("🔍 useWalletStatus:", {
    isConnected,
    address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : undefined,
    chainId,
    expectedChainId: moonbaseAlpha.id,
    isCorrectNetwork,
    networkName: chainId === moonbaseAlpha.id ? moonbaseAlpha.name : "Неизвестная сеть"
  });

  return {
    isConnected,
    address,
    isCorrectNetwork,
    chainId,
    expectedChainId: moonbaseAlpha.id,
    networkName: chainId === moonbaseAlpha.id ? moonbaseAlpha.name : "Неизвестная сеть",
    expectedNetworkName: moonbaseAlpha.name,
  };
}; 