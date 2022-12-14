import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { AppService, RequestTokenDto } from './app.service'

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

  //----------------------- For initial Swagger UI experiment -----------------------------

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
      receiverAddress,
      amount,
      minterAccountIndex,
      contractAddress,
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

  // -------------------------- Used by frontend ------------------------------

  @Get('token-address')
  getTokenAddress() {
    return { result: this.appService.getTokenAddress() }
  }

  @Get('ballot-address')
  getTokenizedBallotAddress() {
    return { result: this.appService.getTokenizedBallotAddress() }
  }

  @Get('get-proposal-count')
  async getProposalCount() {
    return { result: await this.appService.getProposalCount() }
  }

  @Get('get-proposals')
  async getProposals() {
    return { result: await this.appService.getProposals() }
  }

  @Get('token-symbol/:address')
  async getTokenSymbol(
    @Param('address') address: string,
  ): Promise<{ result: string }> {
    const tokenSymbol = await this.appService.getTokenSymbol(address)
    return { result: tokenSymbol }
  }

  @Get('token-balance/:address')
  async getTokenBalance(
    @Param('address') address: string,
  ): Promise<{ result: number }> {
    const tokenBalance = await this.appService.getTokenBalance(address)
    return { result: tokenBalance }
  }

  @Get('vote-balance/:address')
  async getVoteBalance(
    @Param('address') address: string,
  ): Promise<{ result: number }> {
    const voteBalance = await this.appService.getVoteBalance(address)
    return { result: voteBalance }
  }

  // Check account voting power on a particular TokenizedBallot contract, leave blank to use default.
  @Get('check-vote-power')
  @ApiQuery({ name: 'contractAddress', required: false })
  async checkVote(
    @Query('contractAddress') contractAddress: string,
    @Query('address') address: string,
  ): Promise<{ result: string }> {
    const votePower = Number(
      await this.appService.checkVotePower(contractAddress, address),
    ).toFixed(0)
    return {
      result: votePower,
    }
  }

  @Post('request-token')
  async requestToken(
    @Body() body: RequestTokenDto,
  ): Promise<{ result: string }> {
    const txHash = await this.appService.mintToken(body.address, body.amount)
    return {
      result: txHash,
    }
  }
}
