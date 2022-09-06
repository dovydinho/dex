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
      <div className="flex h-screen flex-col">
        <Navbar />
        <div className="m-auto">
          <div className=" sm:flex gap-8 text-gray-100">
            <div className="w-full sm:w-1/2">
              <p className="text-4xl lg:text-6xl font-bold leading-snug mb-8">
                Decentralized <br />{' '}
                <span className="text-6xl lg:text-8xl">Exchange</span>
              </p>
              <p className="text-2xl xl:text-3xl leading-snug mb-8">
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
                      window.open('https://metamask.io/download.html', '_blank')
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
            <div className="py-12 w-full sm:w-1/2">
              <div className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-8">
                <div className="cursor-pointer hover:scale-105 flex h-24 border-2 border-purple-400 rounded-3xl p-4 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 duration-300">
                  <div className="m-auto">
                    <div className="grid grid-cols-2">
                      <Image
                        src="https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png"
                        layout="fixed"
                        width={50}
                        height={50}
                        alt=""
                      />
                      <div>
                        <p>The Grapth</p>
                        <p className="font-bold">GRT</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cursor-pointer hover:scale-105 flex h-24 border-2 border-purple-400 rounded-3xl p-4 text-center bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                  <div className="m-auto">
                    <div className="grid grid-cols-2">
                      <Image
                        src="https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png"
                        layout="fixed"
                        width={50}
                        height={50}
                        alt=""
                      />
                      <div>
                        <p>Chainlink</p>
                        <p className="font-bold">LINK</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cursor-pointer hover:scale-105 flex h-24 border-2 border-purple-400 rounded-3xl p-4 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 duration-300">
                  <div className="m-auto">
                    <div className="grid grid-cols-2">
                      <Image
                        src="https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png"
                        layout="fixed"
                        width={50}
                        height={50}
                        alt=""
                      />
                      <div>
                        <p>Decentraland</p>
                        <p className="font-bold">MANA</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cursor-pointer hover:scale-105 flex h-24 border-2 border-purple-400 rounded-3xl p-4 text-center bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 duration-300">
                  <div className="m-auto">
                    <div className="grid grid-cols-2">
                      <Image
                        src="https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg"
                        layout="fixed"
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-full"
                      />
                      <div>
                        <p className="invisible sm:visible">The Sandbox</p>
                        <p className="font-bold">SAND</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-lg font-bold italic my-4">
                Dummy Tokens Available on Exchange
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
