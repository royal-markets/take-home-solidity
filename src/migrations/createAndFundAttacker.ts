import { Wallet } from 'ethers';
import { ethers } from 'hardhat';

import { waitForTx } from '../lib/util';

const ATTACKER_FUND_AMOUNT = ethers.utils.parseEther('0.1');

export async function createAndFundAttacker(): Promise<Wallet> {
  const [deployer] = await ethers.getSigners();
  const attacker = ethers.Wallet.createRandom();
  await waitForTx(
    deployer.sendTransaction({
      to: attacker.address,
      value: ATTACKER_FUND_AMOUNT,
    })
  );
  console.log('Created and funded attacker account:');
  console.log(`- Attacker address: ${attacker.address}`);
  console.log(`- Attacker private key: ${attacker.privateKey}`);
  console.log();
  return attacker;
}
