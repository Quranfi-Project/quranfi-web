import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: February 2025</p>
      </div>

      <div className="space-y-6">

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Overview</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Quranify is a free, open-source Quran reading and listening app. Your privacy is important
            to us — we have designed this app to collect as little data as possible.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Data We Collect</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            <strong className="text-gray-700 dark:text-gray-300">We collect nothing from you.</strong> There are
            no user accounts, no sign-ups, no tracking pixels, and no analytics scripts.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            All data — bookmarks, reading preferences, dark mode settings — is stored exclusively in
            your browser&apos;s <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">localStorage</code> and{' '}
            <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-sm">IndexedDB</code>.
            It never leaves your device.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            To fetch Quran text and audio, the app makes requests to these external services:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://alquran.cloud/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">Al-Quran Cloud</a>
                {' '}— Quran text &amp; verse audio
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>
                <a href="https://everyayah.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline">EveryAyah</a>
                {' '}— Additional reciter audio
              </span>
            </li>
          </ul>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-3 leading-relaxed">
            These services may log standard HTTP request data (IP address, timestamp) as part of
            normal server operations. Please review their respective privacy policies for details.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We do not use cookies. No tracking cookies, session cookies, or advertising cookies
            are set by this application.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Open Source</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Quranify is fully open source. You can inspect exactly what the app does in our{' '}
            <a
              href="https://github.com/Quranfi-Project/quranfi-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub repository
            </a>.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Changes to This Policy</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If this policy changes, the updated version will be posted on this page with a revised date.
            Continued use of the app constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Contact</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Questions about this policy?{' '}
            <a href="mailto:privacy@quranify.xyz" className="text-blue-600 dark:text-blue-400 hover:underline">
              privacy@quranify.xyz
            </a>
          </p>
        </section>

      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
