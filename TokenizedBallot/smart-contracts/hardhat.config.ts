import "@nomicfoundation/hardhat-toolbox"
import "@nomiclabs/hardhat-ethers"
import { HardhatUserConfig, task } from "hardhat/config"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: false,
        runs: 1000,
      },
    },
  },
}

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

export default config
