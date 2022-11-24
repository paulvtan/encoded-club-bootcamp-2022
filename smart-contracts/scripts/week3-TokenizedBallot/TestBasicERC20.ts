import { Address } from "cluster"
import { ethers } from "hardhat"

import { BasicToken } from "../../typechain-types"
import { token } from "../../typechain-types/@openzeppelin/contracts"
import { displayTokenBalance } from "../common/Helper"

// This script test the behavior of .\contracts\week3\BasicERC20.sol
// cmd: yarn hardhat run .\scripts\week3\TestBasicERC20.ts

async function main() {
  const tokenContractFactory = await ethers.getContractFactory("BasicToken")
  const tokenContract = await tokenContractFactory.deploy()
  await tokenContract.deployed()
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
  ])
  // Display Basic Token Info
  console.log(`Contract deployed at ${tokenContract.address}`)
  console.log(`Token Information`)
  console.log({ name, symbol, decimals, totalSupply })
  // const tx = tokenContract._mint() -> It's not possible to call a mint function on BasicToken contract as _mint() ERC20 is internal. We must decalre this in the contract that inherits it.
  const accounts = await ethers.getSigners()
  displayTokenBalance(tokenContract, accounts[0].address) // BST token are minted to contract creator address which is account 0.
  displayTokenBalance(tokenContract, accounts[1].address)

  // Transfer some token from acc0 to acc1.
  const tx = await tokenContract
    .connect(accounts[0])
    .transfer(
      accounts[1].address,
      BigInt(2 * 10 ** (await tokenContract.decimals()))
    )
  await tx.wait()
  displayTokenBalance(tokenContract, accounts[0].address)
  displayTokenBalance(tokenContract, accounts[1].address)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
