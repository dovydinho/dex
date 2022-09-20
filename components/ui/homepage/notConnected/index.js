import { useWeb3 } from '@components/providers';
import { Navbar, Button } from '@components/ui/common';
import React from 'react';
import { ArrowCircleDownIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { useAccount } from '@components/hooks/web3';
import Image from 'next/image';
import Link from 'next/link';

export default function NotConnected() {
  const { connect, isLoading, requireInstall } = useWeb3();
  const { account } = useAccount();
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="w-full lg:w-4/5 xl:w-2/3 px-8 m-auto">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col w-full sm:w-1/2">
              <div className="items-center m-auto">
                <p className="text-3xl md:text-4xl xl:text-5xl font-bold leading-snug mb-8">
                  Decentralized <br />{' '}
                  <span className="text-5xl md:text-6xl xl:text-7xl">
                    Exchange
                  </span>
                </p>
                <p className="text-lg md:text-xl xl:text-3xl leading-snug mb-4 md:mb-8">
                  Operating on Ethereum{' '}
                  <span className="font-bold text-orange-400">testnet</span>{' '}
                  (Ropsten). <br />
                  Connect to Metamask to use.
                </p>

                <div className="flex">
                  {isLoading ? (
                    <Button
                      disabled
                      onClick={connect}
                      className="bg-gray-800 inline-flex rounded-full font-bold py-4 px-8"
                    >
                      <div className="animate-spin w-6 h-6 border-b-2 border-gray-100 rounded-full mr-2" />
                      Loading...
                    </Button>
                  ) : account.data ? (
                    <Link href="/">
                      <a>
                        <Button className="px-8 hover:text-gray-900 hover:bg-gray-100 font-bold inline-flex gap-2">
                          <Image
                            src="/img/avatarZoom.jpg"
                            width="25px"
                            height="25px"
                            className="rounded-full"
                            alt=""
                          />
                          {account.data.slice(2, 6) +
                            `-` +
                            account.data.slice(38, 42)}
                        </Button>
                      </a>
                    </Link>
                  ) : requireInstall ? (
                    <Button
                      onClick={() =>
                        window.open(
                          'https://metamask.io/download.html',
                          '_blank'
                        )
                      }
                      className="px-8 font-bold border-2 border-purple-400 rounded-full hover:text-gray-900 hover:bg-gray-100 bg-red-500 text-gray-100 inline-flex"
                    >
                      <div className="animate-bounce mr-2">
                        <ArrowCircleDownIcon className="w-6 h-6 m-auto" />
                      </div>
                      Install Metamask
                    </Button>
                  ) : (
                    <Button
                      onClick={connect}
                      className="px-8 font-bold border-2 border-purple-400 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    >
                      Connect to Metamask
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full sm:w-1/2">
              <div className="w-full items-center m-auto">
                <div className="grid grid-cols-2 gap-4 justify-items-center">
                  <div className="w-full text-center cursor-default hover:scale-105 border-2 border-purple-400 rounded-3xl p-4 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                    <Image
                      src="https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png"
                      layout="fixed"
                      width={50}
                      height={50}
                      alt="GRT"
                      className="rounded-full"
                    />
                    <p>The Graph</p>
                  </div>
                  <div className="w-full text-center cursor-default hover:scale-105 border-2 border-purple-400 rounded-3xl p-4 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                    <Image
                      src="https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png"
                      layout="fixed"
                      width={50}
                      height={50}
                      alt="LINK"
                      className="rounded-full"
                    />
                    <p>Chainlink</p>
                  </div>{' '}
                  <div className="w-full text-center cursor-default hover:scale-105 border-2 border-purple-400 rounded-3xl p-4 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                    <Image
                      src="https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png"
                      layout="fixed"
                      width={50}
                      height={50}
                      alt="MANA"
                      className="rounded-full"
                    />
                    <p>Decentraland</p>
                  </div>{' '}
                  <div className="w-full text-center cursor-default hover:scale-105 border-2 border-purple-400 rounded-3xl p-4 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                    <Image
                      src="https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg"
                      layout="fixed"
                      width={50}
                      height={50}
                      alt="SAND"
                      className="rounded-full"
                    />
                    <p>The Sandbox</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="py-8 text-center text-sm text-gray-200 uppercase">
          <p className="mb-2">
            Built by{' '}
            <Link href="https://dovydas.io">
              <a target="_blank" className="font-medium">
                dovydas.io
              </a>
            </Link>
          </p>
          <Link href="https://www.linkedin.com/in/dovydas-lapinskas">
            <a
              target="_blank"
              className="p-1 sm:px-2 sm:py-2 rounded-lg hover:bg-gray-200/[.25] dark:hover:bg-gray-800 transition-all"
            >
              <svg
                className="w-6 h-6 text-blue-500 fill-current hidden md:inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
              </svg>
            </a>
          </Link>
          <Link href="https://twitter.com/dovydinho">
            <a
              target="_blank"
              className="p-1 sm:px-2 sm:py-2 rounded-lg hover:bg-gray-200/[.25] dark:hover:bg-gray-800 transition-all"
            >
              <svg
                className="w-6 h-6 text-blue-300 fill-current hidden md:inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </Link>
        </section>
      </div>
    </>
  );
}
