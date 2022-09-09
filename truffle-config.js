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

// 2_deploy_contracts.js
// =====================

//    Replacing 'Usdc'
//    ----------------
//    > transaction hash:    0x79f7a818078d1b11382d6ada7f28623239be800c4ad18a3ec3712eb9640bc784
// - Blocks: 0            Seconds: 0
//    > Blocks: 0            Seconds: 20
//    > contract address:    0x913E6986421C7d783393aC71A628b925930A08b4
//    > block number:        12951267
//    > block timestamp:     1662657936
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.987967072629569326
//    > gas used:            1227073 (0x12b941)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.02454146 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951268)
//    > confirmation number: 2 (block: 12951269)

//    Replacing 'Grt'
//    ---------------
//    > transaction hash:    0x2c1558adf282dff0243acff97b072df7e952ec2fc403ae85c1295760089d17f7
// - Blocks: 0            Seconds: 0
//    > Blocks: 1            Seconds: 20
//    > contract address:    0x4F93136BDd9e7f9d67f5C2fd73a6CCdb00e7Bac7
//    > block number:        12951271
//    > block timestamp:     1662657984
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.963425852629569326
//    > gas used:            1227061 (0x12b935)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.02454122 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951272)
//    > confirmation number: 2 (block: 12951273)

//    Replacing 'Link'
//    ----------------
//    > transaction hash:    0x7fa6bf18182c245a3dc37daa2adfb685e211e55e47c0b1596e9406bfc16e51ec
// - Blocks: 0            Seconds: 0
//    > Blocks: 0            Seconds: 8
//    > contract address:    0x495bccfa2a01b4f4E13C6f28F87897Eef3dd2b43
//    > block number:        12951274
//    > block timestamp:     1662658092
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.938884392629569326
//    > gas used:            1227073 (0x12b941)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.02454146 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951275)
//    > confirmation number: 2 (block: 12951276)

//    Replacing 'Mana'
//    ----------------
//    > transaction hash:    0x0025b16996c0c07342c7849c7ddeeac513a76855b40594b213af2c6999ff2e21
// - Blocks: 0            Seconds: 0
//    > Blocks: 0            Seconds: 20
//    > contract address:    0x76AB2A057B951A8B46Bb34E27b6027E290E38880
//    > block number:        12951277
//    > block timestamp:     1662658140
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.914342212629569326
//    > gas used:            1227109 (0x12b965)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.02454218 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951278)
//    > confirmation number: 2 (block: 12951279)

//    Replacing 'Sand'
//    ----------------
//    > transaction hash:    0x5838f21873d3b4fa6faf120bb2a2d3f9c35184f1b61b6769799d1ccba2125a16
// - Blocks: 0            Seconds: 0
//    > Blocks: 1            Seconds: 32
//    > contract address:    0x9f7B960324C84c5D9cCD603d5004A670e80dC08F
//    > block number:        12951281
//    > block timestamp:     1662658224
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.889800512629569326
//    > gas used:            1227085 (0x12b94d)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.0245417 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951282)
//    > confirmation number: 2 (block: 12951283)

//    Replacing 'Dex'
//    ---------------
//    > transaction hash:    0x5b1c1ab9138c2488a0877f052dd67ebe2b19863da436cc0c2b95bca38f3b101b
// - Blocks: 0            Seconds: 0
//    > Blocks: 1            Seconds: 20
//    > contract address:    0xE3304B555607eA326E7Ba77a3C56aD9820dCc0f2
//    > block number:        12951285
//    > block timestamp:     1662658284
//    > account:             0x7b48Eeedb1f7b6b65d4c9AF86B5BdBB945FF6D50
//    > balance:             15.827356632629569326
//    > gas used:            3122194 (0x2fa412)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.06244388 ETH

//    Pausing for 2 confirmations...
//    ------------------------------
//    > confirmation number: 1 (block: 12951286)
//    > confirmation number: 2 (block: 12951287)
