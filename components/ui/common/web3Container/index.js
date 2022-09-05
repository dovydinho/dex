import { Hero } from '@components/ui/homepage';
import Home from '@pages/index';
import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/hooks/web3';
import React, { useState, useEffect } from 'react';

export default function Web3Container() {
  const [isReady, setIsReady] = useState(false);
  const { web3, contracts } = useWeb3();
  const { account } = useAccount();

  console.log(isReady);

  useEffect(() => {
    setIsReady(
      typeof web3 !== null &&
        typeof contracts !== null &&
        account.data !== 'undefined'
    );
  }, [web3, contracts, account]);

  return (
    <>
      {isReady ? (
        <Home web3={web3} contracts={contracts} account={account} />
      ) : (
        <Hero />
      )}
    </>
  );
}
