import { ethers } from "ethers"
import * as dotenv from "dotenv"
dotenv.config()

/// Accept a signer and display connected account information.
export const displayAccountInfo = async (signer: ethers.Wallet) => {
  const balanceWei = await signer.getBalance()
  const balanceEth = ethers.utils.formatEther(balanceWei)
  console.log("\n")
  console.log(
    "############################## Account Information ##############################"
  )
  console.log(`Address: ${signer.address}`)
  console.log(
    `This address has a balance of ${balanceWei} wei. ${balanceEth} ETH)`
  )
  console.log(
    "#################################################################################"
  )
  console.log("\n")
  return balanceWei
}

// Returns a signer object with specified account number - i.e. 0 is default account of the wallet.
export const getSigner = (accountNo: number = 0) => {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const accountPath = `m/44'/60'/0'/0/${accountNo}`
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? "",
    accountPath
  )
  return wallet.connect(provider)
}
