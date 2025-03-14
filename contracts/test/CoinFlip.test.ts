import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CoinFlip } from "../typechain-types";

describe("CoinFlip Contract", function () {
  let coinFlip: CoinFlip;
  let owner: SignerWithAddress;
  let player: SignerWithAddress;

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();

    const CoinFlipFactory = await ethers.getContractFactory("CoinFlip");
    coinFlip = await CoinFlipFactory.deploy() as CoinFlip;
    await coinFlip.waitForDeployment();
  });

  it("should allow players to place a bet", async function () {
    const betAmount = parseEther("1"); // 1 ETH
    await expect(
      coinFlip.connect(player).placeBet(true, { value: betAmount })
    )
      .to.emit(coinFlip, "BetPlaced")
      .withArgs(player.address, betAmount, true);
  });

  it("should not allow a bet with zero value", async function () {
    await expect(
      coinFlip.connect(player).placeBet(true, { value: 0n })
    ).to.be.revertedWith("Bet amount must be greater than zero");
  });

  it("should resolve the bet and pay the winner", async function () {
    const betAmount = parseEther("1"); // 1 ETH
    await coinFlip.connect(player).placeBet(true, { value: betAmount });

    // Ensure the contract has enough balance to pay out the winner
    await owner.sendTransaction({
      to: await coinFlip.getAddress(),
      value: betAmount * 2n
    })

    const initialBalance = await ethers.provider.getBalance(player.address);

    // Simulate coin flip result as 'true'
    await coinFlip.connect(owner).resolveBet(true);

    const finalBalance = await ethers.provider.getBalance(player.address);

    // Player should receive double the bet amount (considering gas fees)
    expect(finalBalance - initialBalance).to.be.above(betAmount);
  });


  it("should not resolve a bet if no bet has been placed", async function () {
    await expect(
      coinFlip.connect(owner).resolveBet(true)
    ).to.be.revertedWith("No bet placed");
  });
});
