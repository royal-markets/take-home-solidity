/**
 * Look for required environment variables and prompt for any that are missing.
 *
 * Usage: npx hardhat run scripts/ensureEnv.ts
 */

import { ensureEnv } from '../src/ensureEnv';

async function main() {
  await ensureEnv();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
