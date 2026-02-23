
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 py-6 mt-8">
      <div className="container mx-auto px-4">
        {/* Flex container for the main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left Section: Copyright and Links */}
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Quranify. MIT Licences | Opensource.
            </p>
            <div className="mt-2 space-x-4">
              <a href="/about" className="text-sm hover:text-blue-700 dark:hover:text-blue-400">
                About
              </a>
              <a href="/contact" className="text-sm hover:text-blue-700 dark:hover:text-blue-400">
                Contact
              </a>
              <a href="/privacy" className="text-sm hover:text-blue-700 dark:hover:text-blue-400">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Middle Section: Attribution */}
          <div className="text-center">
            <p className="text-sm">
              Audio by{' '}
              <a
                href="https://alquran.cloud/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Al-Quran Cloud
              </a>
              {', '}
              <a
                href="https://everyayah.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                EveryAyah
              </a>
              {' '}&amp;{' '}
              <a
                href="https://quranapi.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                QuranAPI
              </a>
              . Font by{' '}
              <a
                href="https://github.com/alif-type/amiri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Amiri Quran
              </a>
              .
            </p>
          </div>

          {/* Right Section: Social Media Links */}
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/EasyCanadianGamer/quranify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://x.com/C_G_2_3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com/in/eyadm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Version 1.0.0 | Built with ❤️ using Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
