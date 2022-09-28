import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Footer, Button } from '@components/ui/common';
import { ArrowCircleDownIcon } from '@heroicons/react/outline';
import { useWeb3 } from '@components/web3';

export default function NoAuthHomepage() {
  const { connect, isLoading, requireInstall, hooks } = useWeb3();
  const account = hooks.useAccount();
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
        <Footer />
      </div>
    </>
  );
}
