import { ethers } from "hardhat"

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  })
  const lastBlock = await provider.getBlock("latest")
  console.log(lastBlock)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
