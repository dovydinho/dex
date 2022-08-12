import { Web3Provider } from '@components/providers';
import Link from 'next/link';

export default function MainLayout({ children }) {
  return (
    <Web3Provider>
      <div className="bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900 min-h-screen pb-8">
        {children}

        <div className="relative bottom-0 w-full text-center pt-8 text-purple-400">
          <p className="text-center">
            Open source code available on{' '}
            <Link href="https://github.com/dovydinho/dex">
              <a
                target="_blank"
                className="font-medium border-dashed hover:border-b hover:border-b-2 border-purple-200"
              >
                GitHub
              </a>
            </Link>
            <br />
            Built by{' '}
            <span className="font-medium">
              <Link href="https://dovydas.io">
                <a
                  target="_blank"
                  className="border-dashed hover:border-b hover:border-b-2 border-purple-200"
                >
                  dovydas.io
                </a>
              </Link>
            </span>
          </p>
        </div>
      </div>
    </Web3Provider>
  );
}
