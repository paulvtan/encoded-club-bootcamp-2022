import { ethers } from "hardhat"
import { expect } from "chai"

describe("W1 - Hello World", () => {
  it("should display all signers and their balance from ethers.js", async () => {
    const signers = await ethers.getSigners()
    signers.forEach(async (signer) => {
      console.log(`This signer has the address of ${signer.address}`)
      const balance = await signer.getBalance()
      console.log(`This signer has a balance of: ${balance}`)
    })
  })

  it("should give a Hello World message", async () => {
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld")
    const helloWorldContract = await helloWorldFactory.deploy()
    await helloWorldContract.deployed() //This returns true when the contract finished deployment.
    const helloWorldText = await helloWorldContract.helloWorld()
    expect(helloWorldText).to.eq("Hello World")
  })

  it("should set the owner as the deployer", async () => {
    const accounts = await ethers.getSigners()
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld")
    const helloWorldContract = await helloWorldFactory.deploy()
    // const helloWorldContract = await helloWorldFactory.connect(accounts[1]).deploy()
    await helloWorldContract.deployed()
    const contractOwer = await helloWorldContract.owner()
    expect(contractOwer).to.eq(accounts[0].address)
  })
})
