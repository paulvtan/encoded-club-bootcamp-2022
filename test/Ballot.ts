import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Ballot } from "../typechain-types"

const PROPOSALS = ["Chocolate", "Vanilla", "Lemon", "Cookie"]

describe("Ballot", () => {
  let ballotContract: Ballot
  let accounts: SignerWithAddress[]
  beforeEach(async () => {
    accounts = await ethers.getSigners()
    const ballotContractFactory = await ethers.getContractFactory("Ballot") //To deploy Ballot.sol we need a contract factory.
    ballotContract = (await ballotContractFactory.deploy(
      PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop))
    )) as Ballot
    await ballotContract.deployed()
  })
  describe("when the contract is deployed", () => {
    it("has the provided proposals", async () => {
      const arrayMemberPos0 = await ballotContract.proposals(0)
      console.log({ arrayMemberPos0 })
      console.log(arrayMemberPos0)
    })
    it("sets the deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson()
      expect(chairperson).to.eq(accounts[0].address)
    })
    it("sets the voting weight for the chairperson as 1", async () => {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address)
      expect(chairpersonVoter.weight).to.eq(1)
    })
  })

  describe("when the chairperson interacts with the giveRightToVote function in the contract", () => {
    beforeEach(async () => {
      const selectedVoter = accounts[1].address
      const acc1Voter = await ballotContract.voters(accounts[1].address)
      console.log({ acc1Voter })
      const tx = await ballotContract.giveRightToVote(selectedVoter)
      await tx.wait()
    })
    it("gives right to vote for another address", async () => {
      const acc1Voter = await ballotContract.voters(accounts[1].address)
      expect(acc1Voter.weight).to.eq(1)
    })
    it("can not give right to vote for someone that has voted", async () => {
      // TODO
    })
    it("can not give right to vote for someone that already has voting rights", async () => {
      // TODO
      const selectedVoter = accounts[1].address
      await expect(
        ballotContract.giveRightToVote(selectedVoter)
      ).to.be.revertedWithoutReason()
    })
  })
})
