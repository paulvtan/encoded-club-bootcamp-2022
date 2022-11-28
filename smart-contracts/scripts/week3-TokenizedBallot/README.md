# Contract Overview

# TokenizedVotes
## `ERC20Votes.sol`
Role based access control (RBAC) implementation of ERC20 token contract. This is used in confunction with `TokenizedBallot.sol`. 

`ERC20Votes.sol` support minting, burning of tokens as well as simple access control role protecting certain functions. e.g. `MINTER_ROLE` role.

## `TokenizedBallot.sol`
This contract is a voting `Ballot.sol` contract with much upgraded functionalities. It uses `ERC20.Votes.sol` token as a currency to vote. 

Some notable new features are:
- Voter can specify amount they'd like to vote for.
- Check a voting power of a particular account.
- When a ballot is deployed, voting power (ERC20 tokens) sold after the checkpoint are not counted towards the Ballot. (Prevent vote selling). 

# How does TokenizedBallot.sol work?
`TokenizedBallot.sol` requires an ERC20 token to be used as a voting point. Pass an address of ERC20 token such as `ERC20Votes.sol` when you deploy the ballot.
1. `ERC20Votes.sol` needs to be distributed amoung participants first. 
2. Each user who received the tokens needs to call self-delegate to activate the voting power. 
3. When `TokenizedBallot.sol` gets deployed, the snapshot is taken, any new new voting power added to your account beyond the deployed block will not be included in your voting power balance (specific to that ballot). 
4. When you vote on a particular proposal, your voting balance for that contract will be spent. This however does not impact your ERC20 vote balance, token balance. Your voting power for a specific ballot contract were snapshot. 