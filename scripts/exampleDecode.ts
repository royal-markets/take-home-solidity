/**
 * Example script to decode transaction data.
 *
 * Usage: npx hardhat run scripts/exampleScript.ts
 */

import { ethers } from 'hardhat';

async function main() {
  const data =
    '0xd988f1ee000000000000000000000000efacdc14c6e9ffa010074a2fa86dd5118a7ab5b0000000000000000000000000f8c65fdd2a3554070e71d43262e3369d9218f9da0000000000000000000000000000000000000000000000000000000000000032';
  const factory = await ethers.getContractFactory('BuggyEscrow');
  const decodeParams = factory.interface.decodeFunctionData(
    'completeSwap',
    data
  );
  console.log(JSON.stringify(decodeParams, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
