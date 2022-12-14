import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../../typechain-types"
import * as dotenv from "dotenv"
import { displayAccountInfo } from "../common/Helper"
dotenv.config()

// This script deploy Ballot.sol contract to Goerli test net, but instead of using pre-funded account it uses a random wallet which has no balance.
// example: yarn run ts-node --files .\scripts\week2\DeploymentNoBalance.ts "Chocolate" "Vanilla" "Mint"
// ❌ This deployment will fail as it uses a wallet with no ETH to pay for gas fee.
// It will not pass if statement check and output "Error: I'm too poor."
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {
  console.log("Deploying Ballot contract")
  console.log("Proposals: ")
  const proposals = process.argv.slice(2)
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`)
  })

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const wallet = ethers.Wallet.createRandom()
  const signer = wallet.connect(provider)
  const balance = await displayAccountInfo(signer)
  if (balance.eq(0)) throw new Error("I'm too poor.")
  // const ballotContracFactory = await ethers.getContractFactory("Ballot")
  // const ballotContractFactory = new Ballot__factory(accounts[0])
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = await ballotContractFactory.deploy(
    proposals.map((prop) => ethers.utils.formatBytes32String(prop))
  )
  await ballotContract.deployed()
  console.log(
    `The ballot smart contract was deployed at ${ballotContract.address}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
