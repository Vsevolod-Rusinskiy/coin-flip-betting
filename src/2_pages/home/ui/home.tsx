"use client";

import { type FC } from "react";
import { type HomePageProps } from "../model/types";
import {
  ConnectButton,
  NetworkWarning,
  useWalletStatus,
} from "@features/connect-wallet";
import { WalletInfo } from "@entities/wallet";

export const HomePage: FC<HomePageProps> = () => {
  const { isConnected, isCorrectNetwork } = useWalletStatus();
  const canPlay = isConnected && isCorrectNetwork;

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <div className="flex justify-end mb-4">
          <ConnectButton />
        </div>
        <NetworkWarning />
        <h1 className="text-4xl font-bold text-center mb-8">
          Coin Flip Betting
        </h1>

        {canPlay ? (
          <>
            <WalletInfo />
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-gray-600 mb-4">
                Скоро здесь появится форма для ставок!
              </p>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <p className="text-center text-gray-600 mb-4">
              {isConnected
                ? "Пожалуйста, переключитесь на правильную сеть"
                : "Подключите кошелек, чтобы начать игру"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
