import {
  AllOrders,
  AllTrades,
  LoadingSpinner,
  MyOrders,
  Navbar,
  NewOrder,
  Transfer,
  Wallet
} from '@components/ui/common';
import { Dashboard, LoadingScreenSpinner } from '@components/ui/homepage';
import MainLayout from '@components/ui/layout/main';
import { useState, useEffect } from 'react';

const SIDE = {
  BUY: 0,
  SELL: 1
};

export default function Home({ web3, accounts, contracts }) {
  const [tokens, setTokens] = useState([]);
  const [user, setUser] = useState({
    accounts: [],
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

  const getBalances = async (account, token) => {
    const tokenDex = await contracts.dex.methods
      .traderBalances(account, web3.utils.fromAscii(token.ticker))
      .call();
    const tokenWallet = await contracts[token.ticker].methods
      .balanceOf(account)
      .call();
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

  const deposit = async (amount) => {
    await contracts[user.selectedToken.ticker].methods
      .approve(contracts.dex.options.address, amount)
      .send({ from: user.accounts[0] });
    await contracts.dex.methods
      .deposit(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({ from: user.accounts[0] });
    const balances = await getBalances(user.accounts[0], user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  const withdraw = async (amount) => {
    await contracts.dex.methods
      .withdraw(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({ from: user.accounts[0] });
    const balances = await getBalances(user.accounts[0], user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  const createMarketOrder = async (amount, side) => {
    await contracts.dex.methods
      .createMarketOrder(
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount,
        side
      )
      .send({ from: user.accounts[0] });
    const orders = await getOrders(user.selectedToken);
    setOrders(orders);
  };

  const createLimitOrder = async (amount, price, side) => {
    await contracts.dex.methods
      .createLimitOrder(
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount,
        price,
        side
      )
      .send({ from: user.accounts[0] });
    const orders = await getOrders(user.selectedToken);
    setOrders(orders);
  };

  useEffect(() => {
    const init = async () => {
      const rawTokens = await contracts.dex.methods.getTokens().call();
      const tokens = rawTokens.map((token) => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token.ticker)
      }));
      const [balances, orders] = await Promise.all([
        getBalances(accounts[0], tokens[0]),
        getOrders(tokens[0])
      ]);
      listenToTrades(tokens[0]);
      setTokens(tokens);
      setUser({ accounts, balances, selectedToken: tokens[0] });
      setOrders(orders);
    };
    init();
  }, []);

  useEffect(
    () => {
      const init = async () => {
        const [balances, orders] = await Promise.all([
          getBalances(user.accounts[0], user.selectedToken),
          getOrders(user.selectedToken)
        ]);
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

  if (typeof user.selectedToken === 'undefined') {
    return <LoadingScreenSpinner />;
  }

  return (
    <>
      <Navbar tokens={tokens} user={user} selectToken={selectToken} />

      <div className="container p-2 md:p-0">
        <div className="sm:flex lg:w-3/4 m-auto sm:gap-8 my-8">
          <Wallet user={user} web3={web3} />
          <Transfer
            deposit={deposit}
            withdraw={withdraw}
            user={user}
            web3={web3}
          />
        </div>

        {user.selectedToken.ticker === 'USDC' ? (
          <div className="lg:w-3/4 m-auto">
            <Dashboard
              user={user}
              tokens={tokens}
              trades={trades}
              web3={web3}
              selectToken={selectToken}
            />
          </div>
        ) : (
          <>
            <div className="lg:flex lg:gap-8 mb-8">
              <div className="w-full lg:w-2/3">
                <AllTrades trades={trades} user={user} web3={web3} />
              </div>
              <div className="w-full lg:w-1/3 pt-8 lg:pt-0">
                <NewOrder
                  createMarketOrder={createMarketOrder}
                  createLimitOrder={createLimitOrder}
                  tokenTicker={user.selectedToken.ticker}
                  web3={web3}
                />
              </div>
            </div>

            <div className="lg:w-full lg:flex lg:gap-8">
              <div className="w-full lg:w-1/2">
                <AllOrders orders={orders} user={user} web3={web3} />
              </div>
              <div className="w-full lg:w-1/2 pt-8 lg:pt-0">
                <MyOrders
                  contracts={contracts}
                  orders={{
                    buy: orders.buy.filter(
                      (order) =>
                        order.trader.toLowerCase() === accounts[0].toLowerCase()
                    ),
                    sell: orders.sell.filter(
                      (order) =>
                        order.trader.toLowerCase() === accounts[0].toLowerCase()
                    )
                  }}
                  user={user}
                  web3={web3}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

Home.Layout = MainLayout;
