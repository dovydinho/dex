import { useEffect, useState } from 'react';
import { Button } from '@components/ui/common';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';

const DIRECTION = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT'
};
export default function Transfer({ deposit, withdraw, user, web3 }) {
  const [direction, setDirection] = useState(DIRECTION.DEPOSIT);
  const [amount, setAmount] = useState(0);
  const [userToken, setUserToken] = useState(undefined);

  useEffect(() => {
    setUserToken(user.selectedToken);
  }, [user.selectedToken, userToken]);

  const onSubmit = (e) => {
    e.preventDefault();
    userToken !== undefined
      ? direction === DIRECTION.DEPOSIT
        ? deposit(amount)
        : withdraw(amount)
      : null;
  };

  return (
    <>
      <div
        className={`w-full sm:w-1/2 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 p-12 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl ${
          userToken !== undefined ? 'border-indigo-600' : 'border-orange-600'
        }`}
      >
        <div className={`${userToken === undefined ? 'animate-pulse' : null}`}>
          {/* <h1 className="text-center text-xl md:text-2xl font-bold">Transfer</h1> */}
          <div className="flex justify-center items-center text-xl md:text-2xl font-bold mb-8">
            Wallet <SwitchHorizontalIcon className="pt-1 w-8 h-8" /> Exchange
          </div>
          <div className="mt-4">
            <form id="transfer" onSubmit={(e) => onSubmit(e)}>
              <div className="flex justify-center items-center">
                <Button
                  type="button"
                  className={`rounded-r-none w-1/2 font-bold sm:font-normal lg:font-bold ${
                    direction === DIRECTION.DEPOSIT ? 'bg-indigo-500' : ''
                  }`}
                  onClick={() => setDirection(DIRECTION.DEPOSIT)}
                >
                  to Exchange
                </Button>
                <Button
                  type="button"
                  className={`rounded-l-none w-1/2 font-bold sm:font-normal lg:font-bold ${
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
                    type="number"
                    className="form-input mt-2 block w-full rounded-xl text-gray-900"
                    placeholder={`${
                      userToken !== undefined ? userToken.ticker : ''
                    }`}
                    onChange={(e) =>
                      e.target.value.length > 0 &&
                      setAmount(web3 && web3.utils.toWei(e.target.value))
                    }
                  />
                ) : null}
              </label>

              {userToken !== undefined ? (
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-800 w-full mt-4"
                >
                  Transfer
                </Button>
              ) : (
                <Button className="cursor-not-allowed w-full mt-4">
                  Transfer
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
