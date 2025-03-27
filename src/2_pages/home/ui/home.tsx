"use client";

import { type FC, useState } from "react";
import { type HomePageProps } from "../model/types";
import {
  ConnectButton,
  NetworkWarning,
  useWalletStatus,
} from "@features/connect-wallet";
import { WalletInfo } from "@entities/wallet";
import BetForm from "@features/make-bet/ui/bet-form";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/config/contract-config";

export const HomePage: FC<HomePageProps> = () => {
  const { isConnected, isCorrectNetwork } = useWalletStatus();
  const canPlay = isConnected && isCorrectNetwork;
  const [betResult, setBetResult] = useState<{
    choice: boolean;
    result: boolean;
  } | null>(null);


  const handlePlaceBet = async (amount: string) => {
    try {
      // Получаем первый результат для выбора игрока
      const choice = await getCoinFlipResult();
      console.log("Первый бросок (choice):", choice ? "Орёл" : "Решка");

      // Используем wagmi для работы с контрактом
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // Конвертируем amount в wei
      const betAmount = ethers.parseEther(amount);
      console.log("Размещаем ставку:", betAmount.toString(), "wei");

      // Размещаем ставку в контракте
      const tx = await contract.placeBet(choice, { value: betAmount });
      await tx.wait();
      console.log("Ставка размещена");

      // Получаем второй результат
      const result = await getCoinFlipResult();
      console.log("Второй бросок (result):", result ? "Орёл" : "Решка");

      // Разрешаем ставку в контракте
      const resolveTx = await contract.resolveBet(result);
      await resolveTx.wait();
      console.log("Ставка разрешена");

      // Показываем результат
      setBetResult({ choice, result });
    } catch (error) {
      console.error("Ошибка при размещении ставки:", error);
    }
  };

  const getCoinFlipResult = async () => {
    return new Promise<boolean>((resolve, reject) => {
      const EXTENSION_ID = "gbnopckdabbbomnobanhcfhmonhehaea";

      if (typeof chrome === "undefined" || !chrome.runtime) {
        reject("Расширение Chrome не установлено или недоступно");
        return;
      }

      chrome.runtime.sendMessage(
        EXTENSION_ID,
        { action: "flip" },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }

          if (response && response.success) {
            resolve(response.result);
          } else {
            reject("Не удалось получить результат от расширения");
          }
        }
      );
    });
  };

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-end mb-4">
          <ConnectButton />
        </div>
        <NetworkWarning />
        <h1 className="text-4xl font-bold text-center mb-8">
          Coin Flip Betting
        </h1>

        {canPlay ? (
          <>
            <WalletInfo betResult={betResult}/>
            {typeof chrome !== "undefined" && chrome.runtime ? (
              <>
                <BetForm onPlaceBet={handlePlaceBet} />
                {betResult && (
                  <div className="mt-4 p-4 bg-white rounded-lg shadow-md text-gray-800">
                    <h3 className="text-lg font-semibold mb-2">
                      Результат ставки:
                    </h3>
                    <p>Ваш бросок: {betResult.choice ? "Орёл" : "Решка"}</p>
                    <p>Результат: {betResult.result ? "Орёл" : "Решка"}</p>
                    <p
                      className={`font-bold ${
                        betResult.choice === betResult.result
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {betResult.choice === betResult.result
                        ? "Победа! 🎉"
                        : "Поражение 😢"}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <p className="text-center text-gray-600 mb-4">
                  Пожалуйста, установите расширение Chrome Coin Flip для игры
                </p>
              </div>
            )}
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

