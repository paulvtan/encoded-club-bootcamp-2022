// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Modified and taken from Ballot.sol example: https://docs.soliditylang.org/en/v0.8.17/solidity-by-example.html
// This contract interact with our ERC20Votes.sol
interface IVoteToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IVoteToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;

    mapping(address => uint256) votingPowerSpent;

    // Much like a snapshot on Ledger airdrops, eligibility to claim ENS airdrops. The snapshot was made before big annoucement to get true state of participation.
    constructor(
        bytes32[] memory proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber // Everything after this target block number snapshot will not count towards the Ballot.sol
    ) {
        tokenContract = IVoteToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(
            votingPower(msg.sender) >= amount, // Here we check first that caller actually has more voting power than amount he's intending to vote.
            "TokenizedBallot: trying to vote more than allowed"
        );
        votingPowerSpent[msg.sender] += amount; // Increase amount of vote spent for that account. (Subtract in votingPower())
        proposals[proposal].voteCount += amount; // Increase votes count for that proposal.
    }

    // This function check a voting power of an account by getting voting count prior to targetBlockNumber snapshot minus any you've spent voted.
    function votingPower(address account) public view returns (uint256) {
        return
            tokenContract.getPastVotes(account, targetBlockNumber) -
            votingPowerSpent[account];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
