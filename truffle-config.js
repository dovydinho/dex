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
    goerli: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC
          },
          providerOrUrl: `wss://goerli.infura.io/ws/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: '5',
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

//    GOERLI Contract Addresses

//    Deploying 'Usdc'
//    > contract address:    0x3d13a28743AFD8f6617169d4E4Bd18040834b692

//    Deploying 'Grt'
//    > contract address:    0xF28409dBfeC1e88F255e41d7F6EB707D366C2152

//    Deploying 'Link'
//    > contract address:    0xDE55404409608C8426C5BabF206Cc739d345Ad2f

//    Deploying 'Mana'
//    > contract address:    0x88c6D291708D354B49F5D0D0BcAc69591f101878

//    Deploying 'Sand'
//    > contract address:    0x50df9E3c570E5C87D793E71aDDbB6d0d56ecaA42

//    Deploying 'Dex'
//    > contract address:    0xE970aDF0413879763a1B49dfFc72589672d2937A
