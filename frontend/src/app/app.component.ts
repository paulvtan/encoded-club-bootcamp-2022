import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { BigNumber, ethers } from 'ethers'
import VoteTokenJson from '../assets/VoteToken.json'

const API_ENDPOINT = 'http://localhost:3000/'

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

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli')
    this.http.get<any>(API_ENDPOINT + 'token-address').subscribe((ans) => {
      this.tokenContractAddress = ans.result
      console.log(`Token Contract Address: ${this.tokenContractAddress}`)

      if (this.tokenContractAddress)
        this.initializeContract(this.tokenContractAddress)
    })
  }

  private initializeContract(contractAddress: string) {
    this.tokenContract = new ethers.Contract(
      contractAddress,
      VoteTokenJson.abi,
      this.provider,
    )
  }

  private updateBlockchaininfo() {
    if (!(this.tokenContract && this.wallet)) return
  }

  createWallet() {
    if (!(this.provider && this.tokenContract)) return
    this.wallet = ethers.Wallet.createRandom().connect(this.provider)
    this.tokenContract.connect(this.wallet)
    this.tokenContract['balanceOf'](this.wallet.address).then(
      (tokenBalanceBn: BigNumber) => {
        this.tokenBalance = parseFloat(ethers.utils.formatEther(tokenBalanceBn))
      },
    )
    this.tokenContract['getVotes'](this.wallet.address).then(
      (votePowerBn: BigNumber) => {
        this.votePower = parseFloat(ethers.utils.formatEther(votePowerBn))
      },
    )
    this.tokenContract.on('Transfer', () => {
      console.log('Transfer Happened!!!!')
    })
  }

  vote(voteId: string) {
    console.log(`Voting for ${voteId}`)
  }

  requestToken(amount: string) {
    console.log(`Requesting token`)
    this.http
      .post<any>(API_ENDPOINT + 'request-token', {
        address: this.wallet?.address,
        amount: Number(amount),
      })
      .subscribe((ans) => {
        console.log(ans.result)
      })
  }
}
