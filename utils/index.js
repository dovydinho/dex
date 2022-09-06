const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Dex from '@contracts/Dex.json';
import USDC from '@contracts/Usdc.json';
import ERC20Abi from '@base/public/src/ERC20Abi.json';

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      try {
        const web3 = new Web3(window.ethereum);
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    reject('Install Metamask');
  });

const getContracts = async (web3) => {
  const dex = null;
  const tokens = [];

  try {
    dex = new web3.eth.Contract(Dex.abi, Dex.networks[NETWORK_ID].address);
    tokens = dex && (await dex.methods.getTokens().call());
  } catch {
    console.log(`Contract cannot be loaded.`);
  }

  const tokenContracts =
    tokens.length > 0 &&
    tokens.reduce(
      (acc, token) => ({
        ...acc,
        [web3.utils.hexToUtf8(token.ticker)]: new web3.eth.Contract(
          web3.utils.hexToUtf8(token.ticker) === 'USDC' ? USDC.abi : ERC20Abi,
          token.tokenAddress
        )
      }),
      {}
    );

  return { dex, ...tokenContracts };
};

export { getWeb3, getContracts };
