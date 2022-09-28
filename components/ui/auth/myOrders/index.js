import { XCircleIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';

export default function MyOrders({ contracts, orders, user, web3 }) {
  const cancelOrder = async (e, _ticker, _side, _id) => {
    e.preventDefault();
    await contracts.dex.methods
      .deleteOrder(_ticker, _side, _id)
      .send({ from: user.account });
  };
  const renderList = (orders, side) => {
    return (
      <>
        <div className="flex flex-col">
          <div className="inline-block min-w-full">
            <table className="min-w-full border border-indigo-400 rounded-xl">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    colSpan="3"
                    className={`px-6 py-4 ${
                      side === 'Buy'
                        ? 'bg-gradient-to-r from-indigo-700 to-pink-500'
                        : 'bg-gradient-to-r from-red-700 to-pink-500'
                    }`}
                  >
                    {side}
                  </th>
                </tr>

                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Amount, {user.selectedToken.ticker}
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Price, USDC
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="bg-white border-b" key={order.id}>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {web3.utils.fromWei(
                        web3.utils.toBN(order.amount - order.filled),
                        'ether'
                      )}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {web3.utils.fromWei(web3.utils.toBN(order.price), 'kwei')}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <Moment fromNow>{parseInt(order.date) * 1000}</Moment>
                        <form
                          onSubmit={(e) =>
                            cancelOrder(e, order.ticker, order.side, order.id)
                          }
                        >
                          <button className="ml-4" type="submit">
                            <XCircleIcon className="text-red-500 w-7 h-7 hover:cursor-pointer hover:scale-125 duration-300" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="py-12 sm:py-6 md:py-12 hover:bg-indigo-500/[.25] duration-300 bg-gray-100/[.05] border rounded-2xl border-indigo-600">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-8">
          My Orders for {user.selectedToken.ticker}
        </h2>
        {orders.buy.length > 0 ? (
          <div>{renderList(orders.buy, 'Buy')}</div>
        ) : (
          <h1 className="italic text-center py-6">You have no Buy orders.</h1>
        )}
        {orders.sell.length > 0 ? (
          <div>{renderList(orders.sell, 'Sell')}</div>
        ) : (
          <h1 className="italic text-center py-6">You have no Sell orders.</h1>
        )}
      </div>
    </>
  );
}
