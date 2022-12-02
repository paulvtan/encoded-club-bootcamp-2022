import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ethers } from 'ethers'
import VoteTokenJson from '../assets/VoteToken.json'
import { AppToastService, ToastInfo } from './AppToastService'

const API_ENDPOINT = 'http://localhost:3000'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Tokenized Ballot'
  toastService = new AppToastService()

  isRequestTokenButtonEnabled = true

  wallet: ethers.Wallet | undefined
  provider: ethers.providers.BaseProvider | undefined

  tokenSymbol: string | undefined
  etherBalance = 0
  tokenBalance = 0
  votePower = 0

  tokenContractAddress: string | undefined
  tokenContract: ethers.Contract | undefined

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli')
    this.http.get<any>(`${API_ENDPOINT}/token-address`).subscribe((ans) => {
      this.tokenContractAddress = ans.result
      console.log(`Token Contract Address: ${this.tokenContractAddress}`)

      if (this.tokenContractAddress)
        this.initializeContract(this.tokenContractAddress)
    })
  }

  private showToast(header: string, body: string, autohide: boolean) {
    this.toastService.show(header, body, autohide)
  }

  private initializeContract(contractAddress: string) {
    this.tokenContract = new ethers.Contract(
      contractAddress,
      VoteTokenJson.abi,
      this.provider,
    )
    this.http
      .get<any>(`${API_ENDPOINT}/token-symbol/${this.tokenContractAddress}`)
      .subscribe((ans) => {
        this.tokenSymbol = ans.result
      })
  }

  private updateBlockchainInfo() {
    if (!(this.tokenContract && this.wallet)) return
    console.log(`Updating blockchain state information.`)
    this.http
      .get<any>(`${API_ENDPOINT}/token-balance/${this.wallet.address}`)
      .subscribe((ans) => {
        this.tokenBalance = ans.result
        console.log(`Current Balance: ${this.tokenBalance}`)
      })
    this.http
      .get<any>(`${API_ENDPOINT}/vote-balance/${this.wallet.address}`)
      .subscribe((ans) => {
        this.votePower = ans.result
        console.log(`Current Vote Power: ${this.votePower}`)
      })
    this.isRequestTokenButtonEnabled = true
  }

  createWallet() {
    if (!(this.provider && this.tokenContract)) return
    this.wallet = ethers.Wallet.createRandom().connect(this.provider)
    this.tokenContract.connect(this.wallet)
    this.updateBlockchainInfo()
    this.tokenContract.on('Transfer', () => {
      console.log('A token transfer detected')
      this.updateBlockchainInfo()
    })
  }

  vote(voteId: string) {
    console.log(`Voting for ${voteId}`)
    this.showToast('✅ test', 'message', true)
  }

  requestToken(amount: string) {
    this.isRequestTokenButtonEnabled = false
    const toast: ToastInfo = {
      header: '⏳ Sending transaction to the blockchain...',
      body: `Requesting ${amount} ${this.tokenSymbol} token.`,
      autohide: false,
    }
    this.toastService.toasts.push(toast)
    console.log(`Requesting ${amount} token`)
    this.http
      .post<any>(`${API_ENDPOINT}/request-token`, {
        address: this.wallet?.address,
        amount: Number(amount),
      })
      .subscribe((ans) => {
        const message = `Success - Txn hash: ${ans.result}`
        console.log(message)
        this.toastService.remove(toast)
        this.toastService.show(
          `✅ Successfully minted ${amount} ${this.tokenSymbol}`,
          `Txn: ${ans.result}`,
          true,
        )
      })
  }
}
