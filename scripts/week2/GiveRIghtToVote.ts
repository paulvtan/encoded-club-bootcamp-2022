import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

// This script gives acc a voting right on Ballot.sol contract - Must be execute by contract owner (chairperson).
// Ballot.sol (Goerli test net): 0xE05986EFe30A0d48baaF10980c07f51eBAA8E603
// example: yarn run ts-node --files .\scripts\week2\GiveRIghtToVote.ts "0x566cBd6F83CF34539B8F2b67C03F7432085c5D9B" "0x40262E621D9250f0D04D03503145E8dB8515f796"
// Voting right can only be given once, subsequent attempt will fail (reverted). Deploy a new Ballot.sol if this is the case.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2] // Specify a deployed Ballot.sol contract address here.
  const targetAddress = process.argv[3] // Specify a target address to give the voting right to.
  console.log(`Giving voting right to ${targetAddress}`)
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  console.log(`This address has a balance of ${balance} wei.`)
  if (balance.eq(0)) throw new Error("I'm too poor.")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = await ballotContractFactory.attach(contractAddress)
  console.log(
    `Attaching to a smart contract deployed at ${ballotContract.address}`
  )
  const tx = await ballotContract.giveRightToVote(targetAddress)
  await tx.wait()
  console.log("Done!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
