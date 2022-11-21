import * as dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config()

// This script deploy TokenizedBallot.sol contract to Goerli test net.
// example: yarn run ts-node --files .\scripts\week2\Deployment.ts "Chocolate" "Vanilla" "Mint"
// This deploy a ballot with 3 proposals "Chocolate" "Vanilla" "Mint"
// Reference: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
async function main() {}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
