const HDWalletProvider = require('@truffle/hdwallet-provider');
const keys = require('./keys.json');

module.exports = {
  contracts_build_directory: './public/contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `wss://ropsten.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: '3',
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 20000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      timeoutBlocks: 500, // number of blocks before deployment times out
      networkCheckTimeout: 5000000
      // skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.8.10'
    }
  }
};

// ROPSTEN Dex.sol
// transaction hash:    0xd8fdde85c1490ae2669258ffe7d25dada6d99f80b958e8e645a174007a493626
// contract address:    0xD3ddDDf3D090E230C7a2827Cbcc9E70a7C1f525C
// account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
