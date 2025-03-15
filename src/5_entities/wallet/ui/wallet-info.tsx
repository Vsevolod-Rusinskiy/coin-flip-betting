"use client";

import { type FC } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { moonbaseAlpha } from "viem/chains";

export const WalletInfo: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useBalance({
    address,
  });
  const chainId = useChainId();

  const handleRefreshBalance = async () => {
    await refetch();
  };

  const isCorrectNetwork = chainId === moonbaseAlpha.id;
  const networkName = isCorrectNetwork
    ? moonbaseAlpha.name
    : "Неизвестная сеть";

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-gray-800">
      <h2 className="text-xl font-semibold mb-4 ">Информация о кошельке</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Адрес: </span>
          <span className="font-mono text-sm break-all">{address}</span>
        </div>
        {balance && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Баланс: </span>
            <span>
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
            <button
              onClick={handleRefreshBalance}
              className="p-1 hover:bg-gray-100 rounded-full ml-10px"
              title="Обновить баланс"
            >
              🔄
            </button>
          </div>
        )}
        <div>
          <span className="font-medium">Сеть: </span>
          <span
            className={isCorrectNetwork ? "text-green-600" : "text-red-600"}
          >
            {networkName} {isCorrectNetwork ? "✓" : "✗"}
          </span>
        </div>
        <div>
          <span className="font-medium">Chain ID: </span>
          <span className="font-mono">{chainId}</span>
        </div>
      </div>
    </div>
  );
};
