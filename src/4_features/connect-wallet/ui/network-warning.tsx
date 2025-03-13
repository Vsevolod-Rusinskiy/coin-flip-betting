"use client";

import { type FC } from "react";
import { useWalletStatus } from "../model/use-wallet-status";
import { useSwitchChain } from "wagmi";
import { moonbaseAlpha } from "viem/chains";
import { walletModal } from "@/context/web3-provider";

export const NetworkWarning: FC = () => {
  const { isConnected, isCorrectNetwork, networkName, expectedNetworkName } =
    useWalletStatus();
  const { switchChain } = useSwitchChain();

  if (!isConnected || isCorrectNetwork) {
    return null;
  }

  const handleSwitchNetwork = async () => {
    try {
      // Сначала пробуем использовать wagmi switchChain
      await switchChain({ chainId: moonbaseAlpha.id });
    } catch (error) {
      console.error("❌ Ошибка при переключении сети через wagmi:", error);

      // Если не получилось, открываем модальное окно сетей
      try {
        await walletModal.open({ view: "Networks" });
      } catch (modalError) {
        console.error(
          "❌ Ошибка при открытии модального окна сетей:",
          modalError
        );
      }
    }
  };

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
      <div className="flex items-center">
        <div className="py-1">
          <svg
            className="h-6 w-6 text-yellow-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold">Неправильная сеть</p>
          <p className="text-sm">
            Вы подключены к сети {networkName}. Пожалуйста, переключитесь на{" "}
            {expectedNetworkName}.
          </p>
          <button
            onClick={handleSwitchNetwork}
            className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Переключить сеть
          </button>
        </div>
      </div>
    </div>
  );
};
