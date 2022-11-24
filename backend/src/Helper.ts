import { ethers } from 'ethers'

export const getProvider = () => {
  const provider = ethers.getDefaultProvider(process.env.NETWORK, {
    etherscan: process.env.ETHERSCAN_API_KEY,
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  // const provider = ethers.getDefaultProvider("goerli")
  return provider
}

// Returns a signer object with specified account number - i.e. 0 is default account of the wallet.
export const getSigner = (accountNo = 0) => {
  const provider = getProvider()
  const accountPath = `m/44'/60'/0'/0/${accountNo}`
  const wallet = ethers.Wallet.fromMnemonic(
    process.env.MNEMONIC ?? '',
    accountPath,
  )
  return wallet.connect(provider)
}
