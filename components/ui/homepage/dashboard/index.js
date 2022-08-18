import { AllTrades } from '@components/ui/common';

export default function Dashboard({ user, tokens, trades, web3, selectToken }) {
  const selectItem = (e, item) => {
    e.preventDefault();
    selectToken(item);
  };
  return (
    <>
      <div className="hover:bg-indigo-500/[.25] duration-300 mb-8 py-12 sm:py-6 md:py-12 bg-gray-100/[.05] border rounded-2xl border-indigo-600">
        {user.selectedToken.ticker !== 'USDC' ? (
          <AllTrades trades={trades} user={user} web3={web3} />
        ) : (
          <>
            <h1 className="text-center text-xl md:text-2xl font-bold mb-8">
              Listed Tokens
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-8">
              {tokens.map((token, i) =>
                token.ticker !== 'USDC' ? (
                  <div
                    key={i}
                    className="hover:-translate-y-1 hover:scale-105 flex h-24 border border-2 border-purple-400 rounded-3xl p-4 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 duration-300 cursor-pointer"
                    onClick={(e) => selectItem(e, token)}
                  >
                    <div className="m-auto">
                      <p className="text-3xl font-bold">{token.ticker}</p>
                      <p className="text-sm">
                        {token.tokenAddress.slice(2, 6) +
                          `-` +
                          token.tokenAddress.slice(38, 42)}
                      </p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
