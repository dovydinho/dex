import React, { useState, useEffect } from 'react';
import Home from '@pages/index';
import { useWeb3 } from '@components/providers';
import { Hero } from '@components/ui/homepage';
import { useAccount } from '@components/hooks/web3';

export default function Web3Container() {
  const [isReady, setIsReady] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const { web3, contracts } = useWeb3();
  const { account } = useAccount();

  useEffect(() => {
    const init = async () => {
      web3 ? setAccounts(await web3.eth.getAccounts()) : null;
    };
    init();
  }, [web3]);

  useEffect(() => {
    setIsReady(
      typeof web3 !== 'undefined' &&
        typeof contracts !== 'undefined' &&
        accounts.length > 0
    );
  }, [web3, contracts, accounts]);

  return (
    <>
      {account.data && isReady ? (
        <Home web3={web3} accounts={accounts} contracts={contracts} />
      ) : (
        <Hero />
      )}
    </>
  );
}
