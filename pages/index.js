import { useAccount } from '@components/hooks/web3';
import { useWeb3 } from '@components/providers';
import {
  AllOrders,
  AllTrades,
  MyOrders,
  Navbar,
  NewOrder,
  Seed,
  Transfer,
  Wallet
} from '@components/ui/common';
import { Hero, LoadingScreenSpinner } from '@components/ui/homepage';
import MainLayout from '@components/ui/layout/main';
import { useState, useEffect } from 'react';

const SIDE = {
  BUY: 0,
  SELL: 1
};

// export default function Home({ web3, contracts, account }) {
export default function Home() {
  const { web3, contracts } = useWeb3();
  const { account } = useAccount();

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

  const getBalances = async (accountAddress, token) => {
    const tokenDex = await contracts.dex.methods
      .traderBalances(accountAddress, web3.utils.fromAscii(token.ticker))
      .call();
    const tokenWallet = await contracts[token.ticker].methods
      .balanceOf(accountAddress)
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
      .send({ from: account.data });
    await contracts.dex.methods
      .deposit(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({ from: account.data });
    const balances = await getBalances(account.data, user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  const withdraw = async (amount) => {
    await contracts.dex.methods
      .withdraw(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({ from: account.data });
    const balances = await getBalances(account.data, user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  const createMarketOrder = async (amount, side) => {
    await contracts.dex.methods
      .createMarketOrder(
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount,
        side
      )
      .send({ from: account.data });
    const orders = await getOrders(user.selectedToken);
    setOrders(orders);

    const balances = await getBalances(user.account, user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  const createLimitOrder = async (amount, price, side) => {
    await contracts.dex.methods
      .createLimitOrder(
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount,
        price,
        side
      )
      .send({ from: account.data });
    let orders = await getOrders(user.selectedToken);
    setOrders(orders);
  };

  useEffect(() => {
    console.log(account.data);
    const init = async () => {
      const rawTokens = await contracts.dex.methods.getTokens().call();
      const tokens = rawTokens.map((token) => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token.ticker)
      }));
      const [balances, orders] = await Promise.all([
        getBalances(account.data, tokens[0]),
        getOrders(tokens[0])
      ]);
      listenToTrades(tokens[0]);
      setTokens(tokens);
      setUser({ account: account.data, balances, selectedToken: tokens[0] });
      setOrders(orders);
    };
    web3 && contracts && account.data && init();
  }, [web3, contracts, account.data]);

  useEffect(
    () => {
      const init = async () => {
        const [balances, orders] = await Promise.all([
          getBalances(user.account, user.selectedToken),
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

  useEffect(() => {
    const init = async () => {
      const balances = await getBalances(account.data, user.selectedToken);
      setUser((user) => ({ ...user, account: account.data, balances }));
    };
    if (typeof user.selectedToken !== 'undefined') {
      init();
    }
  }, [account.data]);

  if (typeof account.data === 'undefined' || typeof account === null) {
    return <Hero />;
  }

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
          <>
            <div className="lg:w-3/4 mx-auto mt-8">
              <Seed
                web3={web3}
                contracts={contracts}
                user={user}
                getBalances={getBalances}
                setUser={setUser}
              />
            </div>
          </>
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
                        order.trader.toLowerCase() ===
                        account.data.toLowerCase()
                    ),
                    sell: orders.sell.filter(
                      (order) =>
                        order.trader.toLowerCase() ===
                        account.data.toLowerCase()
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
