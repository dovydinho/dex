import { Button } from '@components/ui/common';
// import Router from 'next/router';

export default function Seed({ web3, contracts, user, getBalances, setUser }) {
  const amount = web3.utils.toWei('10');

  const onSubmit = (e) => {
    e.preventDefault();
    seedTokenBalance(contracts.USDC, user.account.data);
  };

  const seedTokenBalance = async (token, trader) => {
    await token.methods.faucet(trader, amount).send({
      from: trader
    });

    // await token.methods.approve(contracts.dex._address, amount).send({
    //   from: trader
    // });

    // const ticker = await token.methods.symbol().call();

    // await contracts.dex.methods
    //   .deposit(amount, web3.utils.fromAscii(ticker))
    //   .send({
    //     from: trader
    //   });

    const balances = await getBalances(user.account.data, user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  return (
    <>
      <div className="text-center font-bold py-12 bg-gray-500/[0.05] hover:bg-indigo-500/[0.25] duration-300 rounded-2xl border border-purple-500">
        <div className="w-3/5 mx-auto">
          <p className="text-4xl ">Seed USDC</p>
          <h1 className="text-6xl mb-6 ">for Testing</h1>
          <form id="transfer" onSubmit={(e) => onSubmit(e)}>
            <Button
              type="submit"
              className="mx-auto text-2xl px-12 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-purple-500 hover:scale-110"
            >
              Get 10 USDC
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
