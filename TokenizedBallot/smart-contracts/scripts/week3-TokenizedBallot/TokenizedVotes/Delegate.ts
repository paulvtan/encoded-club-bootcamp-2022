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

// This script uses the default acc (assume it's the contract deployer) and perform a delegate on the target address to activate its voting power (ERC20).
// If you perform on yourself, you will get voting power based on amount of vote token you have. If you delete your voting power to someone else, you will lose yours. You will have to run delegate again on yourself to gain it back.
// example: yarn run ts-node --files .\scripts\week3-TokenizedBallot\TokenizedVotes\Delegate.ts
// yarn run ts-node --files .\scripts\week3-TokenizedBallot\TokenizedVotes\Delegate.ts 0 "0x40262E621D9250f0D04D03503145E8dB8515f796"
// This will turn total amount of tokens into voting power for default account "0xB08A2ea5186b572F983cA783eFb8c4E6D2bde29e".
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const accountNum = process.argv[2] ?? 0
  const signer = getSigner(Number(accountNum))
  const targetAddress = process.argv[3] ?? signer.address
  const contractAddress =
    process.argv[4] ?? (await getContractAddressByName("ERC20Votes.sol"))
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")

  const voteTokenContractFactory = new VoteToken__factory(signer)
  const voteTokenContract = voteTokenContractFactory.attach(contractAddress)
  console.log(
    `Attaching to a smart contract deployed at ${voteTokenContract.address}`
  )
  const tokenSymbol = await voteTokenContract.symbol()
  const tokenBalance = await voteTokenContract.balanceOf(targetAddress)
  console.log(
    `Address ${targetAddress} has the balance of ${tokenBalance} ${tokenSymbol}`
  )
  const targetAddressVotingPowerBefore = await voteTokenContract.getVotes(
    targetAddress
  )
  console.log(
    `Address ${targetAddress} currently has a voting power of ${targetAddressVotingPowerBefore.toString()} = ${ethers.utils.formatEther(
      targetAddressVotingPowerBefore
    )}`
  )
  console.log(`Activating ${targetAddress} voting power (delegation)`)
  const delegateTx = await voteTokenContract.delegate(targetAddress)
  await delegateTx.wait()
  const targetAddressVotingPowerAfter = await voteTokenContract.getVotes(
    targetAddress
  )
  console.log(
    `Address ${targetAddress} now has a voting power of ${targetAddressVotingPowerAfter.toString()} = ${ethers.utils.formatEther(
      targetAddressVotingPowerAfter
    )}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
