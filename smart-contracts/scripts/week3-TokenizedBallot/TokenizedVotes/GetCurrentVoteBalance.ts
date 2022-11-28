import { constants } from "buffer"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { VoteToken__factory } from "../../../typechain-types"
import { getContractAddressByName, getSigner } from "../../common/Helper"

dotenv.config()

// This script check the current votes balance for `account` (balance of ERC20 VoteToken the target address has). This is not in conjunction with the TokenizedBallot.sol but a raw ERC20 token amount.
// example: yarn run ts-node --files .\scripts\week3-TokenizedBallot\TokenizedVotes\GetCurrentVoteBalance.ts "0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF"
// Address 0x40262E621D9250f0D04D03503145E8dB8515f796 has 0 VTK
// This is a voting power of 0. If this is 0 you need to self-delegate first.
// Run GiveVotingPower.ts script to mint VoteToken and delegate.
async function main() {
  const targetAddress = process.argv[2]
  const signer = getSigner()
  const contractAddress = await getContractAddressByName("ERC20Votes.sol")
  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = voteTokenContractFactory.attach(contractAddress)
  const tokenSymbol = await voteTokenContract.symbol()
  console.log(
    `Attaching to a smart contract deployed at ${voteTokenContract.address}`
  )
  const balance = await voteTokenContract.balanceOf(targetAddress)
  const tokenAmount = await voteTokenContract.getVotes(targetAddress)
  const votingPower = ethers.utils.formatEther(tokenAmount) // Reduced to a small number.
  console.log(`Address ${targetAddress} has ${balance} ${tokenSymbol}`)
  console.log(
    `This is a voting power of ${votingPower.toString()} . If this is 0 you need to self-delegate first.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
