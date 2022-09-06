import { Hero } from '@components/ui/homepage';
import Home from '@pages/index';
import { useWeb3 } from '@components/providers';
import { useAccount } from '@components/hooks/web3';
import { useState, useEffect } from 'react';

export default function Web3Container() {
  const { web3, contracts } = useWeb3();
  const { account } = useAccount();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(
      web3 !== null &&
        contracts !== null &&
        account.data !== undefined &&
        account.data !== null
    );
  }, [web3, contracts, account.data, isReady]);

  // if (isReady === false) {
  //   return <Hero />;
  // }

  return <Home web3={web3} contracts={contracts} account={account} />;
}
