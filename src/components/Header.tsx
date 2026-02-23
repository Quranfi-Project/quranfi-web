'use client'

import Link from 'next/link';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaMoon, FaSun } from 'react-icons/fa';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header = ({ toggleSidebar, toggleDarkMode, isDarkMode }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md relative">
      <div className="container mx-auto p-4 flex items-center">

        {/* Left hamburger */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
          aria-label="Toggle sidebar"
        >
          <RxHamburgerMenu size={24} />
        </button>

        {/* Center logo */}
        <div className="flex-1 flex justify-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            <img src="/quranfi-word.svg" style={{ height: '100px', width: 'auto' }} alt="Quranify" />
          </Link>
        </div>

        {/* Right dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="ml-4 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

      </div>
    </header>
  );
};

export default Header;
