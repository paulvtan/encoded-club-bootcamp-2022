import { ethers } from "hardhat"

// This script simply grabs the latest blocknumber of the goerli test net.
// Usage: yarn hardhat run .\scripts\common\GetLastestBlock.ts
async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const lastBlock = await provider.getBlock("latest")
  console.log(lastBlock)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
