import { ethers } from "ethers"

/// Accept a signer and display connected account information.
export async function displayAccountInfo(signer: ethers.Wallet) {
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
