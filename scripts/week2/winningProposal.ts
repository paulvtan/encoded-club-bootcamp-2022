import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

// This script gets the name of the proposal with the most vote.
// example: yarn run ts-node --files .\scripts\week2\winningProposal.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2"
// Output: The winning proposal is: Mint
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
  console.log(`Connected to the wallet of ${signer.address}`)
  console.log(`This address has a balance of ${await signer.getBalance()} wei.`)
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = ballotContractFactory.attach(contractAddress)
  const winningProposalNo = await ballotContract.winningProposal()
  const proposal = await ballotContract.proposals(winningProposalNo)
  const proposalName = ethers.utils.parseBytes32String(proposal.name)
  console.log(`The winning proposal is: ${proposalName}`)
  const winner = await ballotContract.winnerName()
  console.log(`${ethers.utils.parseBytes32String(winner)} is the winner!`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
