import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ethers } from 'ethers'
import VoteTokenJson from '../assets/VoteToken.json'
import { AppToastService, ToastInfo } from './AppToastService'
import { ExternalProvider } from '@ethersproject/providers'

const API_ENDPOINT = 'http://192.168.68.53:3000'

declare global {
  interface Window {
    ethereum: ExternalProvider
  }
}

export interface Proposal {
  name: string
  voteCount: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Tokenized Ballot'
  toastService = new AppToastService()
  proposals: Proposal[] | undefined

  isSendingTransaction = false

  accountAddress: string | undefined
  signer: ethers.providers.JsonRpcSigner | undefined

  tokenSymbol: string | undefined
  etherBalance = 0
  tokenBalance: number | undefined
  votePower: number | undefined

  tokenContractAddress: string | undefined
  tokenizedBallotContractAddress: string | undefined
  tokenContract: ethers.Contract | undefined

  constructor(private http: HttpClient) {
    this.http.get<any>(`${API_ENDPOINT}/token-address`).subscribe((ans) => {
      this.tokenContractAddress = ans.result
      console.log(`Token Contract Address: ${this.tokenContractAddress}`)
    })
    this.http.get<any>(`${API_ENDPOINT}/ballot-address`).subscribe((ans) => {
      this.tokenizedBallotContractAddress = ans.result
      console.log(
        `Tokenized Ballot Contract Address: ${this.tokenizedBallotContractAddress}`,
      )
    })
  }

  private showToast(header: string, body: string, autohide: boolean) {
    this.toastService.show(header, body, autohide)
  }

  private initializeContract(
    contractAddress: string,
    provider: ethers.providers.BaseProvider,
  ) {
    this.tokenContract = new ethers.Contract(
      contractAddress,
      VoteTokenJson.abi,
      provider,
    )
    this.http
      .get<any>(`${API_ENDPOINT}/token-symbol/${this.tokenContractAddress}`)
      .subscribe((ans) => {
        this.tokenSymbol = ans.result
      })
  }

  private updateBlockchainInfo() {
    if (!(this.tokenContract && this.accountAddress)) return
    console.log(`Updating blockchain state information.`)
    this.http
      .get<any>(`${API_ENDPOINT}/token-balance/${this.accountAddress}`)
      .subscribe((ans) => {
        this.tokenBalance = ans.result
        console.log(`Current Balance: ${this.tokenBalance}`)
      })
    this.http
      .get<any>(`${API_ENDPOINT}/vote-balance/${this.accountAddress}`)
      .subscribe((ans) => {
        this.votePower = ans.result
        console.log(`Current Vote Power: ${this.votePower}`)
      })
    this.isSendingTransaction = false
  }

  createWallet() {
    if (!this.tokenContractAddress) return
    const provider = ethers.providers.getDefaultProvider('goerli')
    this.initializeContract(this.tokenContractAddress, provider)
    if (!this.tokenContract) return
    const wallet = ethers.Wallet.createRandom().connect(provider)
    this.accountAddress = wallet.address
    this.tokenContract.connect(wallet)
    this.updateBlockchainInfo()
    this.tokenContract.on('Transfer', () => {
      console.log('A token transfer detected')
      this.updateBlockchainInfo()
    })
    this.getProposals()
  }

  connectWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    provider.send('eth_requestAccounts', []).then(async () => {
      const account = provider.getSigner()
      this.signer = provider.getSigner()
      this.accountAddress = await account.getAddress()
      const balance = parseFloat(
        ethers.utils.formatEther(await account.getBalance()),
      )
      this.etherBalance = Math.round(balance * 100) / 100
      if (!this.tokenContractAddress) return
      this.initializeContract(this.tokenContractAddress, provider)
      this.updateBlockchainInfo()
      if (!this.tokenContract) return
      this.tokenContract.on('Transfer', () => {
        console.log('A token transfer detected')
        this.updateBlockchainInfo()
      })
    })
    this.getProposals()
  }

  getProposals() {
    this.http.get<any>(`${API_ENDPOINT}/get-proposals`).subscribe((ans) => {
      console.log(ans.result)
      this.proposals = ans.result
    })
  }

  vote(voteId: number) {
    console.log(`Voting for ${voteId}`)
    this.showToast('✅ test', 'message', true)
  }

  mintToken(amount: string) {
    if (!this.signer) return
    this.isSendingTransaction = true
    const toast: ToastInfo = {
      header: '⏳ Sending transaction to the blockchain...',
      body: `Minting ${amount} ${this.tokenSymbol} token.`,
      autohide: false,
    }
    const amountBn = ethers.utils.parseEther(amount)
    const handleError = (error: any) => {
      this.showToast(`❌ Error`, error, false)
      this.isSendingTransaction = false
    }
    const onTxComplete = (receipt: ethers.ContractReceipt) => {
      console.log(receipt.transactionHash)
      this.toastService.remove(toast)
      this.updateBlockchainInfo()
      this.toastService.show(
        `✅ Successfully minted ${amount} ${this.tokenSymbol}`,
        `Txn: ${receipt.transactionHash}`,
        true,
      )
    }
    this.tokenContract
      ?.connect(this.signer)
      ['mint'](this.accountAddress, amountBn)
      .then((tx: ethers.ContractTransaction) => {
        console.log(tx)
        this.toastService.toasts.push(toast)
        tx.wait().then((receipt) => onTxComplete(receipt))
        return tx
      })
      .catch((error: any) => handleError(error))
  }

  requestToken(amount: string) {
    console.log(`Requesting ${amount} token`)
    this.isSendingTransaction = true
    const toast: ToastInfo = {
      header: '⏳ Sending transaction to the blockchain...',
      body: `Requesting ${amount} ${this.tokenSymbol} token.`,
      autohide: false,
    }
    this.toastService.toasts.push(toast)
    this.http
      .post<any>(`${API_ENDPOINT}/request-token`, {
        address: this.accountAddress,
        amount: Number(amount),
      })
      .subscribe((ans) => {
        const message = `Success - Txn hash: ${ans.result}`
        console.log(message)
        this.toastService.remove(toast)
        this.updateBlockchainInfo()
        this.toastService.show(
          `✅ Successfully minted ${amount} ${this.tokenSymbol}`,
          `Txn: ${ans.result}`,
          true,
        )
      })
  }

  selfDelegate() {
    if (!this.signer) return
    console.log(`Self-delegating voting power.`)
    this.isSendingTransaction = true
    const toast: ToastInfo = {
      header: '⏳ Sending transaction to the blockchain...',
      body: `Self-delegating the voting power.`,
      autohide: false,
    }
    const handleError = (error: any) => {
      this.showToast(`❌ Error`, error, false)
      this.isSendingTransaction = false
    }
    const onTxComplete = (receipt: ethers.ContractReceipt) => {
      console.log(receipt.transactionHash)
      this.toastService.remove(toast)
      this.updateBlockchainInfo()
      this.toastService.show(
        `✅ Successfully self-delegated voting power.`,
        `Txn: ${receipt.transactionHash}`,
        true,
      )
    }
    this.tokenContract
      ?.connect(this.signer)
      ['delegate'](this.accountAddress)
      .then((tx: ethers.ContractTransaction) => {
        this.toastService.toasts.push(toast)
        console.log(tx)
        tx.wait().then((receipt) => onTxComplete(receipt))
        return tx
      })
      .catch((error: any) => handleError(error))
  }
}
