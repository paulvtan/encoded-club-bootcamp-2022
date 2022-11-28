// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// ----- Description -----
// User can buyToken() -> An ERC20 Scam (SCM) token with ETH at the ratio of 1/5 ETH.
// User can also burn the token by calling returnToken() which will also transfer ETH back to user.
// User can buy specific NFT tokenId at a specific price set on contract deployment.

//------------------------
interface IScamToken is IERC20 {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

interface IMyERC721 is IERC721 {
    function safeMint(address to, uint256 amount) external;

    function burnFrom(uint256 tokenId) external;
}

contract TokenSale is Ownable {
    uint256 public ratio; // Implementing how much the token to give per 1 Ether paid.
    uint256 public price;
    IScamToken public paymentToken; // Specific ERC20 token we'll be accepting as payment.
    IMyERC721 public nftContract;
    uint256 public withdrawableAmount;

    constructor(
        uint256 _ratio,
        uint256 _price,
        address _paymentToken,
        address _nftContract
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = IScamToken(_paymentToken); // Payment Token is an ERC20 contract, it's a good idea to cast this with an interface, so we have access to its function declared in the interface.
        nftContract = IMyERC721(_nftContract);
    }

    // A function for customer to buy a fictional scam token.
    function buyToken() external payable {
        uint256 amount = msg.value / ratio; // msg.value - Since this function is `payable` it can receive Ethers.
        paymentToken.mint(msg.sender, amount);
    }

    function returnToken(uint256 amount) external {
        // Contract is attempting to destroy caller ERC20 token, this is not possible unless the account has given the contract allowance.
        paymentToken.burnFrom(msg.sender, amount); // This is calling ERC20Burnable.sol from our ERC20 derived contract. This function destroy caller address certain amount of this token.
        // This refunds the amount of ETH back to the caller from the contract.
        payable(msg.sender).transfer(amount * ratio); // Must make msg.sender into a payable object in order to call transfer() function.
    }

    function buyNFT(uint256 tokenId) external {
        // Transferring ERC20 token from caller to this contract.
        paymentToken.transferFrom(msg.sender, address(this), price);
        nftContract.safeMint(msg.sender, tokenId);
        // We'll allow user to refund the NFT for half a price it's bought for, other half is profit for contract owner.
        // withdrawableAmount is reserved profit (half from sale), for owner to withdraw.
        withdrawableAmount += price / 2;
    }

    // Only contract owner can call withdraw and withdraw half of the NFT sales proceeding.
    function withdraw(uint256 amount) external onlyOwner {
        withdrawableAmount -= amount;
        paymentToken.transfer(owner(), amount);
    }
}
