# BuggyEscrow Challenge

This is a hardhat project used to deploy and interact with the BuggyEscrow challenge contract. Note that the default network in [hardhat.config.ts](./hardhat.config.ts) is set to `goerli`.

## Contracts

The following contracts have been copied, un-modified, from external sources:
* All contracts in [contracts/openzeppelin](./contracts/openzeppelin)
* [ZRXToken.sol](./contracts/tokens/ZRXToken.sol)

The following contracts were written for this challenge, and may contain vulnerabilities:
* [BuggyEscrow.sol](./contracts/BuggyEscrow.sol)
* [Rescuable.sol](./contracts/Rescuable.sol)
* [SecretKeyOwnable.sol](./contracts/SecretKeyOwnable.sol)
* [TargetTokens.sol](./contracts/tokens/TargetTokens.sol)

## Scripts

The following scripts are provided:
* [deployAndInit.ts](./scripts/deployAndInit.ts): The script used to initialize the challenge with a new set of contracts.
* [ensureEnv.ts](./scripts/ensureEnv.ts): A helper script to set up environment variables for sending transactions on the Görli testnet.
* [exampleScript.ts](./scripts/exampleScript.ts): A sample script that sends a transaction to the BuggyEscrow contract.
* [exampleDecode.ts](./scripts/exampleDecode.ts): A sample script that decodes transaction data using the contract ABI.
