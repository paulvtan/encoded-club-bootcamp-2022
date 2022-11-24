import { sign } from "crypto"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { Ballot__factory } from "../../typechain-types"
import {
  displayAccountInfo,
  getContractAddressByName,
  getSigner,
} from "../common/Helper"
import { getVoterInfo } from "./Helper"

dotenv.config()

// This script gets information about a particular voter on this Ballot.
// example: yarn run ts-node --files .\scripts\week2-Ballot\GetVoter.ts "0x40262E621D9250f0D04D03503145E8dB8515f796"
// example: yarn run ts-node --files .\scripts\week2-Ballot\GetVoter.ts "0x40262E621D9250f0D04D03503145E8dB8515f796" "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Voting right can only be given once, subsequent attempt will fail (reverted). Deploy a new Ballot.sol if this is the case.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const targetAddress = process.argv[2] // Specify a target address to give the voting right to.
  const contractAddress =
    process.argv[3] ?? (await getContractAddressByName("Ballot.sol")) // Specify a deployed Ballot.sol contract address here or use a default.
  const signer = getSigner()
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  console.log(
    `Attaching to a smart contract deployed at ${ballotContract.address}`
  )
  getVoterInfo(ballotContract, targetAddress)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
