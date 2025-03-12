"use client";

import { type FC, useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { modal } from "@/context";

export const ConnectButton: FC = () => {
  console.log("🔍 Рендер ConnectButton");

  const { address, isConnected, status } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отслеживаем изменение статуса подключения
  useEffect(() => {
    console.log("🔍 Изменение статуса:", status);
    if (status === "connecting") {
      console.log("🔄 Начало подключения, устанавливаем isLoading = true");
      setIsLoading(true);
    } else {
      console.log(
        "🔄 Статус изменился на",
        status,
        ", устанавливаем isLoading = false"
      );
      setIsLoading(false);
    }
  }, [status]);

  const handleConnect = async () => {
    console.log("👆 Нажата кнопка подключения кошелька");
    setError(null);
    setIsLoading(true);
    try {
      console.log("🔍 Попытка открыть AppKit Modal");
      await modal.open();
      console.log("✅ AppKit Modal успешно открыт");
    } catch (error) {
      console.error("❌ Ошибка при подключении кошелька:", error);
      setError("Ошибка подключения");
    } finally {
      console.log(
        "🔍 Завершение обработки подключения, устанавливаем isLoading = false"
      );
      setIsLoading(false);
    }
  };

  // Функция для открытия модального окна с выбором сети
  const handleOpenNetworkModal = async () => {
    console.log("👆 Нажата кнопка смены сети");
    try {
      console.log("🔍 Попытка открыть модальное окно сетей");
      await modal.open({ view: "Networks" });
      console.log("✅ Модальное окно сетей успешно открыто");
    } catch (error) {
      console.error("❌ Ошибка при открытии модального окна сетей:", error);
    }
  };

  console.log("🔍 Состояние ConnectButton:", {
    isConnected,
    status,
    address: address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : undefined,
    isLoading,
    error,
  });

  if (isConnected && address) {
    console.log("✅ Рендер: Кошелек подключен");
    return (
      <div className="flex flex-col items-end">
        <button
          onClick={handleConnect}
          className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-2 ${
            isLoading ? "opacity-70" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading
            ? "Загрузка..."
            : `${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>
        <div className="flex flex-col">
          {balance && (
            <div className="text-sm text-gray-600">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </div>
          )}
          <button
            onClick={handleOpenNetworkModal}
            className="text-xs text-blue-500 hover:text-blue-700 mt-1"
          >
            Сменить сеть
          </button>
        </div>
      </div>
    );
  }

  console.log("🔍 Рендер: Кнопка подключения");
  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleConnect}
        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
          isLoading ? "opacity-70" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Подключение..." : "Подключить кошелек"}
      </button>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
