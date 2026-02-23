'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 ' +
    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ' +
    'placeholder-gray-400 dark:placeholder-gray-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400">Have a question or feedback? We&apos;d love to hear from you.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">

        {status === 'success' ? (
          <div className="text-center py-12">
            <FaCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Message sent!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We&apos;ll get back to you as soon as possible.</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                <FaExclamationCircle size={16} className="shrink-0" />
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select a topic…</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Audio / Reciter Issue">Audio / Reciter Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us what's on your mind…"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg
                bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-medium transition-colors"
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPaperPlane size={14} />
              )}
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>

          </form>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Or email us directly at{' '}
        <a href="mailto:contact@quranify.xyz" className="text-blue-600 dark:text-blue-400 hover:underline">
          contact@quranify.xyz
        </a>
      </div>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Contact;
