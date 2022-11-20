import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"

import { BasicToken } from "../../typechain-types"

describe("Basic tests for understanding ERC20", async () => {
  let MyERC20Contract: BasicToken
  let accounts: SignerWithAddress[]

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    const MyERC20ContractFactory = await ethers.getContractFactory("BasicToken")
    MyERC20Contract = await MyERC20ContractFactory.deploy()
    await MyERC20Contract.deployed()
  })

  it("should have 10 total supply at deployment", async () => {
    const totalSupplyBN = await MyERC20Contract.totalSupply()
    const decimals = await MyERC20Contract.decimals()
    const totalSupply = parseFloat(
      ethers.utils.formatUnits(totalSupplyBN, decimals)
    )
    expect(totalSupply).to.eq(10)
  })

  it("triggers the Transfer event with the address of the sender when sending transactions", async () => {
    const senderAddress = accounts[0].address
    const receiverAddress = accounts[1].address
    await expect(MyERC20Contract.transfer(receiverAddress, 1))
      .to.emit(MyERC20Contract, "Transfer")
      .withArgs(senderAddress, receiverAddress, 1)
  })
})
