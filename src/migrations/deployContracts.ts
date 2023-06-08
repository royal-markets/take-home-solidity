import { ethers } from 'hardhat';

import {
  BronzeToken__factory,
  SilverToken__factory,
  BuggyEscrow__factory,
  GoldToken__factory,
  ZRXToken__factory,
} from '../../types';
import { waitForTxs } from '../lib/util';

export async function deployContracts() {
  const OWNER_SECRET_KEY = process.env.OWNER_SECRET_KEY;
  if (!OWNER_SECRET_KEY) {
    throw new Error('Missing required env var OWNER_SECRET_KEY');
  }

  const [deployer] = await ethers.getSigners();
  let nonce = await ethers.provider.getTransactionCount(deployer.address);

  // Deploy contracts.
  console.log('Deploying contracts...');
  const secretKeyHash = ethers.utils.keccak256(Buffer.from(OWNER_SECRET_KEY));
  const buggyEscrow = await new BuggyEscrow__factory(deployer).deploy(
    OWNER_SECRET_KEY,
    secretKeyHash,
    {
      nonce: nonce++,
    }
  );
  const bronzeToken = await new BronzeToken__factory(deployer).deploy({
    nonce: nonce++,
  });
  const silverToken = await new SilverToken__factory(deployer).deploy({
    nonce: nonce++,
  });
  const goldToken = await new GoldToken__factory(deployer).deploy({
    nonce: nonce++,
  });
  const zrxToken = await new ZRXToken__factory(deployer).deploy({
    nonce: nonce++,
  });
  await waitForTxs([
    buggyEscrow.deployTransaction,
    bronzeToken.deployTransaction,
    silverToken.deployTransaction,
    goldToken.deployTransaction,
    zrxToken.deployTransaction,
  ]);

  console.log('Deployed contracts:');
  console.log(`- buggyEscrow: ${buggyEscrow.address}`);
  console.log(`- bronzeToken: ${bronzeToken.address}`);
  console.log(`- silverToken: ${silverToken.address}`);
  console.log(`- goldToken: ${goldToken.address}`);
  console.log(`- zrxToken: ${zrxToken.address}`);
  console.log();

  return {
    buggyEscrow,
    bronzeToken,
    silverToken,
    goldToken,
    zrxToken,
  };
}
