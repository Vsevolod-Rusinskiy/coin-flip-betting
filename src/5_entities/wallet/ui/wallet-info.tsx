"use client";

import { useEffect, useState, type FC } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { moonbaseAlpha } from "viem/chains";

interface WalletInfoProps {
  betResult: { choice: boolean; result: boolean } | null
}

export const WalletInfo: FC<WalletInfoProps> = ({ betResult }) => {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useBalance({
    address,
  });
  const chainId = useChainId();

  const [balanceShow, setBalanceShow] = useState(parseFloat(balance?.formatted || "0").toFixed(4));

  const handleRefreshBalance = async () => {
    await refetch();
  };


  useEffect(() => {
    if (betResult !== null) {
      refetch();
      setBalanceShow(parseFloat(balance?.formatted || "0").toFixed(4));
    }
  }, [betResult, refetch, balance]);

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
              {balanceShow} {balance.symbol}
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
