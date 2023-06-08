import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import { HardhatNetworkUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

dotenv.config();

function getHardhatConfig(): HardhatNetworkUserConfig {
  const networkConfig: HardhatNetworkUserConfig = {
    gasPrice: 2.5 * 10 ** 9,
  };
  if (process.env.FORK_GOERLI === 'true') {
    networkConfig.chainId = 5;
    networkConfig.forking = {
      url: process.env.GOERLI_PROVIDER_URL || '',
      blockNumber:
        process.env.FORK_BLOCK_NUMBER !== undefined
          ? Number(process.env.FORK_BLOCK_NUMBER)
          : undefined,
    };
  }
  return networkConfig;
}

const config: HardhatUserConfig = {
  defaultNetwork: 'goerli',
  solidity: {
    compilers: [
      {
        version: '0.4.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  networks: {
    hardhat: getHardhatConfig(),
    mainnet: {
      url: process.env.MAINNET_PROVIDER_URL || '',
      accounts:
        process.env.MAINNET_PRIVATE_KEY !== undefined
          ? [process.env.MAINNET_PRIVATE_KEY]
          : [],
    },
    goerli: {
      url: process.env.GOERLI_PROVIDER_URL || '',
      accounts:
        process.env.GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.GOERLI_PRIVATE_KEY]
          : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_PROVIDER_URL || '',
      accounts:
        process.env.ROPSTEN_PRIVATE_KEY !== undefined
          ? [process.env.ROPSTEN_PRIVATE_KEY]
          : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
