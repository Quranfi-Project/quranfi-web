import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle, FaCog, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import word from "../assets/Quranfi(word).svg";
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [user] = useState<any>(null); // Always null for now (no auth system)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md relative">
      <div className="container mx-auto p-4 flex items-center">

        {/* Left hamburger */}
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900 mr-4"
          aria-label="Toggle sidebar"
        >
          <RxHamburgerMenu size={24} />
        </button>

        {/* Center logo */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <img src={word} style={{ height: '100px', width: 'auto' }} alt="Quranify" />
          </Link>
        </div>

        {/* Right authentication (guest only) 
        <div className="flex justify-end" ref={dropdownRef}>
          {/* Guest mode *
          {!user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <FaUserCircle className="mr-2" />
                Account
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>*/}

      </div>
    </header>
  );
};

export default Header;
