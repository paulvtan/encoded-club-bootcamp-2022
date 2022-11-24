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


