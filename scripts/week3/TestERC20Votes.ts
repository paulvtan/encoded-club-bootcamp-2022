import { ethers } from "hardhat"

import { VoteToken__factory } from "../../typechain-types"

const MINT_VALUE = ethers.utils.parseEther("10")

// This interacts with ERC20Votes.sol contract which demonstrate the power of ERC20Votes - Tokenized Vote.
// cmd: yarn hardhat run .\scripts\week3\ERC20Votes.ts

async function main() {
  const accounts = await ethers.getSigners()
  // Deploy the contract at virtual machine blockchain.
  const contractFactory = new VoteToken__factory(accounts[0])
  const contract = await contractFactory.deploy()
  await contract.deployed()
  console.log(`Token contract deployed at ${contract.address}`)

  // Mint some tokens and check thier voting power.
  console.log(`Minting ${MINT_VALUE} token.`)
  const mintTx = await contract.mint(accounts[1].address, MINT_VALUE)
  await mintTx.wait()
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      accounts[1].address
    }`
  )
  const balanceBN = await contract.balanceOf(accounts[1].address)
  console.log(
    `Account ${
      accounts[1].address
    } has ${balanceBN.toString()} decimal units of MyToken`
  )
  console.log("\n")

  // Check the voting power - Account 1 will have 0 voting power, by default token balance does not account for voting power.
  // You'll need to delegate and activate checkpoint for voting power to count.
  // Reference: https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes:~:text=and%20getPastVotes.-,By%20default%2C%20token%20balance%20does%20not%20account%20for%20voting%20power.%20This%20makes%20transfers%20cheaper.%20The%20downside%20is%20that%20it%20requires%20users%20to%20delegate%20to%20themselves%20in%20order%20to%20activate%20checkpoints%20and%20have%20their%20voting%20power%20tracked.,-Available%20since%20v4.2
  console.log("Self-deleting the vote using getVotes()")
  const votes = await contract.getVotes(accounts[1].address)
  console.log(
    `Account ${
      accounts[1].address
    } has ${votes.toString()} units of voting power before selft delegating.`
  )
  // Self delegate - (delegate is built into the token contract rather than Ballot contract)
  const delegateTx = await contract
    .connect(accounts[1])
    .delegate(accounts[1].address)
  await delegateTx.wait()
  // Check the voting power again.
  const votesAfter = await contract.getVotes(accounts[1].address)
  console.log(
    `Account ${
      accounts[1].address
    } has ${votesAfter.toString()} units of voting power after self delegating`
  )
  console.log("\n")

  // Transfer tokens - Account 1 sold tokens to account 2. Selling half of the minted value.
  const TransferTx = await contract
    .connect(accounts[1])
    .transfer(accounts[2].address, MINT_VALUE.div(2))
  await TransferTx.wait()
  // Check the voting power - Account 1 will now have half what he had before.
  const votes1AfterTransfer = await contract.getVotes(accounts[1].address)
  console.log(
    `Account 1: ${
      accounts[1].address
    } has ${votes1AfterTransfer.toString()} units of voting power after self delegating`
  )
  // The account 2 - Receive the token however
  const votes2AfterTransfer = await contract.getVotes(accounts[2].address)
  console.log(
    `Account 2: ${
      accounts[2].address
    } has ${votes2AfterTransfer.toString()} units of voting power after receiving from ${
      accounts[1].address
    }`
  )
  // Self delegate to activate
  const acc2DelegateTx = await contract
    .connect(accounts[2])
    .delegate(accounts[2].address)
  await acc2DelegateTx.wait()
  const votes2AfterSelfDelegate = await contract.getVotes(accounts[2].address)
  console.log(
    `Account 2: ${
      accounts[2].address
    } has ${votes2AfterSelfDelegate.toString()} units of voting power after self delegating`
  )
  console.log("\n")

  // Check past voting power by specifying past block number.
  const lastBlock = await ethers.provider.getBlock("latest")
  console.log(`Current block number is ${lastBlock.number}`)
  const pastVotes = await contract.getPastVotes(
    accounts[1].address,
    lastBlock.number - 2
  )
  console.log(
    `Account 1: ${
      accounts[1].address
    } had ${pastVotes.toString()} units of voting power at previous block.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
