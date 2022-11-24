import * as dotenv from "dotenv"
import { ethers } from "ethers"
import { ContractReceipt } from "ethers"

import contractAddress from "../../ContractAddress.json"
import { BasicToken } from "../../typechain-types"

dotenv.config()

interface IContractAddress {
  name: string
  address: string
}

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
    `This address has a balance of ${balanceWei} wei. (${balanceEth} ETH)`
  )
  console.log(
    "#################################################################################"
  )
  console.log("\n")
  return balanceWei
}

//This function takes in a ERC20 token contract, and a target adddress then display the account token balance.
export const displayTokenBalance = async (
  tokenContract: BasicToken,
  address: string
) => {
  const [symbol, decimals, accountBalanceDecimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.balanceOf(address),
  ])
  console.log(`\n`)
  console.log(`Account: ${address}`)
  console.log(`Has the balance of ${accountBalanceDecimals} decimals`)
  console.log(
    `Represents: ${accountBalanceDecimals.div(10 ** decimals)} $${symbol}`
  )
  console.log(`\n`)
}

export const getProvider = () => {
  const provider = ethers.getDefaultProvider(process.env.NETWORK, {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  return provider
}

// Returns a signer object with specified account number - i.e. 0 is default account of the wallet.
export const getSigner = (accountNo: number = 0) => {
  const provider = getProvider()
  const accountPath = `m/44'/60'/0'/0/${accountNo}`
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? "",
    accountPath
  )
  return wallet.connect(provider)
}

// This script simply grabs the latest block of the goerli test net.
export const getLatestBlock = async () => {
  const provider = getProvider()
  const lastBlock = await provider.getBlock("latest")
  return lastBlock
}

// Helper function for calculating a gas cost.
export const calculateGasCosts = (txReceipt: ContractReceipt) => {
  const gasUsed = txReceipt.gasUsed
  const pricePerGas = txReceipt.effectiveGasPrice
  const gasCosts = gasUsed.mul(pricePerGas)
  return gasCosts
}

export const getContractAddressByName = async (name: string) => {
  console.log("Using contract address from contractAddress.json")
  const address = contractAddress[name as keyof typeof contractAddress]
  const provider = getProvider()
  if ((await provider.getCode(address)) === "0x")
    throw new Error("No deployed contract found.")
  console.log(`\nContract: ${address} is valid. ✅\n`)
  return address
}
