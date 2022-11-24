import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  getLastBlock() {
    return ethers.getDefaultProvider('goerli').getBlock('latest')
  }
}
