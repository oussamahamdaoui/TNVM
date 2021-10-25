require('@nomiclabs/hardhat-waffle');
const fs = require('fs');

const privateKey = fs.readFileSync('.secret').toString().trim() || '01234567890123456789';

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
      accounts: [privateKey],
      confirmations: 2,
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com',
      chainId: 137,
      accounts: [privateKey],
    },
    evmos: {
      url: 'http://arsiamons.rpc.evmos.org:8545',
      chainId: 9000,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
