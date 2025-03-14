// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public player;
    uint256 public amount;
    bool public choice; // true for heads, false for tails
    bool public result; // result of the coin flip

    // Event to emit when a bet is placed
    event BetPlaced(address indexed player, uint256 amount, bool choice);
    // Event to emit when a bet is resolved
    event BetResolved(address indexed player, bool result);

    // Функция для приема ETH
    receive() external payable {}

    // Function to place a bet
    function placeBet(bool _choice) external payable {
        require(msg.value > 0, "Bet amount must be greater than zero");
        player = msg.sender;
        amount = msg.value;
        choice = _choice;

        emit BetPlaced(player, amount, choice);
    }

    // Function to resolve the bet
    function resolveBet(bool _result) external {
    require(player != address(0), "No bet placed");
    result = _result;

    // Logic to determine if the player wins
    if (result == choice) {
        // Player wins, transfer the amount back
        payable(player).transfer(amount * 2); // Example payout
    } else {
        // If the player loses, you can add a failure handling, if needed
        // For now we are doing nothing if the bet is lost
    }

    emit BetResolved(player, result);

    // Reset the state for the next bet
    player = address(0);
    amount = 0;
    choice = false;
}
}
