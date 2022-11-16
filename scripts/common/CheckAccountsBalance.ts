import { sign } from "crypto"
import { Signer, ethers } from "ethers"

import { displayAccountInfo, getSigner } from "./Helper"

// This script takes a number then display address and balance of each account up to the number specified (Accounts from mnemonic in .env).
// example: yarn run ts-node --files .\scripts\common\CheckAccountsBalance.ts 2
async function main() {
  const numberOfAcc = Number(process.argv[2]) - 1 ?? 0
  for (let i = 0; i <= numberOfAcc; i++) {
    console.log(`Account ${i + 1}`)
    await displayAccountInfo(getSigner(i))
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
