# Solidity Bootcamp (Oct 2022) & ETHDenver Bootcamp (Late)

This repository contains all the code I developed during the study of ETHDenver & Solidity bootcamps.

Powered by Encode Club
A free, intensive, 8-week coding bootcamp
to learn Solidity and blockchain from scratch!

[ETHDenver Bootcamp 2022 by Encoded Club](https://medium.com/encode-club/announcing-the-ethdenver-bootcamp-powered-by-encode-club-apply-now-a2fb1863bafb)

[Solidyt Bootcamp 2022 by Encoded Club](https://www.encode.club/solidity-bootcamps)

# Content
- Introduction
- Building HelloWorld.sol in Remix
- Syntax and structure
- Interfaces and external calls
- Weekend Project 1
- Vscode setup and code quality
- Building unit tests for HelloWorld.sol
- Coding Ballot.sol
- Scripts for Ballot.sol and events
- Weekend Project 2
- MyERC20.sol and MyERC721.sol
- TokenSale.sol
- Tests and scripts for TokenSale.sol
- Tokenized Votes
- Weekend Project 3
- NodeJS API using NestJS framework
- Minting tokens in the backend
- Frontend
- Integration
- Weekend Project 4
- Sponsor Week
- Introduction to gas optimization and smart contract security
- Gas limit and loops
- Randomness
- Lottery
- Weekend Project 5
- Part 1: Blockchain scaling solutions
- Part 2: Solidity advanced content
- DeFi
- Upgradeability patterns
- Part 1: IPFS
- Part 2: Smart Contract Security
- Team Projects

# Quick Start Guide

```
yarn: 3.2.4
node: v18.12.1
```
**yarn package manager is required.*

The scripts in this reposoritory relies on the following API keys 
- `ALCHEMY_API_KEY`
- `ETHERSCAN_API_KEY`
- `INFURA_API_KEY`.
1. Create your own `.env` and populate them with corresponding keys.

```typescript
// sample .env file at root
MNEMONIC=""
NETWORK=""
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
Contains solidity `.sol` contract, compiled into bytecode and deployed to goerli test net using `Deployment.ts` script.

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





