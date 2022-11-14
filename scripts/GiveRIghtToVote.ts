import { sign } from "crypto"
import { ethers } from "ethers"
import { Ballot__factory } from "../typechain-types"
import * as dotenv from "dotenv"
dotenv.config()

async function main() {
  // Ballot.sol (Goerli test net): 0xE05986EFe30A0d48baaF10980c07f51eBAA8E603
  const contractAddress = process.argv[2] // Specify a deployed Ballot.sol contract address here.
  const targetAddress = process.argv[3] // Specify a target address to give the voting right to.
  console.log(`Giving voting right to ${targetAddress}`)
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  })
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "")
  const signer = wallet.connect(provider)
  const balance = await signer.getBalance()
  console.log(`This address has a balance of ${balance} wei.`)
  if (balance.eq(0)) throw new Error("I'm too poor.")
  const ballotContractFactory = new Ballot__factory(signer)
  const ballotContract = await ballotContractFactory.attach(contractAddress)
  console.log(
    `Attaching to a smart contract deployed at ${ballotContract.address}`
  )
  const tx = await ballotContract.giveRightToVote(targetAddress)
  await tx.wait()
  console.log("Done!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
