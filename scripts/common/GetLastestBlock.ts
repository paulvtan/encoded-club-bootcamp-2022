import { ethers } from "hardhat"

// This script simply grabs the latest block of the goerli test net.
export const getLatestBlock = async () => {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const lastBlock = await provider.getBlock("latest")
  return lastBlock
}
