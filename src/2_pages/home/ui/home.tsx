import { type FC } from "react";
import { type HomePageProps } from "../model/types";

export const HomePage: FC<HomePageProps> = () => {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Coin Flip Betting
        </h1>
        {/* Здесь будут виджеты */}
      </div>
    </main>
  );
};
