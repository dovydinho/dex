import { useState } from 'react';
import { Button } from '@components/ui/common';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { useWeb3 } from '@components/web3';

const DIRECTION = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT'
};
export default function Transfer({
  contracts,
  setUser,
  user,
  web3,
  getBalances
}) {
  const { hooks } = useWeb3();

  const [direction, setDirection] = useState(DIRECTION.DEPOSIT);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const account = hooks.useAccount();

  const deposit = async (amount) => {
    try {
      await contracts[user.selectedToken.ticker].methods
        .approve(contracts.dex.options.address, amount)
        .send({ from: account.data });
      await contracts.dex.methods
        .deposit(amount, web3.utils.fromAscii(user.selectedToken.ticker))
        .send({ from: account.data });
      const balances = await getBalances(account.data, user.selectedToken);
      setUser((user) => ({ ...user, balances }));

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const withdraw = async (amount) => {
    try {
      await contracts.dex.methods
        .withdraw(amount, web3.utils.fromAscii(user.selectedToken.ticker))
        .send({ from: account.data });
      const balances = await getBalances(account.data, user.selectedToken);
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
    direction === DIRECTION.DEPOSIT ? deposit(amount) : withdraw(amount);
  };

  return (
    <>
      <div
        className={`w-full sm:w-1/2 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 p-12 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl ${
          user.selectedToken !== undefined
            ? 'border-indigo-600'
            : 'border-orange-600'
        }`}
      >
        <div
          className={`${
            user.selectedToken === undefined ? 'animate-pulse' : null
          }`}
        >
          <div className="flex justify-center items-center text-xl md:text-2xl font-bold mb-8">
            Wallet <SwitchHorizontalIcon className="pt-1 w-8 h-8" /> Exchange
          </div>
          <div className="mt-4">
            <form id="transfer" onSubmit={(e) => onSubmit(e)}>
              <div className="flex justify-center items-center">
                <Button
                  type="button"
                  className={`rounded-r-none uppercase w-1/2 font-bold sm:font-normal lg:font-bold ${
                    direction === DIRECTION.DEPOSIT ? 'bg-indigo-500' : ''
                  }`}
                  onClick={() => setDirection(DIRECTION.DEPOSIT)}
                >
                  to Exchange
                </Button>
                <Button
                  type="button"
                  className={`rounded-l-none w-1/2 uppercase font-bold sm:font-normal lg:font-bold ${
                    direction === DIRECTION.WITHDRAW ? 'bg-indigo-500' : ''
                  }`}
                  onClick={() => setDirection(DIRECTION.WITHDRAW)}
                >
                  to Wallet
                </Button>
              </div>
              <label className="block mt-4">
                <span>Amount</span>
                {web3 ? (
                  <input
                    required
                    type="number"
                    step="0.001"
                    min="1"
                    className="form-input mt-2 block w-full rounded-xl text-gray-900"
                    placeholder={`${
                      user.selectedToken !== undefined
                        ? user.selectedToken.ticker
                        : ''
                    }`}
                    onChange={(e) =>
                      e.target.value.length > 0 &&
                      setAmount(web3 && web3.utils.toWei(e.target.value))
                    }
                  />
                ) : null}
              </label>

              {!loading ? (
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-800 w-full uppercase mt-4"
                >
                  Transfer
                </Button>
              ) : (
                <Button
                  className="flex justify-center cursor-progress w-full uppercase mt-4"
                  disabled
                >
                  <div className="border-2 animate-spin w-6 h-6 border-b-2 border-b-gray-400 border-gray-100 rounded-full mr-2" />
                  In process
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
