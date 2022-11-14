import { ethers } from "hardhat"

const MINTER_ROLE_CODE =
  "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"

async function main() {
  const accounts = await ethers.getSigners()
  // Deploy MyToken contract and mint the supply to acc0
  const tokenContractFactory = await ethers.getContractFactory("MyToken")
  const tokenContract = await tokenContractFactory.deploy()
  await tokenContract.deployed()
  console.log(`Contract deployed at ${tokenContract.address}`)
  // If you don't know what the hash is for MINTER_ROLE you can call getter like the following.
  const hashCode = await tokenContract.MINTER_ROLE()
  // Giving role MINTER to acc2
  const roleTx = await tokenContract.grantRole(
    MINTER_ROLE_CODE,
    accounts[2].address
  )
  await roleTx.wait()
  // Minting 2 tokens to account 1 using acc2 who has MINTER_ROLE
  const mintTx = await tokenContract
    .connect(accounts[2])
    .mint(accounts[1].address, 2)
  // Test transferring 1 token from account 1 to account 2
  const tx = await tokenContract
    .connect(accounts[1])
    .transfer(accounts[2].address, 1)
  await tx.wait()
  // Here we async call the token contract some common functions to gather more info
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.totalSupply(),
  ])
  // we see the totalSupply of 10000000000000000002 as we started with 10000000000000000000 then mint extra 2 tokens to account 1.
  console.log({ name, symbol, decimals, totalSupply })
  // acc0 has 10000000000000000000 as we initially minted the supply to upon contract creation.
  const acc0Balance = await tokenContract.balanceOf(accounts[0].address)
  console.log(`My Balance of Acc0 is ${acc0Balance.toString()} decimals`)
  // acc1 has 1 token as we minted 2 tokens using account 2 (MINTER role), then transfer 1 token to acc2.
  const acc1Balance = await tokenContract.balanceOf(accounts[1].address)
  console.log(`The Balance of Acc1 is ${acc1Balance.toString()} decimals.`)
  // acc2 has 1 token which was transferred from acc1.
  const acc2Balance = await tokenContract.balanceOf(accounts[2].address)
  console.log(`The Balance of Acc2 is ${acc2Balance.toString()} decimals.`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
