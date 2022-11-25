import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import {
  AppService,
  CreatePaymentOrderDto,
  RequestPaymentOrderDto,
} from './app.service'

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

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string) {
    return this.appService.getTotalSupply(address)
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
}
