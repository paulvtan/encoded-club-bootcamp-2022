import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

// This script performs a vote, you'd need to be eligible (voter.weight > 0)
// example: yarn run ts-node --files .\scripts\week2\Vote.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2" "2"
// This uses your default connected wallet (account 1) to vote for the proposal at index of your choosing.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2]
  const proporsalNo = process.argv[3]
  console.log(`Attaching to contract: ${contractAddress}`)

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  console.log(`Connected to the wallet of ${signer.address}`)
  console.log(`This address has a balance of ${await signer.getBalance()} wei.`)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  console.log(`Voting for proposal no. ${proporsalNo}`)
  const tx = await ballotContract.vote(proporsalNo)
  await tx.wait()
  console.log(`Success - tx hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
