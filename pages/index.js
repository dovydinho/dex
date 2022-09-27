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
import {
  Footer,
  LoadingScreenSpinner,
  NotConnected
} from '@components/ui/homepage';
import MainLayout from '@components/ui/layout/main';
import { useState, useEffect } from 'react';

const SIDE = {
  BUY: 0,
  SELL: 1
};

export default function Home() {
  const { web3, contracts } = useWeb3();
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
                    user.account !== undefined &&
                    user.account !== null && (
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
          <Footer />
        </div>
      )}
    </>
  );
}

Home.Layout = MainLayout;
