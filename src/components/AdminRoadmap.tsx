'use client'

import { useState, useEffect, useCallback } from 'react';

type RoadmapStatus = 'planned' | 'in-progress' | 'completed';
type RoadmapType = 'feature' | 'bug' | 'enhancement';

type RoadmapItem = {
  id: number;
  title: string;
  description: string;
  status: RoadmapStatus;
  type: RoadmapType;
  targetDate?: string;
  completedDate?: string;
};

const EMPTY_FORM: Omit<RoadmapItem, 'id'> = {
  title: '',
  description: '',
  status: 'planned',
  type: 'feature',
  targetDate: '',
  completedDate: '',
};

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const TYPE_LABELS: Record<RoadmapType, string> = {
  feature: 'Feature',
  bug: 'Bug Fix',
  enhancement: 'Enhancement',
};

const STATUS_BADGE: Record<RoadmapStatus, string> = {
  planned: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
  completed: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
};

const TYPE_BADGE: Record<RoadmapType, string> = {
  feature: 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400',
  bug: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  enhancement: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
};

const LS_KEY = 'adminAuth';
const API = '/api/admin/roadmap';

function authHeaders(pw: string) {
  return { 'Content-Type': 'application/json', 'x-admin-password': pw };
}

function ItemModal({
  item,
  savedPw,
  onClose,
  onSaved,
}: {
  item: RoadmapItem | null; // null = new item
  savedPw: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Omit<RoadmapItem, 'id'>>(
    item
      ? {
          title: item.title,
          description: item.description,
          status: item.status,
          type: item.type,
          targetDate: item.targetDate ?? '',
          completedDate: item.completedDate ?? '',
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        ...form,
        targetDate: form.targetDate || undefined,
        completedDate: form.completedDate || undefined,
        ...(item ? { id: item.id } : {}),
      };
      const res = await fetch(API, {
        method: item ? 'PATCH' : 'POST',
        headers: authHeaders(savedPw),
        body: JSON.stringify(body),
      });
      if (!res.ok) { setError('Save failed.'); return; }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm
    focus:outline-none focus:ring-2 focus:ring-gold-500`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
        border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b
          border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item ? 'Edit Item' : 'New Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              autoFocus
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as RoadmapStatus }))}
                className={inputCls}
              >
                {(Object.keys(STATUS_LABELS) as RoadmapStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as RoadmapType }))}
                className={inputCls}
              >
                {(Object.keys(TYPE_LABELS) as RoadmapType[]).map(t => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="text"
                placeholder="e.g. 2025-6-30"
                value={form.targetDate}
                onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Completed Date
              </label>
              <input
                type="text"
                placeholder="e.g. 2025-6-30"
                value={form.completedDate}
                onChange={e => setForm(f => ({ ...f, completedDate: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200
                dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm
                transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60
                text-gray-900 font-semibold rounded-lg text-sm transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminRoadmap() {
  const [password, setPassword] = useState('');
  const [savedPw, setSavedPw] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [modalItem, setModalItem] = useState<RoadmapItem | null | undefined>(undefined);
  // undefined = closed, null = new item, RoadmapItem = editing existing

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) setSavedPw(stored);
  }, []);

  const loadItems = useCallback(async (pw: string) => {
    const res = await fetch(API, { headers: { 'x-admin-password': pw } });
    if (res.status === 401) return false;
    setItems(await res.json());
    return true;
  }, []);

  useEffect(() => {
    if (savedPw) loadItems(savedPw).then(ok => { if (!ok) setSavedPw(null); });
  }, [savedPw, loadItems]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const ok = await loadItems(password);
    if (ok) {
      localStorage.setItem(LS_KEY, password);
      setSavedPw(password);
    } else {
      setAuthError('Wrong password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    setSavedPw(null);
    setItems([]);
    setPassword('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    await fetch(API, {
      method: 'DELETE',
      headers: authHeaders(savedPw!),
      body: JSON.stringify({ id }),
    });
    await loadItems(savedPw!);
  };

  const handleSaved = async () => {
    await loadItems(savedPw!);
    setModalItem(undefined);
  };

  // Password gate
  if (!savedPw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg
          border border-gray-100 dark:border-gray-700 p-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm
                focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {authError && <p className="text-red-500 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-gray-900
                font-semibold rounded-lg transition-colors text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Roadmap Admin</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setModalItem(null)}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-gray-900 font-semibold
                rounded-lg text-sm transition-colors"
            >
              + Add Item
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm
                transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Item list */}
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">No items yet.</p>
          )}
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
                dark:border-gray-700 shadow-sm p-4 flex flex-col sm:flex-row
                sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.description}</p>
                )}
                <div className="flex gap-4 mt-1">
                  {item.targetDate && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Target: {item.targetDate}
                    </span>
                  )}
                  {item.completedDate && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Done: {item.completedDate}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setModalItem(item)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200
                    dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100
                    dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalItem !== undefined && (
        <ItemModal
          item={modalItem}
          savedPw={savedPw}
          onClose={() => setModalItem(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
