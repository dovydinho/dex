import { useAccount, useNetwork } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';
import {
  AllOrders,
  AllTrades,
  AllTradesChart,
  LoadingSpinner,
  MyOrders,
  Navbar,
  NewOrder,
  Seed,
  Transfer,
  Wallet
} from '@components/ui/common';
import { LoadingScreenSpinner, NotConnected } from '@components/ui/homepage';
import MainLayout from '@components/ui/layout/main';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const SIDE = {
  BUY: 0,
  SELL: 1
};

export default function Home() {
  const { web3, contracts, requireInstall } = useWeb3();
  const { account } = useAccount();
  const { network } = useNetwork();

  const [tokens, setTokens] = useState([]);
  const [user, setUser] = useState({
    account: undefined,
    balances: {
      tokenDex: 0,
      tokenWallet: 0
    },
    selectedToken: undefined
  });
  const [orders, setOrders] = useState({
    buy: [],
    sell: []
  });
  const [trades, setTrades] = useState([]);
  const [listener, setListener] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const getBalances = async (accountAddress, token) => {
    const tokenDex =
      contracts[token.ticker] &&
      (await contracts.dex.methods
        .traderBalances(accountAddress, web3.utils.fromAscii(token.ticker))
        .call());
    const tokenWallet =
      contracts[token.ticker] &&
      (await contracts[token.ticker].methods.balanceOf(accountAddress).call());
    return { tokenDex, tokenWallet };
  };

  const getOrders = async (token) => {
    const orders = await Promise.all([
      contracts.dex.methods
        .getOrders(web3.utils.fromAscii(token.ticker), SIDE.BUY)
        .call(),
      contracts.dex.methods
        .getOrders(web3.utils.fromAscii(token.ticker), SIDE.SELL)
        .call()
    ]);
    return { buy: orders[0], sell: orders[1] };
  };

  const listenToTrades = (token) => {
    const tradeIds = new Set();
    setTrades([]);
    const listener = contracts.dex.events
      .NewTrade({
        filter: { ticker: web3.utils.fromAscii(token.ticker) },
        fromBlock: 0
      })
      .on('data', (newTrade) => {
        if (tradeIds.has(newTrade.returnValues.tradeId)) return;
        tradeIds.add(newTrade.returnValues.tradeId);
        setTrades((trades) => [...trades, newTrade.returnValues]);
      });
    setListener(listener);
  };

  const selectToken = (token) => {
    setUser({ ...user, selectedToken: token });
  };

  const refreshPage = () => {
    return window.location.reload();
  };

  useEffect(() => {
    const init = async () => {
      const rawTokens = await contracts.dex.methods.getTokens().call();
      const tokens = rawTokens.map((token) => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token.ticker)
      }));
      const [balances, orders] =
        account.data !== null &&
        (await Promise.all([
          getBalances(account.data, tokens[0]),
          getOrders(tokens[0])
        ]));
      listenToTrades(tokens[0]);
      setTokens(tokens);
      setUser({ account: account.data, balances, selectedToken: tokens[0] });
      setOrders(orders);
    };
    web3 && contracts && account.data && network.isSupported && init();
  }, [web3, contracts, account.data, network.isSupported]);

  useEffect(
    () => {
      const init = async () => {
        const [balances, orders] =
          user.account !== null &&
          (await Promise.all([
            getBalances(user.account, user.selectedToken),
            getOrders(user.selectedToken)
          ]));
        listenToTrades(user.selectedToken);
        setUser((user) => ({ ...user, balances }));
        setOrders(orders);
      };
      if (typeof user.selectedToken !== 'undefined') {
        init();
      }
    },
    [user.selectedToken],
    () => {
      listener.unsubscribe();
    }
  );

  useEffect(() => {
    account.data === null && refreshPage();
    const init = async () => {
      const balances =
        account.data !== null &&
        account.data !== undefined &&
        (await getBalances(account.data, user.selectedToken));
      setUser((user) => ({ ...user, account: account.data, balances }));
    };
    if (typeof user.selectedToken !== 'undefined') {
      init();
    }
  }, [account.data]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [user.account, network.isSupported, user.selectedToken]);

  if (typeof user.selectedToken === 'undefined') {
    return <>{loading ? <LoadingScreenSpinner /> : <NotConnected />}</>;
  }

  return (
    <>
      {tokens && user.selectedToken !== undefined ? (
        <Navbar tokens={tokens} user={user} selectToken={selectToken} />
      ) : (
        <Navbar />
      )}

      {loading ? (
        <LoadingSpinner additionalClass={'h-[50vh]'} />
      ) : (
        <div className="container p-2 md:p-0">
          <div className="sm:flex lg:w-3/4 m-auto sm:gap-8 my-8">
            <Wallet web3={web3} user={user} />

            <Transfer
              getBalances={getBalances}
              setUser={setUser}
              contracts={contracts}
              user={user}
              web3={web3}
            />
          </div>

          {user.selectedToken !== undefined &&
          user.selectedToken.ticker === 'USDC' ? (
            <>
              <div className="lg:w-3/4 mx-auto mt-8">
                <Seed
                  getBalances={getBalances}
                  setUser={setUser}
                  web3={web3}
                  contracts={contracts}
                  user={user}
                />
              </div>
            </>
          ) : (
            <>
              <div className="lg:flex lg:gap-8 mb-8">
                <div className="w-full lg:w-2/3">
                  {web3 && trades && user.selectedToken !== undefined && (
                    <>
                      <AllTradesChart trades={trades} user={user} web3={web3} />
                      <AllTrades trades={trades} user={user} web3={web3} />
                    </>
                  )}
                </div>
                <div className="w-full lg:w-1/3 pt-8 lg:pt-0">
                  {user.selectedToken !== undefined && (
                    <NewOrder
                      getBalances={getBalances}
                      getOrders={getOrders}
                      setOrders={setOrders}
                      setUser={setUser}
                      web3={web3}
                      contracts={contracts}
                      user={user}
                    />
                  )}
                </div>
              </div>

              <div className="lg:w-full lg:flex lg:gap-8">
                <div className="w-full lg:w-1/2">
                  {web3 && orders && user.selectedToken !== undefined && (
                    <AllOrders orders={orders} user={user} web3={web3} />
                  )}
                </div>
                <div className="w-full lg:w-1/2 pt-8 lg:pt-0">
                  {web3 &&
                    orders &&
                    user.selectedToken !== undefined &&
                    account !== undefined &&
                    account !== null && (
                      <MyOrders
                        contracts={contracts}
                        orders={{
                          buy: orders.buy.filter(
                            (order) =>
                              order.trader.toLowerCase() ===
                              user.account.toLowerCase()
                          ),
                          sell: orders.sell.filter(
                            (order) =>
                              order.trader.toLowerCase() ===
                              user.account.toLowerCase()
                          )
                        }}
                        user={user}
                        web3={web3}
                      />
                    )}
                </div>
              </div>
            </>
          )}

          <section className="py-8 text-center text-sm text-gray-200 uppercase">
            <p className="mb-2">
              Built by{' '}
              <Link href="https://dovydas.io">
                <a target="_blank" className="font-medium">
                  dovydas.io
                </a>
              </Link>
            </p>
            <Link href="https://www.linkedin.com/in/dovydas-lapinskas">
              <a
                target="_blank"
                className="p-1 sm:px-2 sm:py-2 rounded-lg hover:bg-gray-200/[.25] dark:hover:bg-gray-800 transition-all"
              >
                <svg
                  className="w-6 h-6 text-blue-500 fill-current hidden md:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </a>
            </Link>
            <Link href="https://twitter.com/dovydinho">
              <a
                target="_blank"
                className="p-1 sm:px-2 sm:py-2 rounded-lg hover:bg-gray-200/[.25] dark:hover:bg-gray-800 transition-all"
              >
                <svg
                  className="w-6 h-6 text-blue-300 fill-current hidden md:inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </Link>
          </section>
        </div>
      )}
    </>
  );
}

Home.Layout = MainLayout;
