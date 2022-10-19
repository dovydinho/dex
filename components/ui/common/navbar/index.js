import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@components/ui/common';
import { Dropdown } from '@components/ui/auth';
import { NetworkError } from '@components/ui/noAuth';
import { ArrowCircleDownIcon } from '@heroicons/react/outline';
import { useWeb3 } from '@components/web3';

export default function Navbar({ tokens, user, selectToken }) {
  const { connect, isLoading, requireInstall, hooks } = useWeb3();
  const account = hooks.useAccount();

  const refreshPage = () => {
    return window.location.reload();
  };

  return (
    <>
      <nav className="pt-4 md:pt-8 pb-2 md:pb-4 font-medium text-white">
        <div className="flex flex-wrap justify-between items-center mx-auto px-8">
          <Link href="/">
            <a className="flex items-center gap-2">
              <Image
                src="/img/avatar.jpg"
                width="50px"
                height="50px"
                className="rounded-full w-10 h-10"
                alt=""
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap hidden md:block uppercase ">
                Decentralized Exchange App
              </span>
            </a>
          </Link>
          <div className="flex lg:order-2">
            {isLoading ? (
              <Button
                disabled
                onClick={connect}
                className="px-6 py-2 bg-gray-800 inline-flex"
              >
                <div className="animate-spin w-6 h-6 border-b-2 border-gray-100 rounded-full mr-2" />
                Loading...
              </Button>
            ) : account.data ? (
              <>
                <Button
                  className="px-6 py-2 hover:text-gray-900 hover:bg-gray-100 inline-flex gap-2"
                  onClick={refreshPage}
                >
                  <Image
                    src="/img/avatarZoom.jpg"
                    width="25px"
                    height="25px"
                    className="rounded-full"
                    alt=""
                  />
                  {account.data.slice(2, 6) + `-` + account.data.slice(38, 42)}
                </Button>
              </>
            ) : requireInstall ? (
              <Button
                onClick={() =>
                  window.open('https://metamask.io/download.html', '_blank')
                }
                className="px-6 py-2 hover:text-gray-900 hover:bg-gray-100 bg-red-500 text-gray-100 inline-flex"
              >
                <div className="animate-bounce mr-2">
                  <ArrowCircleDownIcon className="w-6 h-6 m-auto" />
                </div>
                Install Metamask
              </Button>
            ) : (
              <Button
                className="px-6 py-2 border-purple-400 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                onClick={connect}
              >
                Connect to Metamask
              </Button>
            )}
          </div>
        </div>

        {tokens && tokens.length > 0 && (
          <div className="grid place-items-center">
            <Dropdown
              tokens={tokens.map((token) => ({
                label: token.ticker,
                value: token
              }))}
              activeItem={{
                label: user.selectedToken.ticker,
                value: user.selectedToken
              }}
              onSelect={selectToken}
            />
          </div>
        )}
      </nav>

      <NetworkError />
    </>
  );
}
