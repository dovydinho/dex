import { useNetwork } from '@components/hooks/web3';
import { EmojiSadIcon } from '@heroicons/react/outline';

export default function NetworkError() {
  const { network } = useNetwork();

  return (
    <>
      <div className="min-h-screen grid content-center">
        <div className="animate-pulse w-96 rounded-lg mx-auto p-4 bg-red-600/[.9] text-gray-100 text-center shadow-2xl">
          <EmojiSadIcon className="w-10 h-10 mx-auto" />
          <div className="font-bold text-xl mt-4 mb-8">
            Connected to the wrong network
          </div>
          <div>
            Please connect to: {` `}
            <span className="font-bold text-xl">{network.target}</span>
          </div>
        </div>
      </div>
    </>
  );
}
