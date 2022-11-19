// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//Reference
// OpenZeppelin Docs Reference: https://docs.openzeppelin.com/contracts/4.x/erc20
// Constructor example: https://solidity-by-example.org/constructor/
// Inheritance: https://www.bitdegree.org/learn/solidity-inheritance
// OpenZepplin ERC20/721 Wizard: https://docs.openzeppelin.com/contracts/4.x/wizard
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BasicToken is ERC20 {
    constructor() ERC20("Basic", "BST") {
        _mint(msg.sender, 10 * 10 ** decimals()); // Premint 10 tokens (default 18 decimals).
    }
}
