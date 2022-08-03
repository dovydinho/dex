import { Dropdown } from '@components/ui/common';

export default function Header({ tokens, user, selectToken }) {
  return (
    <nav className="pt-8 pb-4 font-medium text-white">
      <div className="flex flex-wrap justify-between items-center mx-auto px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="self-center text-xl font-semibold whitespace-nowrap hidden md:block">
            Decentralized Exchange App
          </span>
        </a>
        <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-4 lg:mt-0 lg:text-base lg:font-medium">
          <li className="pt-2">Token to Trade:</li>
          <li>
            {tokens.length > 0 && (
              <Dropdown
                items={tokens.map((token) => ({
                  label: token.ticker,
                  value: token
                }))}
                activeItem={{
                  label: user.selectedToken.ticker,
                  value: user.selectedToken
                }}
                onSelect={selectToken}
              />
            )}
          </li>
        </ul>
        <div>
          {user.accounts[0].slice(2, 6) + `-` + user.accounts[0].slice(38, 42)}
        </div>
      </div>
    </nav>
  );
}
