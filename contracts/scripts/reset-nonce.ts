import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const nonce = await ethers.provider.getTransactionCount(deployer.address, "pending");

  console.log(`📌 Current nonce: ${nonce}`);

  const tx = await deployer.sendTransaction({
    to: deployer.address,  // Отправляем себе
    value: 0,
    gasLimit: 21000,
    gasPrice: ethers.parseUnits("5", "gwei"), // Можно увеличить
    nonce: nonce, // Принудительно выставляем nonce
  });

  console.log(`✅ Sent empty tx to reset nonce: ${tx.hash}`);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
