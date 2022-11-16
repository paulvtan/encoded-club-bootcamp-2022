import { sign } from "crypto"
import * as dotenv from "dotenv"
import { ethers } from "ethers"

import { Ballot__factory } from "../../typechain-types"
import { displayAccountInfo, getSigner } from "../common/Helper"

dotenv.config()

// This script delegate a vote from one of your wallet account to a target address.
// example: yarn run ts-node --files .\scripts\week2\Delegate.ts "0xE05986EFe30A0d48baaF10980c07f51eBAA8E603" "1" "0xB08A2ea5186b572F983cA783eFb8c4E6D2bde29e"
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2]
  const delegatorAccNo = process.argv[3]
  const delegateeAddress = process.argv[4]

  console.log(`Attaching to contract: ${contractAddress}`)
  const signer = getSigner(Number(delegatorAccNo))
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  console.log(`Delegating voting right to target address: ${delegateeAddress}`)
  const tx = await ballotContract.delegate(delegateeAddress)
  await tx.wait()
  console.log(`Success - tx hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
