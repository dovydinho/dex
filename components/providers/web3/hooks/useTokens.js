import { useState, useEffect } from 'react';
import { useWeb3 } from '@components/providers';

export const useTokens = () => {
  const { contract, web3 } = useWeb3();
  const [tokenContracts, setTokenContracts] = useState([]);

  useEffect(() => {
    let init = async () => {
      if (contract && contract !== null) {
        let ERC20Abi = await fetch('/src/ERC20Abi.json');
        let Artifact = await ERC20Abi.json();

        const callGetTokens = await contract.methods.getTokens().call();

        for (let i = 0; i < callGetTokens.length; i++) {
          let object = {
            label: [web3.utils.hexToUtf8(callGetTokens[i].ticker)],
            value: new web3.eth.Contract(
              Artifact,
              callGetTokens[i].tokenAddress
            )
          };

          setTokenContracts((tokenContracts) => [object, ...tokenContracts]);
        }
      }
    };
    init();
  }, [contract]);

  return tokenContracts;
};
