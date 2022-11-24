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

// This script takes an index and return the proposal from a Ballot contract at that index.
// example: yarn run ts-node --files .\scripts\week2-Ballot\Proposal.ts "0" <address: string>
// example: yarn run ts-node --files .\scripts\week2-Ballot\Proposal.ts "0"
// example: yarn run ts-node --files .\scripts\week2-Ballot\Proposal.ts "0" "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Output: You have chosen proposal 0, which is Chocolate.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const selectedProposalNo = process.argv[2]
  const contractAddress =
    process.argv[3] ?? (await getContractAddressByName("Ballot.sol"))
  const signer = getSigner()
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  console.log(`Attaching to contract: ${contractAddress}`)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  const proposal = await ballotContract.proposals(selectedProposalNo)
  const proposalName = ethers.utils.parseBytes32String(proposal.name)
  console.log(
    `You have chosen proposal ${selectedProposalNo}, which is ${proposalName}.`
  )
  console.log(`It currently has a vote count of: ${proposal.voteCount}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
