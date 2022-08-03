import { Web3Provider } from '@components/providers';

export default function MainLayout({ children }) {
  return (
    <Web3Provider>
      <div className="bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900 min-h-screen pb-8">
        {children}
      </div>
    </Web3Provider>
  );
}
