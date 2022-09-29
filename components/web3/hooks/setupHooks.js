import { handler as createAccountHook } from './useAccountHandler';
import { handler as createNetworkHook } from './useNetworkHandler';

export const setupHooks = ({ web3, provider }) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3, provider)
  };
};
