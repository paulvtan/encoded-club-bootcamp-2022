import { Component } from '@angular/core'
import { BigNumber, ethers } from 'ethers'
import VoteTokenJson from '../assets/VoteToken.json'

const ERC20VOTES_TOKEN_ADDRESS = '0x111725C04643306563ed5f906aF0Ac6790898495'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  wallet: ethers.Wallet | undefined
  provider: ethers.providers.BaseProvider | undefined

  etherBalance = 0
  tokenBalance = 0
  votePower = 0

  tokenContractAddress: string | undefined
  tokenContract: ethers.Contract | undefined

  constructor() {}

  createWallet() {
    this.provider = ethers.providers.getDefaultProvider('goerli')
    this.wallet = ethers.Wallet.createRandom().connect(this.provider)
    if (this.tokenContractAddress) {
      this.tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        VoteTokenJson.abi,
        this.wallet,
      )

      this.wallet.getBalance().then((balanceBn) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn))
      })
      this.tokenContract['balanceOf'](this.wallet.address).then(
        (tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn),
          )
        },
      )
      this.tokenContract['getVotes'](this.wallet.address).then(
        (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn))
        },
      )
    }
  }

  vote(voteId: string) {
    console.log(`Voting for ${voteId}`)
  }

  request() {
    console.log(`Requesting token`)
    return true
  }
}
