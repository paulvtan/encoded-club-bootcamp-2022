import * as dotenv from "dotenv"
import { ethers } from "ethers"
import { text } from "stream/consumers"

import { VoteToken__factory } from "../../../typechain-types"
import {
  displayAccountInfo,
  getContractAddressByName,
  getSigner,
} from "../../common/Helper"

dotenv.config()

// This script give VoteToken to target address. This must be done prior to deploying TokenizeddBallot.sol as voting power given after snapshot does not count.
// If you've already been delegated, minting new tokens will increase your voting power by the amount of tokens.
// example: yarn run ts-node --files .\scripts\week3-TokenizedBallot\TokenizedVotes\GiveVotingPower.ts "0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF" "2"
// This mint address 0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF - 2 ETH worth of ERC20 vote token.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const targetAddress = process.argv[2] // Target address to mint the token to.
  const mintValue = ethers.utils.parseEther(process.argv[3].toString())
  const contractAddress =
    process.argv[4] ?? (await getContractAddressByName("ERC20Votes.sol"))
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")

  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = voteTokenContractFactory.attach(contractAddress)
  console.log(
    `Attaching to a smart contract deployed at ${voteTokenContract.address}`
  )
  const tokenSymbol = await voteTokenContract.symbol()
  const targetAddressBalanceBefore = await voteTokenContract.balanceOf(
    targetAddress
  )
  console.log(
    `Address ${targetAddress} before has ${targetAddressBalanceBefore} ${tokenSymbol}`
  )
  console.log(`Minting ${mintValue} ${tokenSymbol} to address ${targetAddress}`)
  const mintTx = await voteTokenContract.mint(targetAddress, mintValue)
  await mintTx.wait()
  const targetAddressBalanceAfter = await voteTokenContract.balanceOf(
    targetAddress
  )
  console.log(
    `Address ${targetAddress} after has ${targetAddressBalanceAfter} ${tokenSymbol}`
  )
  const targetAddressVotingPower = await voteTokenContract.getVotes(
    targetAddress
  )
  console.log(
    `Address ${targetAddress} has a voting power of ${targetAddressVotingPower.toString()} = ${ethers.utils.formatEther(
      targetAddressVotingPower
    )}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
