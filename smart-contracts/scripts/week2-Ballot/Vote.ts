import { sign } from "crypto"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { Ballot__factory } from "../../typechain-types"
import {
  displayAccountInfo,
  getContractAddressByName,
  getSigner,
} from "../common/Helper"

dotenv.config()

// This script performs a vote, you'd need to be eligible (voter.weight > 0)
// example: yarn run ts-node --files .\scripts\week2-Ballot\Vote.ts "0" "2"
// example: yarn run ts-node --files .\scripts\week2-Ballot\Vote.ts "0" "2" "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// This uses your default connected wallet (account 1) to vote for the proposal at index of your choosing.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const accountNumber = process.argv[2]
  const proporsalNo = process.argv[3]
  const contractAddress =
    process.argv[4] ?? (await getContractAddressByName("Ballot.sol"))
  console.log(`Attaching to contract: ${contractAddress}`)
  const signer = getSigner(Number(accountNumber))
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  console.log(`Voting for proposal no. ${proporsalNo}`)
  const tx = await ballotContract.vote(proporsalNo)
  await tx.wait()
  console.log(`Success - tx hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
