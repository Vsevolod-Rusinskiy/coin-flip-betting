"use client";

import { useEffect, useState, type FC } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { moonbaseAlpha } from "viem/chains";



export const WalletInfo: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch, isLoading } = useBalance({ address });
  const chainId = useChainId();

  console.log('balance:', balance)

  const [balanceShow, setBalanceShow] = useState<string | null>(null);

  const updateBalance = async () => {
    await refetch();
    if (balance?.formatted) {
      setBalanceShow(parseFloat(balance.formatted).toFixed(4));
    }
  };

  useEffect(() => {
    if (balance?.formatted) {
      setBalanceShow(parseFloat(balance.formatted).toFixed(4));
    }
  }, [balance?.formatted]);


  const networkStatus = {
    isCorrectNetwork: chainId === moonbaseAlpha.id,
    name: chainId === moonbaseAlpha.id ? moonbaseAlpha.name : "Неизвестная сеть"
  };

  if (!isConnected || !address) return null;

  const AddressSection = () => (
    <div>
      <span className="font-medium">Адрес: </span>
      <span className="font-mono text-sm break-all">{address}</span>
    </div>
  );

  const BalanceSection = () => {
    if (isLoading || balanceShow === null) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">Баланс: </span>
          <span>Загрузка...</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="font-medium">Баланс: </span>
        <span>
          {balanceShow} {balance?.symbol}
        </span>
        <button 
          onClick={updateBalance}
          className="text-xl hover:opacity-70 transition-opacity"
          title="Обновить баланс"
        >
          🔄
        </button>
        <a
          href="https://faucet.moonbeam.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm ml-2"
        >
          Получить тестовые токены
        </a>
      </div>
    );
  };

  const NetworkSection = () => (
    <div>
      <span className="font-medium">Сеть: </span>
      <span className={networkStatus.isCorrectNetwork ? "text-green-600" : "text-red-600"}>
        {networkStatus.name} {networkStatus.isCorrectNetwork ? "✓" : "✗"}
      </span>
    </div>
  );

  const ChainIdSection = () => (
    <div>
      <span className="font-medium">Chain ID: </span>
      <span className="font-mono">{chainId}</span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Информация о кошельке</h2>
      <div className="space-y-2">
        <AddressSection />
        <BalanceSection />
        <NetworkSection />
        <ChainIdSection />
      </div>
    </div>
  );
};
