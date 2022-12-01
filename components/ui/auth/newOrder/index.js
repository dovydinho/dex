import { useState } from 'react';

import { Button } from '@components/ui/common';
import { useWeb3 } from '@components/web3';

const TYPE = {
  LIMIT: 'LIMIT',
  MARKET: 'MARKET'
};

const SIDE = {
  BUY: 0,
  SELL: 1
};

export default function NewOrder({
  getBalances,
  getOrders,
  setOrders,
  setUser,
  web3,
  contracts,
  user
}) {
  const { hooks } = useWeb3();
  const [loading, setLoading] = useState(false);
  const account = hooks.useAccount();
  const [order, setOrder] = useState({
    type: TYPE.LIMIT,
    side: SIDE.BUY,
    amount: 0,
    price: 0
  });

  const createMarketOrder = async (amount, side) => {
    try {
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

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('Transaction failed.');
    }
  };

  const createLimitOrder = async (amount, price, side) => {
    try {
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

      const balances = await getBalances(user.account, user.selectedToken);
      setUser((user) => ({ ...user, balances }));

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('Transaction failed.');
    }
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (order.type === TYPE.MARKET) {
      createMarketOrder(web3.utils.toWei(order.amount), order.side);
    } else {
      createLimitOrder(
        web3.utils.toWei(order.amount),
        web3.utils.toWei(order.price, 'kwei'),
        order.side
      );
    }
  };

  return (
    <div className="p-12 sm:p-6 md:p-12 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 bg-gray-100/[.05] border rounded-2xl border-indigo-600">
      <h1 className="text-center text-xl md:text-2xl font-bold mb-8">
        New Order
      </h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mt-4">
          <div className="flex justify-center items-center">
            <Button
              type="button"
              className={`rounded-r-none uppercase w-1/2 ${
                order.type === TYPE.LIMIT ? 'bg-indigo-500' : ''
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, type: TYPE.LIMIT }))
              }
            >
              Limit
            </Button>
            <Button
              type="button"
              className={`rounded-l-none uppercase w-1/2 ${
                order.type === TYPE.MARKET ? 'bg-indigo-500' : ''
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, type: TYPE.MARKET }))
              }
            >
              Market
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-center items-center">
            <Button
              type="button"
              className={`rounded-r-none uppercase w-1/2 ${
                order.side === SIDE.BUY
                  ? 'bg-gradient-to-r from-indigo-700 to-pink-500'
                  : ''
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, side: SIDE.BUY }))
              }
            >
              Buy
            </Button>
            <Button
              type="button"
              className={`rounded-l-none uppercase w-1/2 ${
                order.side === SIDE.SELL
                  ? 'bg-gradient-to-r from-pink-500 to-red-700'
                  : ''
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, side: SIDE.SELL }))
              }
            >
              Sell
            </Button>
          </div>
        </div>
        <label className="block mt-4">
          <span>Amount</span>
          <input
            required
            type="number"
            step="1"
            min="1"
            name="amount"
            className="form-input mt-2 block w-full rounded-xl text-gray-900"
            placeholder={user.selectedToken.ticker}
            onChange={(e) =>
              e.target.value.length > 0 &&
              setOrder((order) => ({
                ...order,
                amount: e.target.value
              }))
            }
          />
        </label>

        {order.type === TYPE.MARKET ? null : (
          <label className="block mt-4">
            <span>Price</span>
            <input
              required
              type="number"
              step="0.001"
              min="0.001"
              name="price"
              className="form-input mt-2 block w-full rounded-xl text-gray-900"
              placeholder="USDC"
              onChange={(e) =>
                e.target.value.length > 0 &&
                setOrder((order) => ({
                  ...order,
                  price: e.target.value
                }))
              }
            />
          </label>
        )}

        {!loading ? (
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-800 w-full mt-4 uppercase"
          >
            Submit Order
          </Button>
        ) : (
          <Button
            className="flex justify-center cursor-progress w-full mt-4 uppercase"
            disabled
          >
            <div className="border-4 animate-spin w-6 h-6 border-b-4 border-b-purple-600 border-gray-200 rounded-full mr-2" />
            In process
          </Button>
        )}
      </form>
    </div>
  );
}
