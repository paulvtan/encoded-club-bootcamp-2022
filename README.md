# ETHDenver Bootcamp (Late 2022),

This repository contains all the code I developed during the study of ETHDenver & Solidity bootcamps.

Powered by Encode Club
A free, intensive, 8-week coding bootcamp
to learn Solidity and blockchain from scratch!

[ETHDenver Bootcamp 2022 by Encoded Club](https://medium.com/encode-club/announcing-the-ethdenver-bootcamp-powered-by-encode-club-apply-now-a2fb1863bafb)

[ETHDenver Bootcamp 2022 - Notion site](https://encodeclub.notion.site/ETHDenver-Bootcamp-e895531f5e4540278ab4bde62e1aac0a)

# Quick Start Guide
The scripts in this reposoritory relies on the following API keys 
- `ALCHEMY_API_KEY`
- `ETHERSCAN_API_KEY`
- `INFURA_API_KEY`.
1. Create your own `.env` and populate them with corresponding keys.

```typescript
// sample .env file at root
MNEMONIC=""
INFURA_API_KEY=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""
```

2. `yarn install` to restore all package dependency.

3. `yarn hardhat compile` to compile solidity contract, create artifacts and typings. 

## Extensions
Following extensions are reccomended for working with this project.

1. [hardhat](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)
2. [mocha test explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)
3. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# High-level Project Structure
## `contract` 
Contains solidity `.sol` contract, compiled into bytecode and deployed to goerli test net using `Deployment.ts script`

## `script`
Contains scripts to automate contract deployment to blockchain, interact with the deployed contract. Written in TypeScript. 

## `test`
Contains unit test suite. Used to test the logic of smart contract. Use mocha and chai js.

# Running Scripts
Scripts are used to automate the contract deployment as well as interacting with the deployed blockchain (e.g. calling functions on the contract).

## Without parameters
```ts
yarn hardhat run .\scripts\common\GetLastestBlock.ts
```
## With parameters
This deploy a ballot with 3 proposals "Chocolate" "Vanilla" "Mint"

```ts
yarn run ts-node --files .\scripts\week2\Deployment.ts "Chocolate" "Vanilla" "Mint"
```





