import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { getProvider, getSigner } from './Helper'
import * as tokenJson from './assets/VoteToken.json'
import * as dotenv from 'dotenv'
dotenv.config()

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
  paymentOrders: PaymentOrder[]

  constructor() {
    this.provider = getProvider()
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
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
  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider)
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
    const tx = await contract.mint(receiverAddress, amount)
    return tx.wait()
  }
}
