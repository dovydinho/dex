import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@components/ui/common';

export default function AllTradesChart({ trades, user, web3 }) {
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const [tradesRange, setTradesRange] = useState(undefined);
  const [tradePrices, setTradePrices] = useState([]);

  const [loading, setLoading] = useState(true);

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
        // background: 'rgba(0,0,0,.25)',
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
          //   bottom: 10
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
    setLoading(true);
    setTradePrices([]);

    trades.length > 5 ? setTradesRange(4) : undefined;

    trades.map((trade) => {
      setTradePrices((tradePrices) => [
        ...tradePrices,
        web3.utils.fromWei(trade.price, 'kwei')
      ]);
    });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [trades.length]);

  useEffect(() => {
    setLoading(true);
    setTradePrices([]);

    trades.map((trade) => {
      setTradePrices((tradePrices) => [
        ...tradePrices,
        web3.utils.fromWei(trade.price, 'kwei')
      ]);
    });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {trades.length > 0 && (
        <div className="mb-6">
          {loading === true ? (
            <LoadingSpinner
              additionalClass={'rounded-2xl h-[497px] bg-black/[.25]'}
            />
          ) : (
            <>
              <div
                id="chartContainer"
                className="bg-black/[.25] p-4 rounded-2xl"
              >
                <Chart
                  options={state.options}
                  series={state.series}
                  height={450}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
