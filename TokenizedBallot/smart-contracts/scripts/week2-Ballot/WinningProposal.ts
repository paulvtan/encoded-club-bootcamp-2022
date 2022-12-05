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

// This script gets the name of the proposal with the most vote.
// example: yarn run ts-node --files .\scripts\week2-Ballot\winningProposal.ts
// example: yarn run ts-node --files .\scripts\week2-Ballot\winningProposal.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Output: The winning proposal is: Mint
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress =
    process.argv[2] ?? (await getContractAddressByName("Ballot.sol"))
  console.log(`Attaching to contract: ${contractAddress}`)
  const signer = getSigner()
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  const winningProposalNo = await ballotContract.winningProposal()
  const proposal = await ballotContract.proposals(winningProposalNo)
  const proposalName = ethers.utils.parseBytes32String(proposal.name)
  console.log(`The winning proposal is: ${proposalName}`)
  const winner = await ballotContract.winnerName()
  const winnerName = ethers.utils.parseBytes32String(winner)
  console.log(
    `${winnerName} is winning the ballot with ${proposal.voteCount}! votes`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
