'use client'

import { useRouter, usePathname } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { FaHome, FaBookmark, FaPray, FaRoad, FaInfoCircle, FaBookOpen } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { label: "Home", path: "/", icon: FaHome, matchPrefix: false },
  { label: "Read", path: "/read", icon: FaBookOpen, matchPrefix: true },
  { label: "Bookmarks", path: "/bookmarks", icon: FaBookmark, matchPrefix: false },
  { label: "Duas", path: "/dua", icon: FaPray, matchPrefix: false },
  { label: "Roadmap", path: "/roadmap", icon: FaRoad, matchPrefix: false },
  { label: "About", path: "/about", icon: FaInfoCircle, matchPrefix: false },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    toggleSidebar();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-0.5">Navigation</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quranfi</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon, matchPrefix }) => {
            const active = matchPrefix ? pathname.startsWith(path) : pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Icon size={18} className={active ? "text-blue-500 dark:text-blue-400" : ""} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400 dark:text-gray-600">
            Read & listen to the Holy Quran
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
