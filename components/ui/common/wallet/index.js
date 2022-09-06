import { useEffect, useState } from 'react';

export default function Wallet({ web3, user, account }) {
  const [tokenWallet, setTokenWallet] = useState(0);
  const [tokenDex, setTokenDex] = useState(0);
  useEffect(() => {
    web3 &&
      user.balances.tokenWallet &&
      account.data !== null &&
      setTokenWallet(web3.utils.fromWei(user.balances.tokenWallet, 'ether'));
    web3 &&
      user.balances.tokenDex &&
      account.data !== null &&
      setTokenDex(web3.utils.fromWei(user.balances.tokenDex, 'ether'));
  }, [user, account]);

  return (
    <>
      <div
        className={`w-full sm:w-1/2 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 p-12 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl ${
          user.selectedToken !== undefined
            ? 'border-indigo-600'
            : 'border-orange-600'
        } mb-8 sm:mb-0`}
      >
        <div
          className={`${
            user.selectedToken === undefined ? 'animate-pulse' : null
          }`}
        >
          <h1 className="text-center text-xl md:text-2xl font-bold mb-8">
            Token
          </h1>
          <h1 className="text-4xl font-bold mb-6">
            {user.selectedToken !== undefined ? (
              user.selectedToken.ticker
            ) : (
              <div className="bg-slate-600 rounded-lg h-10 w-24" />
            )}
          </h1>

          <div className="grid grid-cols-2 divide-x divide-gray-600">
            <div className="col">
              <h1 className="text-gray-400 uppercase font-bold">Wallet</h1>
              <h1 className="text-lg">
                {user.selectedToken !== undefined ? (
                  Number(tokenWallet).toFixed(3)
                ) : (
                  <div className="bg-slate-600 rounded-lg h-6 w-16 mt-1" />
                )}
              </h1>
            </div>
            <div className="col px-4">
              <h1 className="text-gray-400 uppercase font-bold">Exchange</h1>
              <h1 className="text-lg">
                {user.selectedToken !== undefined ? (
                  Number(tokenDex).toFixed(3)
                ) : (
                  <div className="bg-slate-600 rounded-lg h-6 w-16 mt-1" />
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
