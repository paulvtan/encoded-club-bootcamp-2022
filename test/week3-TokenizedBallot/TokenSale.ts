import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

import { calculateGasCosts } from "../../scripts/common/CalculateGasCosts"
import {
  MyERC721Token,
  MyERC721Token__factory,
  ScamToken,
  ScamToken__factory,
  TokenSale,
  TokenSale__factory,
} from "../../typechain-types"

const TEST_RATIO = 5
const NFT_PRICE = ethers.utils.parseEther("0.1")

describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[]
  let tokenSaleContract: TokenSale
  let paymentTokenContract: ScamToken
  let nftContract: MyERC721Token
  let erc20ContractFactory: ScamToken__factory
  let erc721ContractFactory: MyERC721Token__factory
  let tokenSaleContractFactory: TokenSale__factory

  beforeEach(async () => {
    // Fetching all the contract factory objects needed to facilitate token sale.
    ;[
      accounts,
      erc20ContractFactory,
      erc721ContractFactory,
      tokenSaleContractFactory,
    ] = await Promise.all([
      ethers.getSigners(),
      ethers.getContractFactory("ScamToken"),
      ethers.getContractFactory("MyERC721Token"),
      ethers.getContractFactory("TokenSale"),
    ])
    paymentTokenContract = await erc20ContractFactory.deploy()
    await paymentTokenContract.deployed()
    nftContract = await erc721ContractFactory.deploy()
    await nftContract.deployed()
    // Here we deployed tokenSale contract, passing in the ERC20 contract which will be minted when user buy the token through TokenSale.sol contract.
    tokenSaleContract = await tokenSaleContractFactory.deploy(
      TEST_RATIO,
      NFT_PRICE,
      paymentTokenContract.address,
      nftContract.address
    )
    await tokenSaleContract.deployed() // or await the deploy contract transaction.
    // Since ERC20 uses role based access control, we need to grant its MINTER_ROLE to TokenSale in order for tokenSale to call ERC20's mint function.
    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE()
    const roleTx = await paymentTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    )
    // Also grant TokenSale.sol MINTER_ROLE on nftContract as well.
    await roleTx.wait()
    const roleTx2 = await nftContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    )
  })

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const ratio = await tokenSaleContract.ratio()
      expect(ratio).to.eq(TEST_RATIO)
    })

    it("uses a valid ERC20 as payment token", async () => {
      const paymentAddress = await tokenSaleContract.paymentToken() // The TokenSale.sol when deployed specified the ERC20 token it will accept. We're grabbing its payment token address.
      const paymentContract = erc20ContractFactory.attach(paymentAddress) // We can pull that contract object to check whether it's a valid ERC20 contract by attaching a contract factory to its address.
      await expect(paymentContract.balanceOf(accounts[0].address)).not.to.be // Here we call `balaceOf` and tx should be valid. This is to proof the contract is an ERC20 contract.
        .reverted
      await expect(paymentContract.totalSupply()).not.to.be.reverted
    })
  })

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const buyValue = ethers.utils.parseEther("1") // Need to do this to get 1 ether in 18 decimals representation.
    let ethBalanceBefore: BigNumber
    let buyTokenGasCosts: BigNumber

    beforeEach(async () => {
      ethBalanceBefore = await accounts[1].getBalance()
      //Write Method Override: https://docs.ethers.io/v5/api/contract/contract/#:~:text=Write%20Methods%20(non%2Dconstant)
      // An override can be passed into any transaction - This is on the ethers.js lib side.
      const tx = await tokenSaleContract
        .connect(accounts[1])
        .buyToken({ value: buyValue }) // TokenSaleContract.sol `buyToken()` is a write method, so we can pass in an override object, which can be accessed inside buyToken() function with msg.value
      const txReceipt = await tx.wait()
      // To accurately calculate amount of token bought, we need to take gas into account.
      buyTokenGasCosts = calculateGasCosts(txReceipt)
    })

    it("charges the correct amount of ETH", async () => {
      const ethBalanceAfter = await accounts[1].getBalance()
      const diff = ethBalanceBefore.sub(ethBalanceAfter)
      const expectDiff = buyValue.add(buyTokenGasCosts) // Amount we bought + gas fee used in the buyToken().
      expect(diff).to.eq(expectDiff)
    })

    it("gives the correct amount of tokens", async () => {
      const tokenBalance = await paymentTokenContract.balanceOf(
        accounts[1].address
      )
      // expect(tokenBalance).to.eq(buyValue / 5) -> This throws an error because buyValue is 1 * 10 ** 18 big number. Causes operation underflow.
      const expectedBalance = buyValue.div(TEST_RATIO) // Use .div() to properly work with big number.
      expect(tokenBalance).to.eq(expectedBalance)
    })

    describe("When a user burns an ERC20 at the Shop contract", async () => {
      let ethBalanceAfter: BigNumber
      let burnTokenGasCosts: BigNumber
      let totalGasCosts: BigNumber
      beforeEach(async () => {
        const expectedBalance = buyValue.div(TEST_RATIO) // Expected ERC20 token balance based on our buyValue.
        // We need to first allow ERC20 token spent on our account, otherwise no contract can touch our token.
        const allowTx = await paymentTokenContract
          .connect(accounts[1])
          .approve(tokenSaleContract.address, expectedBalance)
        const allowTxReceipt = await allowTx.wait()
        const tokenAllowanceGasCosts = calculateGasCosts(allowTxReceipt)
        const burnTx = await tokenSaleContract
          .connect(accounts[1])
          .returnToken(expectedBalance)
        const burnTxReceipt = await burnTx.wait()
        burnTokenGasCosts = calculateGasCosts(burnTxReceipt)
        // Total gas cost from initially buying the ERC20 tokens, approving contract to spend, then buring the token.
        totalGasCosts = tokenAllowanceGasCosts
          .add(burnTokenGasCosts)
          .add(buyTokenGasCosts)
        ethBalanceAfter = await accounts[1].getBalance()
      })
      it("gives the correct amount of ETH", async () => {
        // After burning your ERC20 tokens, you should get your ETH back -minus total gas fee used.
        const ethBalanceAfterRefund = ethBalanceAfter.add(totalGasCosts)
        expect(ethBalanceAfterRefund).to.eq(ethBalanceBefore)
      })

      it("burns the correct amount of tokens", async () => {
        const balanceAfterBurn = await paymentTokenContract.balanceOf(
          accounts[1].address
        )
        expect(balanceAfterBurn).to.eq(0)
      })
    })

    describe("When a user purchase a NFT from the Shop contract", async () => {
      beforeEach(async () => {
        const allowTx = await paymentTokenContract
          .connect(accounts[1])
          .approve(tokenSaleContract.address, NFT_PRICE)
        await allowTx.wait()
        const mintTx = await tokenSaleContract.connect(accounts[1]).buyNFT(0)
        await mintTx.wait()
      })
      it("charges the correct amount of ERC20 tokens", async () => {
        throw new Error("Not implemented")
      })

      it("gives the correct nft", async () => {
        throw new Error("Not implemented")
      })

      it("updates the owner pool account correctly", async () => {
        const nftOwner = await nftContract.ownerOf(0)
        expect(nftOwner).to.eq(accounts[1].address)
      })

      it("update the public pool account correctly", async () => {
        throw new Error("Not implemented")
      })

      it("favors the public pool with the rounding", async () => {
        throw new Error("Not implemented")
      })
    })
  })

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented")
    })
    it("updates the public pool correctly", async () => {
      throw new Error("Not implemented")
    })
  })

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented")
    })

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented")
    })
  })
})
