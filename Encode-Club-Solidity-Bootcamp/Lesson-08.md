# Lesson 8 - Scripts for Ballot.sol 
## Using scripts to automate operations
* Running a script with yarn and node, ts-node and/or hardhat
* Ballot deployment  script
* Passing arguments
* Passing variables to the deployment script

### References
https://hardhat.org/hardhat-runner/docs/advanced/scripts

https://hardhat.org/hardhat-runner/docs/guides/typescript#running-your-tests-and-scripts-directly-with--ts-node

https://nodejs.org/docs/latest/api/process.html#processargv

<pre><code>import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function main() {
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // TODO
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});</code></pre>
### Running scripts
```
yarn hardhat run .\scripts\Deployment.ts
```
### Running scripts with arguments
```
yarn run ts-node --files .\scripts\Deployment.ts "arg1" "arg2" "arg3"
```
## Connecting to a public blockchain
* Environment files
* Providers
* Connecting to a testnet with a RPC Provider
* Running scripts on chain
* Script for giving voting rights to a given address
* Dealing with transactions in scripts
* Contract factory and json imports
* Transaction receipts and async complexities when running onchain

### References
https://www.npmjs.com/package/dotenv

https://docs.ethers.io/v5/api/providers/

https://docs.ethers.io/v5/api/contract/contract-factory/

# Homework
* Create Github Issues with your questions about this lesson
* Read the references

# Weekend Project
* Form groups of 3 to 5 students
* Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results
* Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
* Submit your code in a github repository in the form
