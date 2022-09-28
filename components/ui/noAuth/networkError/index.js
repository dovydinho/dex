import { useWeb3 } from '@components/web3';

export default function NetworkError() {
  const { requireInstall, hooks } = useWeb3();

  const network = hooks.useNetwork();
  const account = hooks.useAccount();

  return (
    <>
      <div className="pb-4">
        {requireInstall && (
          <div className="animate-pulse w-80 sm:w-96 rounded-lg mx-auto p-4 bg-purple-500 text-gray-100 text-center">
            Cannot connect to network. Please install Metamask
          </div>
        )}

        {!network.isSupported && account.data && (
          <div className="animate-pulse w-80 sm:w-96 text-sm sm:text-base rounded-lg mx-auto p-4 bg-red-600 text-gray-100 text-center">
            <div>Connected to wrong network</div>
            <div>
              Please connect to: {` `}
              <span className="font-bold text-sm sm:text-base">
                {network.target}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
