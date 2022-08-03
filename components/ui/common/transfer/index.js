import { useState } from 'react';
import { Button } from '@components/ui/common';

const DIRECTION = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT'
};
export default function Transfer({ deposit, withdraw, user, web3 }) {
  const [direction, setDirection] = useState(DIRECTION.DEPOSIT);
  const [amount, setAmount] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    if (direction === DIRECTION.DEPOSIT) {
      deposit(amount);
    } else {
      withdraw(amount);
    }
  };

  return (
    <>
      <div className="w-full sm:w-1/2 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 p-12 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl border-indigo-600">
        <h1 className="text-center text-xl md:text-2xl font-bold mb-8">
          Transfer
        </h1>
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
                Deposit
              </Button>
              <Button
                type="button"
                className={`rounded-l-none w-1/2 font-bold sm:font-normal lg:font-bold ${
                  direction === DIRECTION.WITHDRAW ? 'bg-indigo-500' : ''
                }`}
                onClick={() => setDirection(DIRECTION.WITHDRAW)}
              >
                Withdraw
              </Button>
            </div>
            <label className="block mt-4">
              <span>Amount</span>
              <input
                className="form-input mt-2 block w-full rounded-xl text-gray-900"
                placeholder={`${user.selectedToken.ticker}`}
                onChange={(e) =>
                  e.target.value.length > 0 &&
                  setAmount(web3.utils.toWei(e.target.value))
                }
              />
            </label>
            <Button
              type="submit"
              className={'bg-indigo-600 hover:bg-indigo-800 w-full mt-4'}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
