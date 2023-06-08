import util from 'util';

import { ethers } from 'ethers';
import { run } from 'hardhat';

export async function verifyContracts(
  buggyEscrowAddress: string,
  bronzeTokenAddress: string,
  silverTokenAddress: string,
  goldTokenAddress: string,
  zrxTokenAddress: string
): Promise<void> {
  const secretKey = process.env.OWNER_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing required env var OWNER_SECRET_KEY');
  }
  await verifyContract(
    'contracts/BuggyEscrow.sol:BuggyEscrow',
    buggyEscrowAddress,
    [secretKey, ethers.utils.keccak256(Buffer.from(secretKey))]
  );
  await verifyContract(
    'contracts/tokens/TargetTokens.sol:BronzeToken',
    bronzeTokenAddress
  );
  await verifyContract(
    'contracts/tokens/TargetTokens.sol:SilverToken',
    silverTokenAddress
  );
  await verifyContract(
    'contracts/tokens/TargetTokens.sol:GoldToken',
    goldTokenAddress
  );
  await verifyContract(
    'contracts/tokens/ZRXToken.sol:ZRXToken',
    zrxTokenAddress
  );
  console.log('Verified all contracts');
}

async function verifyContract(
  contract: string,
  address: string,
  constructorArguments: unknown[] = []
): Promise<void> {
  while (true) {
    try {
      await run('verify:verify', {
        contract,
        address,
        constructorArguments,
      });
    } catch (error) {
      if ((error as Error).message.includes('Reason: Already Verified')) {
        console.log(`Warning: ${contract} was already verified`);
      } else if ((error as Error).message.includes('does not have bytecode')) {
        // Retry
        console.log(
          `Warning: No bytecode for ${contract}, will retry verification`
        );
        await util.promisify(setTimeout)(5000);
        continue;
      } else {
        throw error;
      }
    }
    break;
  }
}
