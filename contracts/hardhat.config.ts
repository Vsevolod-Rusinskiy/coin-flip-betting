import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: "https://rpc.api.moonbeam.network", // RPC URL для Moonbase Alpha
      accounts: [process.env.PRIVATE_KEY!], // Используйте переменную среды для приватного ключа
    },
  },
};

export default config;
