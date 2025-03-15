import React, { useState } from "react";

interface BetFormProps {
  onPlaceBet: (amount: string) => void;
}

const BetForm: React.FC<BetFormProps> = ({ onPlaceBet }) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) > 0) {
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
          placeholder="Введите сумму"
          required
          disabled={isLoading}
        />
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
