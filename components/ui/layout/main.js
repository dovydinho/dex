import { Web3Provider } from '@components/providers';
import Link from 'next/link';

export default function MainLayout({ children }) {
  return (
    <Web3Provider>
      <div className="bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900 min-h-screen">
        <div className="container">{children}</div>
      </div>
    </Web3Provider>
  );
}
