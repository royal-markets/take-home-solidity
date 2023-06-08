/**
 * The script used to deploy and initialize the challenge.
 *
 * Usage: npx hardhat run scripts/deployAndInit.ts
 */

import { deployAndInit } from '../src/deployAndInit';

async function main() {
  await deployAndInit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
