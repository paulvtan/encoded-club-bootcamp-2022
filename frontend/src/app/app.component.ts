import { Component } from '@angular/core'
import { ethers } from 'ethers'
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend'
  lastBlockNumber: number | undefined

  constructor() {
    ethers.providers
      .getDefaultProvider('goerli')
      .getBlock('latest')
      .then((block) => {
        this.lastBlockNumber = block.number
      })
  }
}
