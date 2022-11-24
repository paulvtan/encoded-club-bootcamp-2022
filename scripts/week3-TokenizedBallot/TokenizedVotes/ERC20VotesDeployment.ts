import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { VoteToken__factory } from "../../../typechain-types"
import { displayAccountInfo, getSigner } from "../../common/Helper"

dotenv.config()

// This script deploy ERC20Votes.sol contract to Goerli test net.
// example: yarn hardhat run .\scripts\week3\TokenizedVotes\ERC20VotesDeployment.ts
// This deploy the VoteToken ERC20 contract and granted deployer ADMIN and MINTER roles.
// 21-11-2022: VoteToken.sol deployed at: 0x111725C04643306563ed5f906aF0Ac6790898495
async function main() {
  console.log("Deploying ERC20Votes.sol contract.")
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = await voteTokenContractFactory.deploy()
  await voteTokenContract.deployed()
  console.log(
    `VoteToken ERC20 contract was deployed at ${voteTokenContract.address}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
