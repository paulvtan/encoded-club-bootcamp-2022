import { sign } from "crypto"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { Ballot, Ballot__factory } from "../../typechain-types"
import {
  displayAccountInfo,
  getContractAddressByName,
  getSigner,
} from "../common/Helper"

dotenv.config()

// This script gives acc a voting right on Ballot.sol contract - Must be execute by contract owner (chairperson).
export const getVoterInfo = async (
  ballotContract: Ballot,
  voterAddress: string
) => {
  const { weight, voted, delegate, vote } = await ballotContract.voters(
    voterAddress
  )
  if (weight.eq(0)) {
    console.log(
      `Account : ${voterAddress} is not a voter, aquire voting right first from the chairman.`
    )
    return
  }
  let proposalName = "Note yet voted."
  if (voted) {
    const proposal = await ballotContract.proposals(vote)
    proposalName = ethers.utils.parseBytes32String(proposal.name)
  }
  console.log(`\nVoter Summary`)
  console.log(`Address: ${voterAddress}`)
  console.log(`Voting weight: ${weight}`)
  console.log(
    `Voting status: ${voted} : ${voted ? "Already voted" : "Has not voted"}`
  )
  console.log(`Delegated voting to?: ${delegate}`)
  console.log(`Proporsal voted for: ${vote}. ${proposalName}`)
}
