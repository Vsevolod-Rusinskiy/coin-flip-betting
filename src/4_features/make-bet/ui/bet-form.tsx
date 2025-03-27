import React, { useState } from "react";

interface BetFormProps {
  onPlaceBet: (amount: string) => void;
}

const BetForm: React.FC<BetFormProps> = ({ onPlaceBet }) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const betAmount = parseFloat(amount);
    if (betAmount > 0 && betAmount <= 1) {
      setIsLoading(true);
      try {
        await onPlaceBet(amount);
        setAmount("");
      } catch (error) {
        console.error("Ошибка при размещении ставки:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Сумма ставки:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Рекомендуемая ставка: 0.01"
          min="0.01"
          max="1"
          step="0.01"
          required
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-1">Максимальная ставка: 1 DEV</p>
      </div>
      <button
        type="submit"
        className={`w-full bg-blue-500 text-white p-2 rounded ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Подтверждение ставки..." : "Сделать ставку"}
      </button>
    </form>
  );
};

export default BetForm;
