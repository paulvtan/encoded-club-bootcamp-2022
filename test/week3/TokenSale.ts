import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"

import {
  MyERC721Token__factory,
  ScamToken,
  ScamToken__factory,
  TokenSale,
  TokenSale__factory,
} from "../../typechain-types"

const TEST_RATIO = 1 // 1 token for 1 ether paid.

describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[]
  let tokenSaleContract: TokenSale
  let paymentTokenContract: ScamToken
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
    // Here we deployed tokenSale contract, passing in the ERC20 contract which will be minted when user buy the token through TokenSale.sol contract.
    tokenSaleContract = await tokenSaleContractFactory.deploy(
      TEST_RATIO,
      paymentTokenContract.address
    )
    await tokenSaleContract.deployed() // or await the deploy contract transaction.
    // Since ERC20 uses role based access control, we need to grant its MINTER_ROLE to TokenSale in order for tokenSale to call ERC20's mint function.
    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE()
    const roleTx = await paymentTokenContract.grantRole(
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
    beforeEach(async () => {
      const buyValue = ethers.utils.parseEther("1") // Need to do this to get 1 ether in 18 decimals representation.
      const tx = await tokenSaleContract
        .connect(accounts[1])
        .buyToken({ value: buyValue }) // TokenSaleContract.sol `buyToken()` is payable so we can pass in an object with property value, which can be accessed inside buyToken() function with msg.value
      await tx.wait()
    })

    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented")
    })

    it("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented")
    })
  })

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented")
    })

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented")
    })
  })

  describe("When a user purchase a NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented")
    })

    it("gives the correct nft", async () => {
      throw new Error("Not implemented")
    })

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented")
    })

    it("update the public pool account correctly", async () => {
      throw new Error("Not implemented")
    })

    it("favors the public pool with the rounding", async () => {
      throw new Error("Not implemented")
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
