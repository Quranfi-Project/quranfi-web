import Link from 'next/link';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">About Quranify</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Connecting hearts with the Holy Quran</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12 border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Quranify aims to provide a modern, accessible platform for engaging with the Holy Quran.
            We combine traditional Islamic knowledge with contemporary technology to create a seamless
            experience for Muslims worldwide.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 mb-6">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Clean, distraction-free reading experience</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Multiple translations and tafsirs</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Mobile-friendly design</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Advanced search functionality</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Bookmarking and note-taking</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700 dark:text-gray-300">Regular content updates</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-12 border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">The Founder</h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {/* Placeholder for founder image - replace with your actual image */}
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-4xl text-blue-600 dark:text-blue-300">
                EM
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Eyad M</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Software developer and Muslim entrepreneur passionate about creating technology
                solutions that serve the Ummah. With a background in both computer science and
                Islamic studies, I envisioned Quranify as a bridge between tradition and modernity.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/eyadm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FaLinkedin className="mr-2" size={20} />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/EasyCanadianGamer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <FaGithub className="mr-2" size={20} />
                  GitHub
                </a>
                <a
                  href="https://quranify.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  <FaGlobe className="mr-2" size={20} />
                  Quranify.xyz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions, suggestions, or feedback? We&apos;d love to hear from you!
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">General Inquiries</h3>
              <a href="mailto:contact@quranify.xyz" className="text-blue-600 dark:text-blue-400 hover:underline">
                contact@quranify.xyz
              </a>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Technical Support</h3>
              <a href="mailto:support@quranify.xyz" className="text-blue-600 dark:text-blue-400 hover:underline">
                support@quranify.xyz
              </a>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Connect</h3>
              <Link href="/roadmap" className="text-blue-600 dark:text-blue-400 hover:underline">
                View our Roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
