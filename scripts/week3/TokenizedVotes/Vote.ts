import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { TokenizedBallot__factory } from "../../../typechain-types"
import { displayAccountInfo, getSigner } from "../../common/Helper"
import { TOKENIZED_BALLOT_CONTRACT } from "./constants"

dotenv.config()

// This script spent your voting power to vote for specified proposal number.
// example: yarn run ts-node --files .\scripts\week3\TokenizedVotes\Vote.ts "2" "100"
async function main() {
  const contractAddress = TOKENIZED_BALLOT_CONTRACT
  const proporsalNo = process.argv[2]
  const amount = process.argv[3]
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")

  console.log(`Attaching to contract: ${contractAddress}`)
  const contractFactory = new TokenizedBallot__factory(signer)
  const contract = contractFactory.attach(contractAddress)
  const myVotingPower = await contract.votingPower(signer.address)
  console.log(
    `Address ${
      signer.address
    } has a voting power of ${myVotingPower.toString()}`
  )
  const proposal = await contract.proposals(proporsalNo)
  const proposalName = ethers.utils.parseBytes32String(proposal.name)
  console.log(`Voting for proposal no: ${proporsalNo} - ${proposalName}`)
  const voteTx = await contract.vote(proporsalNo, amount)
  await voteTx.wait()
  const myVotingPowerAfter = await contract.votingPower(signer.address)
  console.log(
    `Address ${
      signer.address
    } has a voting power of ${myVotingPowerAfter.toString()} left`
  )
  const winningProposal = await contract.winnerName()
  const winningProposalName = ethers.utils.parseBytes32String(winningProposal)
  console.log(`The current winning proposal is: ${winningProposalName}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
