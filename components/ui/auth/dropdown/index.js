import { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/outline';

import { Button } from '@components/ui/common';

export default function Dropdown({ onSelect, activeItem, tokens }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const selectItem = (e, item) => {
    e.preventDefault();
    setDropdownVisible(!dropdownVisible);
    onSelect(item);
  };
  const dropdownMenu = useRef(null);
  const closeOpenDropdown = (e) => {
    if (
      dropdownMenu.current &&
      dropdownVisible &&
      !dropdownMenu.current.contains(e.target)
    ) {
      setDropdownVisible(false);
    }
  };
  document.addEventListener('mousedown', closeOpenDropdown);

  return (
    <>
      <h1 className="text-lg sm:text-xl mt-4 mb-2">Select Token:</h1>
      <div className="static" ref={dropdownMenu}>
        <Button
          className="px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex text-lg border-purple-500 hover:scale-110"
          onClick={() => {
            setDropdownVisible(!dropdownVisible);
          }}
        >
          {activeItem ? activeItem.label : 'Select Here'}
          {dropdownVisible ? (
            <ChevronLeftIcon className="ml-2 mt-1 w-5 h-5" />
          ) : (
            <ChevronDownIcon className="ml-2 mt-1 w-5 h-5" />
          )}
        </Button>

        <div
          className={`${
            dropdownVisible ? '' : 'hidden'
          } absolute z-10 bg-purple-900 rounded-2xl overflow-hidden w-44`}
        >
          <ul
            className="divide-y divide-purple-500 text-sm text-gray-100"
            aria-labelledby="dropdownDefault"
          >
            {tokens &&
              tokens.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="block px-10 py-4 hover:bg-purple-500 text-lg"
                    onClick={(e) => selectItem(e, item.value)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
