import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
import { displayAccountInfo } from "../common/Helper"
dotenv.config()

// This script takes an index and return the proposal from a Ballot contract at that index.
// example: yarn run ts-node --files .\scripts\week2\Proposal.ts "0xaAC3C56101cbb1D2Be1492599Fa8dbc515d12CB2" "0"
// Output: You have chosen proposal 0, which is Chocolate.
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  const contractAddress = process.argv[2]
  const selectedProposalNo = process.argv[3]
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
  const proposal = await ballotContract.proposals(selectedProposalNo)
  const proposalName = ethers.utils.parseBytes32String(proposal.name)
  console.log(
    `You have chosen proposal ${selectedProposalNo}, which is ${proposalName}.`
  )
  console.log(`It currently has a vote count of: ${proposal.voteCount}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
