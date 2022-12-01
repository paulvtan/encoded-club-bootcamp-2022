import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { getProvider, getSigner } from './Helper'
import * as tokenJson from './assets/VoteToken.json'
import * as tokenizedBallotJson from './assets/TokenizedBallot.json'

export class CreatePaymentOrderDto {
  value: number
  secret: string
}

export class RequestPaymentOrderDto {
  id: number
  secret: string
}

export class PaymentOrder {
  value: number
  id: number
  secret: string
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider
  erc20ContractFactory: ethers.ContractFactory
  erc20Contract: ethers.Contract
  tokenizedBallotContractFactory: ethers.ContractFactory
  paymentOrders: PaymentOrder[]

  constructor() {
    this.provider = getProvider()
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    )

    this.tokenizedBallotContractFactory = new ethers.ContractFactory(
      tokenizedBallotJson.abi,
      tokenizedBallotJson.bytecode,
    )

    this.erc20Contract = this.erc20ContractFactory.attach(
      process.env.ERC20_VOTE_SOL,
    )

    this.paymentOrders = []
  }

  getHello(): string {
    return 'Hello World!'
  }

  getLastBlock() {
    return this.provider.getBlock('latest')
  }

  getBlock(hash = 'latest'): Promise<ethers.providers.Block> {
    return this.provider.getBlock(hash)
  }

  // Get the current total minted supply of an ERC20 token.
  async getTotalSupply(
    contractAddress = process.env.ERC20_VOTE_SOL,
  ): Promise<number> {
    console.log(`Token contract: ${contractAddress}`)
    const signer = getSigner()
    const contractInstance = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(signer)
    const getTotalSupply = await contractInstance.totalSupply()
    return parseFloat(ethers.utils.formatEther(getTotalSupply))
  }

  async getAllowance(
    contractAddress: string,
    from: string,
    to: string,
  ): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(this.provider)
    const allowance = await contractInstance.allowance(from, to)
    return parseFloat(ethers.utils.formatEther(allowance))
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id]
    return { value: paymentOrder.value, id: paymentOrder.id }
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder()
    newPaymentOrder.value = value
    newPaymentOrder.secret = secret
    newPaymentOrder.id = this.paymentOrders.length
    this.paymentOrders.push(newPaymentOrder)
    return newPaymentOrder.id
  }

  requestPaymentOrder(id: number, secret: string) {
    const paymentOrder = this.paymentOrders[id]
    if (secret != paymentOrder.secret) throw new Error('WRONG SECRET')
    return paymentOrder
  }

  async mintToken(
    contractAddress = process.env.ERC20_VOTE_SOL,
    minterAccountIndex = 0,
    receiverAddress: string,
    amount: number,
  ) {
    const signer = getSigner(minterAccountIndex)
    const contract = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(signer)
    const amountBn = ethers.utils.parseEther(amount.toString())
    const tx = await contract.mint(receiverAddress, amountBn)
    return tx.wait()
  }

  async getBalance(address: string) {
    const contractAddress = process.env.ERC20_VOTE_SOL
    const signer = getSigner()
    const contract = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(signer)
    const symbol = await contract.symbol()
    const balanceBn = await contract.balanceOf(address)
    const balance = Number(ethers.utils.formatEther(balanceBn))
    const voteBn = await contract.getVotes(address)
    const vote = Number(ethers.utils.formatEther(voteBn))
    return `Balance: ${balance} ${symbol}\nRemaining Vote: ${vote}.`
  }

  async selfDelegate(accountIndex: number) {
    const contractAddress = process.env.ERC20_VOTE_SOL
    const signer = getSigner(accountIndex)
    const contract = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(signer)
    const tx = await contract.delegate(signer.address)
    return tx.wait()
  }

  async transfer(accountIndex = 0, recipientAddress: string, amount: number) {
    const contractAddress = process.env.ERC20_VOTE_SOL
    const signer = getSigner(accountIndex)
    const contract = this.erc20ContractFactory
      .attach(contractAddress)
      .connect(signer)
    const tx = await contract.transfer(
      recipientAddress,
      ethers.utils.parseEther(amount.toString()),
    )
    return tx.wait()
  }

  async checkVotePower(
    contractAddress = process.env.TOKENIZED_BALLOT_SOL,
    address: string,
  ) {
    const signer = getSigner()
    console.log(`Using tokenized ballot contract: ${contractAddress}`)
    const contract = this.tokenizedBallotContractFactory
      .attach(contractAddress)
      .connect(signer)
    const votingPower = await contract.votingPower(address)
    return ethers.utils.formatEther(votingPower)
  }

  async getProposal(
    contractAddress = process.env.TOKENIZED_BALLOT_SOL,
    proposalIndex: number,
  ) {
    const signer = getSigner()
    console.log(`Using tokenized ballot contract: ${contractAddress}`)
    const contract = this.tokenizedBallotContractFactory
      .attach(contractAddress)
      .connect(signer)
    const { name, voteCount } = await contract.proposals(proposalIndex)
    const nameFormatted = ethers.utils.parseBytes32String(name)
    const voteCountFormatted = ethers.utils.formatEther(voteCount)
    return `Name: ${nameFormatted}\nVote: ${voteCountFormatted}`
  }

  async getWinner(contractAddress = process.env.TOKENIZED_BALLOT_SOL) {
    const signer = getSigner()
    console.log(`Using tokenized ballot contract: ${contractAddress}`)
    const contract = this.tokenizedBallotContractFactory
      .attach(contractAddress)
      .connect(signer)
    const winningPropsalName = await contract.winnerName()
    return ethers.utils.parseBytes32String(winningPropsalName)
  }

  async vote(
    contractAddress = process.env.TOKENIZED_BALLOT_SOL,
    proposalIndex: number,
    amount: number,
  ) {
    const signer = getSigner()
    console.log(`Using tokenized ballot contract: ${contractAddress}`)
    const contract = this.tokenizedBallotContractFactory
      .attach(contractAddress)
      .connect(signer)
    const amountBn = ethers.utils.parseEther(amount.toString())
    const tx = await contract.vote(proposalIndex, amountBn)
    return tx.wait()
  }
}
