/**
 * Example script to query and send a transaction to the escrow contract.
 *
 * Usage: npx hardhat run scripts/exampleScript.ts
 */

import { ethers } from 'hardhat';

import { requireEnv } from '../src/ensureEnv';
import { GOERLI_USDC } from '../src/lib/constants';
import { waitForTx } from '../src/lib/util';
import { BuggyEscrow__factory } from '../types';

async function main() {
  requireEnv();

  const [deployer] = await ethers.getSigners();
  const buggyEscrow = new BuggyEscrow__factory(deployer).attach(
    process.env.BUGGY_ESCROW_ADDRESS!
  );

  // Query a read-only function.
  await buggyEscrow.getSecretKeyHash();
  console.log(
    `Successfully queried the BuggyEscrow contract at ${buggyEscrow.address}`
  );

  // Send a transaction.
  //
  // Create a dummy swap with our own address as both parties to the swap,
  // and with a token amount of zero on each side.
  const tx = await buggyEscrow.initiateSwap(
    {
      party: deployer.address,
      token: GOERLI_USDC,
      tokenAmount: 0,
    },
    {
      party: deployer.address,
      token: GOERLI_USDC,
      tokenAmount: 0,
    }
  );
  console.log('Sent transaction to initiate swap...');

  // Wait for the transaction to be mined on-chain.
  await waitForTx(tx);
  console.log('Transaction was confirmed on-chain.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
