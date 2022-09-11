import LoadingSpinner from '../loadingSpinner';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function AllTrades({ trades, user, web3 }) {
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const [displayTrades, setDisplayTrades] = useState([]);
  const [slice, setSlice] = useState(10);
  const [tradesRange, setTradesRange] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);

  const [tradePrices, setTradePrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trades.length > 5 ? setTradesRange(4) : undefined;
  }, [trades.length]);

  const state = {
    series: [
      {
        name: 'Price',
        data: tradePrices
      }
    ],
    options: {
      chart: {
        type: 'line',
        stacked: false,
        zoom: {
          enabled: false
        },
        background: 'rgba(0,0,0,.25)',
        stroke: {
          curve: 'smooth'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        borderColor: '#6b7280',
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          bottom: 10
        }
      },
      markers: {
        colors: ['#9C27B0'],
        size: 3
      },
      xaxis: {
        range: tradesRange,
        labels: {
          style: {
            colors: '#fff'
          }
        },
        axisBorder: {
          show: true,
          color: '#fff'
        },
        title: {
          text: 'Trade #',
          style: {
            color: '#fff',
            fontWeight: 'light',
            cssClass: 'text-sm'
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: [
        {
          labels: {
            formatter: function (value) {
              return Number(value).toFixed(1) + ' USDC';
            },
            style: {
              colors: '#fff'
            }
          },
          axisBorder: {
            show: true,
            color: '#fff'
          }
        }
      ],
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div className="px-4 py-2">Trade fulfilled at ' +
            series[seriesIndex][dataPointIndex] +
            ' USDC per </span>' +
            user.selectedToken.ticker +
            '</div>'
          );
        }
      }
    }
  };

  useEffect(() => {
    setTradePrices([]);
    setDisplayTrades([]);

    setLoading(true);

    trades.map((trade) => {
      setTradePrices((tradePrices) => [
        ...tradePrices,
        web3.utils.fromWei(trade.price, 'kwei')
      ]);
    });

    setSlice(10);

    setDisplayTrades(
      trades.slice(0, slice).map(function (trade, i) {
        return (
          <tr className="bg-white border-b" key={i}>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {Math.round(web3.utils.fromWei(trade.amount, 'ether') * 100) /
                100}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {Math.round(web3.utils.fromWei(trade.price, 'kwei') * 100) / 100}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              <Moment fromNow>{parseInt(trade.date) * 1000}</Moment>
            </td>
          </tr>
        );
      })
    );

    setHasMore(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [user.selectedToken, trades]);

  const addSlice = () => {
    setTimeout(() => {
      setDisplayTrades([...displayTrades, ...nextSlice()]);

      setSlice(slice + 3);
      if (slice >= trades.length) setHasMore(false);
    }, 1500);
  };

  const nextSlice = () => {
    return trades.slice(slice, slice + 3).map(function (trade, i) {
      return (
        <tr className="bg-white border-b" key={i}>
          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {Math.round(web3.utils.fromWei(trade.amount, 'ether') * 100) / 100}
            {/* {trade.amount} */}
          </td>
          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            {Math.round(web3.utils.fromWei(trade.price, 'kwei') * 100) / 100}
            {/* {trade.price} */}
          </td>
          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
            <Moment fromNow>{parseInt(trade.date) * 1000}</Moment>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="w-full hover:bg-indigo-500/[.25] duration-300 sm:p-6 md:p-12 bg-gray-100/[.05] border rounded-2xl border-indigo-600">
        <h2 className="text-center text-xl md:text-2xl font-bold mb-8">
          All Trades
        </h2>
        {trades.length > 0 ? (
          <div className="mb-6">
            {loading === true ? (
              <LoadingSpinner />
            ) : (
              <>
                <div id="chartContainer">
                  <Chart
                    options={state.options}
                    series={state.series}
                    height={450}
                  />
                </div>
                <div className="max-h-[400px] overflow-auto" id="scrollableDiv">
                  <InfiniteScroll
                    dataLength={displayTrades.length}
                    next={addSlice}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    loader={
                      trades.length > 10 && (
                        <div className="flex justify-center items-center p-2 bg-white">
                          <svg
                            role="status"
                            className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      )
                    }
                  >
                    <table className="w-full bg-gray-500">
                      <thead className="bg-white border-b">
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
                      <tbody>{displayTrades}</tbody>
                    </table>
                  </InfiniteScroll>
                </div>
              </>
            )}
          </div>
        ) : (
          !loading && (
            <h1 className="italic text-center py-6">
              There are no trades for this Token.
            </h1>
          )
        )}
      </div>
    </>
  );
}
