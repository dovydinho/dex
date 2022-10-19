import { useState } from 'react';
import { Button } from '@components/ui/common';

export default function Seed({ web3, contracts, user, getBalances, setUser }) {
  const [loading, setLoading] = useState(false);
  const amount = web3.utils.toWei('10');

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    seedTokenBalance(contracts.USDC, user.account);
  };

  const seedTokenBalance = async (token, trader) => {
    try {
      await token.methods.faucet(trader, amount).send({
        from: trader
      });
      const balances = await getBalances(user.account, user.selectedToken);
      setUser((user) => ({ ...user, balances }));

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('Transaction failed.');
    }
  };

  return (
    <>
      <div className="text-center font-bold py-12 bg-gray-500/[0.05] hover:bg-indigo-500/[0.25] duration-300 rounded-2xl border border-purple-500">
        <div className="w-3/5 mx-auto">
          <p className="text-4xl ">Seed USDC</p>
          <h1 className="text-6xl mb-6 ">for Testing</h1>
          <form id="transfer" onSubmit={(e) => onSubmit(e)}>
            {!loading ? (
              <Button
                type="submit"
                className="flex mx-auto uppercase text-2xl px-12 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-purple-500 hover:scale-110"
              >
                Get 10 USDC
              </Button>
            ) : (
              <Button
                className="flex mx-auto uppercase text-2xl px-12 py-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 border-purple-500 cursor-progress"
                disabled
              >
                <div className="border-2 animate-spin w-8 h-8 border-b-2 border-b-gray-400 border-gray-100 rounded-full mr-2" />
                In process
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
