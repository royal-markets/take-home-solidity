import { expect } from 'chai';
import { ethers } from 'hardhat';

import { deployAndInit } from '../src/deployAndInit';
import { GOERLI_USDC } from '../src/lib/constants';
import { Deployment } from '../src/lib/types';

let c: Deployment;

describe('Challenge initialization', () => {
  it('initializes', async () => {
    c = await deployAndInit();
  });

  it('has the expected initial state', async () => {
    const escrowedBronzeToken = await c.bronzeToken.balanceOf(
      c.buggyEscrow.address
    );
    expect(escrowedBronzeToken).to.equal(100);
  });

  it('runs the example transaction', async () => {
    const [deployer] = await ethers.getSigners();
    await c.buggyEscrow.initiateSwap(
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
  });
});
