import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumberish } from 'ethers';

import {
  BronzeToken,
  BuggyEscrow,
  GoldToken,
  SilverToken,
  ZRXToken,
} from '../../types';

export interface SwapInfo {
  party: string;
  token: string;
  tokenAmount: BigNumberish;
}

export interface Deployment {
  buggyEscrow: BuggyEscrow;
  bronzeToken: BronzeToken;
  silverToken: SilverToken;
  goldToken: GoldToken;
  zrxToken: ZRXToken;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
}
