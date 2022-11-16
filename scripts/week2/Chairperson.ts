import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
import { displayAccountInfo } from "../common/Helper"
dotenv.config()

// This script output the chairperson address of target Ballot.sol contract address.
// example: yarn run ts-node --files .\scripts\week2\Chairperson.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Output: The chairperson address is: 0xfd989feC5E85CF8487d6A558ecB98381C97B6ECF.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2]
  console.log(`Attaching to contract: ${contractAddress}`)

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  await displayAccountInfo(signer)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  const chairperson = await ballotContract.chairperson()
  console.log(`The chairperson address is: ${chairperson}.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
