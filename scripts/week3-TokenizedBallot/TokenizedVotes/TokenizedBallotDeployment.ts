import * as dotenv from "dotenv"
import { ethers } from "hardhat"

import { TokenizedBallot__factory } from "../../../typechain-types"
import { getContractAddressByName, getLatestBlock } from "../../common/Helper"
import { displayAccountInfo, getSigner } from "../../common/Helper"

dotenv.config()

// This script deploy TokenizedBallot.sol contract to Goerli test net.
// example: yarn run ts-node --files .\scripts\week3\TokenizedVotes\TokenizedBallotDeployment.ts "Water" "Coffee" "Tea"
// This deploy a tokenized ballot with 3 proposals, voting power is snapshoted, only those with existing voting power can vote on this."
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html

async function main() {
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")

  // Make sure you've deployed your vote token contract first.
  const tokenContract = await getContractAddressByName("ERC20Votes.sol")
  // Snapshot current block number - Any manipulation of VoteToken after contract deployment doesn't count.
  const targetBlockNumber = (await getLatestBlock()).number + 13 // +13 so the ballot closes in one hour.
  const proposals = process.argv.slice(2)
  console.log(`Snapshot taken at the current blocknumber: ${targetBlockNumber}`)
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`)
  })

  console.log("\nDeploying TokenizedBallot contract")
  const tokenizedBallotContractFactory = new TokenizedBallot__factory(signer)
  const tokenizedBallotContract = await tokenizedBallotContractFactory.deploy(
    proposals.map((prop) => ethers.utils.formatBytes32String(prop)),
    tokenContract,
    targetBlockNumber
  )
  await tokenizedBallotContract.deployed()
  console.log(
    `The tokenized ballot smart contract was deployed at ${tokenizedBallotContract.address}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
