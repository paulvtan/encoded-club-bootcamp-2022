import * as dotenv from "dotenv"
import { ethers } from "ethers"
import { text } from "stream/consumers"

import { VoteToken__factory } from "../../../typechain-types"
import { displayAccountInfo, getSigner } from "../../common/Helper"
import { VOTE_TOKEN_CONTRACT } from "./constants"

dotenv.config()

// This script performs a self-delegation on the ERC20 vote token to activate its voting power.
// example: yarn run ts-node --files .\scripts\week3\TokenizedVotes\SelfDelegate.ts
// This will turn total amount of tokens into voting power.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")

  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = voteTokenContractFactory.attach(VOTE_TOKEN_CONTRACT)
  console.log(
    `Attaching to a smart contract deployed at ${voteTokenContract.address}`
  )
  const tokenSymbol = await voteTokenContract.symbol()
  const tokenBalance = await voteTokenContract.balanceOf(signer.address)
  console.log(
    `Address ${signer.address} has the balance of ${tokenBalance} ${tokenSymbol}`
  )
  const targetAddressVotingPowerBefore = await voteTokenContract.getVotes(
    signer.address
  )
  console.log(
    `Address ${
      signer.address
    } currently has a voting power of ${targetAddressVotingPowerBefore.toString()}`
  )
  console.log(`Performing self-delegation.`)
  const delegateTx = await voteTokenContract.delegate(signer.address)
  await delegateTx.wait()
  const targetAddressVotingPowerAfter = await voteTokenContract.getVotes(
    signer.address
  )
  console.log(
    `Address ${
      signer.address
    } now has a voting power of ${targetAddressVotingPowerAfter.toString()}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
