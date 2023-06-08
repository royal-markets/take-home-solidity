import readline from 'readline';

import { TransactionReceipt } from '@ethersproject/providers';
import { ContractTransaction, Signer, ethers } from 'ethers';

import { SwapInfo } from './types';

export async function makeSignature(
  signer: Signer,
  sideA: SwapInfo,
  sideB: SwapInfo
): Promise<string> {
  const encodedDataString = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'address', 'uint256'],
    [sideA.token, sideA.tokenAmount, sideB.token, sideB.tokenAmount]
  );
  const encodedData = Buffer.from(encodedDataString.slice(2), 'hex');
  const digestString = ethers.utils.keccak256(encodedData);
  const digest = Buffer.from(digestString.slice(2), 'hex');
  return signer.signMessage(digest);
}

export async function prompt(promptMessage: string): Promise<string> {
  const reader = readline.createInterface({
    terminal: true,
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    reader.question(`${promptMessage} `, (response: string) => {
      reader.close();
      console.log();
      resolve(response);
    });
  });
}

export async function waitForTx(
  tx: ContractTransaction | Promise<ContractTransaction>
): Promise<TransactionReceipt> {
  return (await tx).wait();
}

export async function waitForTxs(
  txs: (ContractTransaction | Promise<ContractTransaction>)[]
): Promise<TransactionReceipt[]> {
  return Promise.all(txs.map(waitForTx));
}
