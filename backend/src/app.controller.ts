import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //--------------------------| Example |-------------------------------------

  // // Use @Query when there are multiple parameters.
  // @Get('allowance')
  // getAllowance(
  //   @Query('address') address: string,
  //   @Query('from') from: string,
  //   @Query('to') to: string,
  // ): Promise<number> {
  //   return this.appService.getAllowance(address, from, to)
  // }

  // @Get('payment-order/:id')
  // getPaymentOrder(@Param('id') id: number) {
  //   return this.appService.getPaymentOrder(id)
  // }

  // // If we need to describe a complex data type, use @Body, declare dto (Data Transfer Object) to describe the structure.
  // @Post('payment-order')
  // createPaymentOder(@Body() body: CreatePaymentOrderDto): number {
  //   return this.appService.createPaymentOrder(body.value, body.secret)
  // }

  // // Request specific payment order using a secret.
  // @Post('request-payment')
  // requestPaymentOrder(@Body() body: RequestPaymentOrderDto) {
  //   return this.appService.requestPaymentOrder(body.id, body.secret)
  // }

  //---------------------------------------------------------------------------

  @Get('hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock()
  }

  @Get('block/:hash')
  getBlock(@Param('hash') hash: string) {
    return this.appService.getBlock(hash)
  }

  @Get('total-supply')
  @ApiQuery({ name: 'address', required: false })
  getTotalSupply(@Query('address') address: string) {
    return this.appService.getTotalSupply(address)
  }

  @Get('balance/:address')
  getBalance(@Param('address') address: string): Promise<string> {
    return this.appService.getBalance(address)
  }

  // Check account voting power on a particular TokenizedBallot contract, leave blank to use default.
  @Get('check-vote-power')
  @ApiQuery({ name: 'contractAddress', required: false })
  checkVote(
    @Query('contractAddress') contractAddress: string,
    @Query('address') address: string,
  ): Promise<string> {
    return this.appService.checkVotePower(contractAddress, address)
  }

  @Get('get-proposal')
  @ApiQuery({ name: 'contractAddress', required: false })
  getProposal(
    @Query('contractAddress') contractAddress: string,
    @Query('proposalIndex') proposalIndex: number,
  ) {
    return this.appService.getProposal(contractAddress, proposalIndex)
  }

  @Get('get-winner')
  @ApiQuery({ name: 'contractAddress', required: false })
  getWinner(@Query('contractAddress') contractAddress: string) {
    return this.appService.getWinner(contractAddress)
  }

  @Post('transfer')
  @ApiQuery({ name: 'accountIndex', required: false })
  transfer(
    @Query('accountIndex') accountIndex: number,
    @Query('amount') amount: number,
    @Query('recipientAddress') recipientAddress: string,
  ) {
    return this.appService.transfer(accountIndex, recipientAddress, amount)
  }

  @Post('mint-token')
  @ApiQuery({ name: 'minterAccountIndex', required: false })
  @ApiQuery({ name: 'contractAddress', required: false })
  mintToken(
    @Query('contractAddress') contractAddress: string,
    @Query('minterAccountIndex') minterAccountIndex: number,
    @Query('receiverAddress') receiverAddress: string,
    @Query('amount') amount: number,
  ) {
    return this.appService.mintToken(
      contractAddress,
      minterAccountIndex,
      receiverAddress,
      amount,
    )
  }

  // After minting the token, run self-delegate first to give yourself voting power.
  @Post('self-delegate/:accountIndex')
  selfDelegate(@Param('accountIndex') accountIndex: number) {
    return this.appService.selfDelegate(accountIndex)
  }

  @Post('vote')
  @ApiQuery({ name: 'contractAddress', required: false })
  vote(
    @Query('contractAddress') contractAddress: string,
    @Query('proposalIndex') proposalIndex: number,
    @Query('amount') amount: number,
  ) {
    return this.appService.vote(contractAddress, proposalIndex, amount)
  }
}
