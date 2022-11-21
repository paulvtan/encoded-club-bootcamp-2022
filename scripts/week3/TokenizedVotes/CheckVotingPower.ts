import { constants } from "buffer"
import * as dotenv from "dotenv"

import { VoteToken__factory } from "../../../typechain-types"
import { getSigner } from "../../common/Helper"
import { VOTE_TOKEN_CONTRACT } from "./constants"

dotenv.config()

// This script check the balance of ERC20 VoteToken the target address has.
// example: yarn run ts-node --files .\scripts\week3\TokenizedVotes\CheckVotingPower.ts "0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF"
// Address 0x40262E621D9250f0D04D03503145E8dB8515f796 has 0 VTK
// This is a voting power of 0. If this is 0 you need to self-delegate first.
// Run GiveVotingPower.ts script to mint VoteToken and delegate.
async function main() {
  const targetAddress = process.argv[2]
  const signer = getSigner()
  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = voteTokenContractFactory.attach(VOTE_TOKEN_CONTRACT)
  const tokenSymbol = await voteTokenContract.symbol()
  console.log(
    `Attaching to a smart contract deployed at ${voteTokenContract.address}`
  )
  const balance = await voteTokenContract.balanceOf(targetAddress)
  const votingPower = await voteTokenContract.getVotes(targetAddress)
  console.log(`Address ${targetAddress} has ${balance} ${tokenSymbol}`)
  console.log(
    `This is a voting power of ${votingPower.toString()}. If this is 0 you need to self-delegate first.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
