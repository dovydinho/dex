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

//    ROPSTEN Dex.sol

//    Replacing 'Usdc'
//    ----------------
//    > transaction hash:    0x79f7a818078d1b11382d6ada7f28623239be800c4ad18a3ec3712eb9640bc784
//    > contract address:    0x913E6986421C7d783393aC71A628b925930A08b4

//    Replacing 'Grt'
//    ---------------
//    > transaction hash:    0x2c1558adf282dff0243acff97b072df7e952ec2fc403ae85c1295760089d17f7
//    > contract address:    0x4F93136BDd9e7f9d67f5C2fd73a6CCdb00e7Bac7

//    Replacing 'Link'
//    ----------------
//    > transaction hash:    0x7fa6bf18182c245a3dc37daa2adfb685e211e55e47c0b1596e9406bfc16e51ec
//    > contract address:    0x495bccfa2a01b4f4E13C6f28F87897Eef3dd2b43

//    Replacing 'Mana'
//    ----------------
//    > transaction hash:    0x0025b16996c0c07342c7849c7ddeeac513a76855b40594b213af2c6999ff2e21
//    > contract address:    0x76AB2A057B951A8B46Bb34E27b6027E290E38880

//    Replacing 'Sand'
//    ----------------
//    > transaction hash:    0x5838f21873d3b4fa6faf120bb2a2d3f9c35184f1b61b6769799d1ccba2125a16
//    > contract address:    0x9f7B960324C84c5D9cCD603d5004A670e80dC08F

//    Replacing 'Dex'
//    ---------------
//    > transaction hash:    0x5b1c1ab9138c2488a0877f052dd67ebe2b19863da436cc0c2b95bca38f3b101b
//    > contract address:    0xE3304B555607eA326E7Ba77a3C56aD9820dCc0f2
