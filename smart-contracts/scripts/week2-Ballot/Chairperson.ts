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

// This script output the chairperson address of target Ballot.sol contract address.
// example: yarn run ts-node --files .\scripts\week2-Ballot\Chairperson.ts <address: string>
// example: yarn run ts-node --files .\scripts\week2-Ballot\Chairperson.ts
// example: yarn run ts-node --files .\scripts\week2-Ballot\Chairperson.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Sample output: The chairperson address is: 0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress =
    process.argv[2] ?? (await getContractAddressByName("Ballot.sol"))
  const signer = getSigner()
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  console.log(`Attaching to contract: ${contractAddress}`)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  const chairperson = await ballotContract.chairperson()
  console.log(`The chairperson address is: ${chairperson}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
