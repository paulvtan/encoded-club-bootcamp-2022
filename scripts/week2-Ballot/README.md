# Ballot.sol

Reference: https://docs.soliditylang.org/en/v0.8.13/solidity-by-example.html

## Voting
The following contract is quite complex, but showcases a lot of Solidity’s features. It implements a voting contract. Of course, the main problems of electronic voting is how to assign voting rights to the correct persons and how to prevent manipulation. We will not solve all problems here, but at least we will show how delegated voting can be done so that vote counting is automatic and completely transparent at the same time.

The idea is to create one contract per ballot, providing a short name for each option. Then the creator of the contract who serves as chairperson will give the right to vote to each address individually.

The persons behind the addresses can then choose to either vote themselves or to delegate their vote to a person they trust.

At the end of the voting time, winningProposal() will return the proposal with the largest number of votes.

## Quick Start

1. Use `scripts\week2-Ballot\Deployment.ts` to deploy `Bollot.sol` to the blockchain.

```typescript
// deploy a Ballot with 3 proposals.
yarn run ts-node --files .\scripts\week2\DeploymentNoBalance.ts "Chocolate" "Vanilla" "Mint"
```

2. Use `Charperson.ts` script to identify who the chairperson of this ballot is, he/she can give others right to vote.

```typescript
// Output the chairperson address.
yarn run ts-node --files .\scripts\week2-Ballot\Chairperson.ts
```

3. Use `GiveRightToVote.ts` script to grant a new address voting ability (Can only be used by chairperson). The address must have not voted before, or been granted right already.   

```typescript
yarn run ts-node --files .\scripts\week2-Ballot\GiveRIghtToVote.ts "0x40262E621D9250f0D04D03503145E8dB8515f796"
```

4. Use `GetVoter.ts` script to check voter summary info, voting eligibility, status, power and which proposal the voter has voted for.

```typescript
yarn run ts-node --files .\scripts\week2-Ballot\GetVoter.ts "0x40262E621D9250f0D04D03503145E8dB8515f796"
```

5. Use `Vote.ts` script to vote for your favorite proposal. First parameter connects to account of your choosing. i.e. 0 = default account from wallet specified in `.env`. 
   - Use `yarn run ts-node --files .\scripts\week2-Ballot\Proposal.ts "0"` to check info on proposal at index 0, how many vote count it has. 

```typescript
yarn run ts-node --files .\scripts\week2-Ballot\Vote.ts "0" "2"
yarn run ts-node --files .\scripts\week2-Ballot\Proposal.ts "0"
```

6. Use `WinningProposal.ts` to see which proposal has the highest vote count.

```typescript
yarn run ts-node --files .\scripts\week2-Ballot\winningProposal.ts
```