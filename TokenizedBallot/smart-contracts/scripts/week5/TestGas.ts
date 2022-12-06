import { ethers } from "hardhat"

import config from "../../hardhat.config"
import { Gas } from "../../typechain-types"

const TEST_VALUE = 1000

// Set `optimizer` to false / true in hardhat.config.ts and run this script to compare what gas optimization can do for us.
async function compareDeploy() {
  const userSettings = config?.solidity as any
  console.log(
    `Using ${userSettings.settings?.optimizer.runs} runs optimization`
  )
  const gasContractFactory = await ethers.getContractFactory("Gas")
  let contract: Gas = await gasContractFactory.deploy()
  contract = await contract.deployed()
  const deployTxReceipt = await contract.deployTransaction.wait()
  console.log(`Used ${deployTxReceipt.gasUsed} gas units in deployment`)
  const testTx = await contract.loopActions(TEST_VALUE)
  const testTxReceipt = await testTx.wait()
  console.log(`Used ${testTxReceipt.gasUsed} gas units in test function`)
}

const TEST2_VALUE = 1000

// Reduce number of read / write operation to state
async function compareLocations() {
  const gasContractFactory = await ethers.getContractFactory("Gas")
  let contract: Gas = await gasContractFactory.deploy()
  contract = await contract.deployed()
  const testTx1 = await contract.updateNumber(TEST2_VALUE)
  const testTx1Receipt = await testTx1.wait()
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in storage and local reads test function`
  )
  const testTx2 = await contract.updateNumberOptimized(TEST2_VALUE)
  const testTx2Receipt = await testTx2.wait()
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized state and local reads test function`
  )
}

// Order of variable in the struct, is order of packing. Ordering struct variables can reduce storage slot it occupies.
async function comparePacking() {
  const gasContractFactory = await ethers.getContractFactory("Gas")
  let contract: Gas = (await gasContractFactory.deploy()) as Gas
  contract = await contract.deployed()
  const testTx1 = await contract.createUnpacked()
  const testTx1Receipt = await testTx1.wait()
  console.log(
    `Used ${testTx1Receipt.gasUsed} gas units in struct packing test function`
  )
  const testTx2 = await contract.createPacked()
  const testTx2Receipt = await testTx2.wait()
  console.log(
    `Used ${testTx2Receipt.gasUsed} gas units in optimized struct packing test function`
  )
}

compareDeploy().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
