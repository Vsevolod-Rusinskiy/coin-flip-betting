import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const pendingTxCount = await ethers.provider.getTransactionCount(deployer.address, "pending");

  console.log(`🚀 Pending transactions count: ${pendingTxCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
