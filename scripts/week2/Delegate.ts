import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
import { displayAccountInfo, getSigner } from "../common/Helper"
dotenv.config()

// This script delegate your vote to the target address.
// example: yarn run ts-node --files .\scripts\week2\Delegate.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2" "0x40262E621D9250f0D04D03503145E8dB8515f796"
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2]
  const targetAddress = process.argv[3]
  console.log(`Attaching to contract: ${contractAddress}`)
  const signer = getSigner()
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  console.log(`Delegating voting right to target address: ${targetAddress}`)
  const tx = await ballotContract.delegate(targetAddress)
  await tx.wait()
  console.log(`Success - tx hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
