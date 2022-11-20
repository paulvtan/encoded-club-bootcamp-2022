// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IScamToken {
    function mint(address to, uint256 amount) external;
}

contract TokenSale {
    uint256 public ratio; // Implementing how much the token to give per 1 Ether paid.
    IScamToken public paymentToken; // Specific ERC20 token we'll be accepting as payment.

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IScamToken(_paymentToken); // Payment Token is an ERC20 contract, it's a good idea to cast this with an interface, so we have access to its function declared in the interface.
    }

    // A function for customer to buy a fictional scam token.
    function buyToken() external payable {
        uint256 amount = msg.value / ratio; // msg.value - Since this function is `payable` it can receive Ethers.
        paymentToken.mint(msg.sender, amount);
    }
}
