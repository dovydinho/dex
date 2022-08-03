export default function Wallet({ user, web3 }) {
  const tokenWallet = web3.utils.fromWei(user.balances.tokenWallet, 'ether');
  const tokenDex = web3.utils.fromWei(user.balances.tokenDex, 'ether');

  return (
    <>
      <div className="w-full sm:w-1/2 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500/[.25] duration-300 p-12 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl border-indigo-600 mb-8 sm:mb-0">
        <h1 className="text-center text-xl md:text-2xl font-bold mb-8">
          Token
        </h1>
        <h1 className="text-4xl font-bold mb-6">{user.selectedToken.ticker}</h1>

        <div className="grid grid-cols-2 divide-x divide-gray-600">
          <div className="col">
            <h1 className="text-gray-400">Wallet</h1>
            <h1 className="text-lg">{Number(tokenWallet).toFixed(3)}</h1>
          </div>
          <div className="col px-4">
            <h1 className="text-gray-400">Exchange</h1>
            <h1 className="text-lg">{Number(tokenDex).toFixed(3)}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
