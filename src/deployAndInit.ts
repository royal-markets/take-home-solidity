import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { UINT256_MAX } from './lib/constants';
import { makeSignature, waitForTx, waitForTxs } from './lib/util';
import { Deployment, SwapInfo } from './lib/types';
import { createAndFundAttacker } from './migrations/createAndFundAttacker';
import { deployContracts } from './migrations/deployContracts';
import { verifyContracts } from './migrations/verifyContracts';

const USER_FUND_AMOUNT = ethers.utils.parseEther('0.0025');

/**
 * Initializes the challenge with a new set of contracts.
 *
 * Performs the following steps:
 *   1. Deploy the escrow and token contracts.
 *   2. Create users and fund them with ETH and tokens.
 *   3. Set ERC-20 approvals for users on the escrow contract.
 *   4. Initiate swap of Bronze -> Silver.
 *   5. Execute swap from Silver -> Gold with initiateSwapBySig().
 *   6. Execute swap from ZRX -> Gold with completeSwapBySig().
 */
export async function deployAndInit(): Promise<Deployment> {
  const [deployer] = await ethers.getSigners();
  console.log(`Using deployer: ${deployer.address}`);

  // Step 1: Deploy the escrow and token contracts.
  const { buggyEscrow, bronzeToken, silverToken, goldToken, zrxToken } =
    await deployContracts();

  await verifyContracts(
    buggyEscrow.address,
    bronzeToken.address,
    silverToken.address,
    goldToken.address,
    zrxToken.address
  );

  let nonce = await ethers.provider.getTransactionCount(deployer.address);

  // Step 2: Create users and fund them with ETH and tokens.
  const user1 = ethers.Wallet.createRandom().connect(ethers.provider);
  const user2 = ethers.Wallet.createRandom().connect(ethers.provider);
  const asUser1 = buggyEscrow.connect(user1);
  const asUser2 = buggyEscrow.connect(user2);
  {
    const txs = [];

    // Tranfer ETH.
    txs.push(
      await deployer.sendTransaction({
        to: user1.address,
        value: USER_FUND_AMOUNT,
        nonce: nonce++,
      })
    );
    txs.push(
      await deployer.sendTransaction({
        to: user2.address,
        value: USER_FUND_AMOUNT,
        nonce: nonce++,
      })
    );

    // Transfer ERC-20 tokens.
    txs.push(
      await bronzeToken.transfer(user1.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );
    txs.push(
      await silverToken.transfer(user1.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );
    txs.push(
      await goldToken.transfer(user1.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );
    txs.push(
      await bronzeToken.transfer(user2.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );
    txs.push(
      await silverToken.transfer(user2.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );
    txs.push(
      await goldToken.transfer(user2.address, 100, {
        gasLimit: 100000,
        nonce: nonce++,
      })
    );

    await waitForTxs(txs);
  }

  // Step 3: Set ERC-20 approvals for users on the escrow contract.
  await waitForTxs([
    await bronzeToken.connect(user1).approve(buggyEscrow.address, UINT256_MAX, {
      gasLimit: 100000,
      gasPrice: 2000000009,
      nonce: 0,
    }),
    await silverToken.connect(user1).approve(buggyEscrow.address, UINT256_MAX, {
      gasLimit: 100000,
      gasPrice: 2000000009,
      nonce: 1,
    }),
    await goldToken.connect(user2).approve(buggyEscrow.address, UINT256_MAX, {
      gasLimit: 100000,
      gasPrice: 2000000009,
    }),
  ]);

  console.log('Set up accounts.');

  // Step 4: Initiate swap of Bronze -> Silver.
  await waitForTx(
    asUser1.initiateSwap(
      {
        party: user1.address,
        token: bronzeToken.address,
        tokenAmount: 100,
      },
      {
        party: user2.address,
        token: silverToken.address,
        tokenAmount: 50,
      }
    )
  );

  console.log('Done with swap 1.');

  // Step 5: Execute swap from Silver -> Gold with initiateSwapBySig().
  {
    const sideA: SwapInfo = {
      party: user1.address,
      token: silverToken.address,
      tokenAmount: 50,
    };
    const sideB: SwapInfo = {
      party: user2.address,
      token: goldToken.address,
      tokenAmount: 25,
    };
    const signature = await makeSignature(user1, sideA, sideB);
    await waitForTx(buggyEscrow.initiateSwapWithSig(sideA, sideB, signature));
    await waitForTx(asUser2.completeSwap(sideA));
  }

  console.log('Done with swap 2.');

  // Step 6: Execute swap from ZRX -> Gold with completeSwapBySig().
  {
    const sideA: SwapInfo = {
      party: user1.address,
      token: zrxToken.address,
      tokenAmount: 100,
    };
    const sideB: SwapInfo = {
      party: user2.address,
      token: goldToken.address,
      tokenAmount: 25,
    };
    const signature = await makeSignature(user2, sideA, sideB);
    await waitForTx(asUser1.initiateSwap(sideA, sideB));
    await waitForTx(buggyEscrow.completeSwapBySig(sideA, signature));
  }

  console.log('Done with swap 3.');

  const attacker = await createAndFundAttacker();

  console.log('DEPLOYED CONTRACTS:');
  console.log();
  console.log(`BronzeToken: ${bronzeToken.address}`);
  console.log(`SilverToken: ${silverToken.address}`);
  console.log(`GoldToken: ${goldToken.address}`);
  console.log();
  console.log(`BuggyEscrow: ${buggyEscrow.address}`);
  console.log();
  console.log('Etherscan links:');
  console.log();
  console.log(`https://goerli.etherscan.io/address/${bronzeToken.address}`);
  console.log(`https://goerli.etherscan.io/address/${silverToken.address}`);
  console.log(`https://goerli.etherscan.io/address/${goldToken.address}`);
  console.log(`https://goerli.etherscan.io/address/${buggyEscrow.address}`);
  console.log();
  console.log(`GOERLI_PRIVATE_KEY: ${attacker.privateKey}`);
  console.log(`GOERLI_PROVIDER_URL: ${process.env.GOERLI_PROVIDER_URL}`);
  console.log(`BUGGY_ESCROW_ADDRESS: ${buggyEscrow.address}`);

  return {
    buggyEscrow,
    bronzeToken,
    silverToken,
    goldToken,
    zrxToken,
    user1: user1 as unknown as SignerWithAddress,
    user2: user2 as unknown as SignerWithAddress,
  };
}
