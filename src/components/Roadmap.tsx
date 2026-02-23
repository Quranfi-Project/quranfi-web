'use client'

import { useState } from 'react';

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

const ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 1,
    title: 'Implement Sidebar Navigation',
    description: 'Add a mobile-friendly sidebar with surah list',
    status: 'completed',
    type: 'feature',
    completedDate: '2025-4-6'
  },
  {
    id: 2,
    title: 'Add Search Functionality',
    description: 'Enable searching across surahs and verses',
    status: 'completed',
    type: 'feature',
    completedDate: '2025-4-6'
  },
  {
    id: 3,
    title: 'Fix Audio Playback Bug',
    description: 'Audio sometimes continues playing when switching surahs',
    status: 'completed',
    type: 'bug',
    completedDate: '2025-4-12'
  },
  {
    id: 4,
    title: 'Bookmark Feature',
    description: 'Implement a bookmark feature',
    status: 'completed',
    type: 'feature',
    completedDate: '2025-5-03'
  },
  {
    id: 5,
    title: 'Dark Mode Support',
    description: 'Implement dark/light theme toggle',
    status: 'completed',
    type: 'enhancement',
    completedDate: '2026-2-22'
  },
  {
    id: 6,
    title: 'Repeating Ayahs',
    description: 'Add repeating Ayahs for memorization',
    status: 'completed',
    type: 'feature',
    completedDate: '2025-5-17'
  },
  {
    id: 7,
    title: 'Fonts',
    description: 'Add fonts and a font resizer for arabic',
    status: 'completed',
    type: 'feature',
    completedDate: '2025-5-17'
  },
  {
    id: 9,
    title: 'Word by Word ',
    description: 'Add Word by Word Ayahs for memorization',
    status: 'planned',
    type: 'feature',
    targetDate: '2025-6-30'
  },
  {
    id: 10,
    title: 'Fixed a couple of bugs ',
    description: 'Fixed some repeating issues ',
    status: 'completed',
    type: 'bug',
    targetDate: '2025-11-16'
  },
  {
    id: 11,
    title: 'Updated Privacy Policy ',
    description: 'Removed Muslim Ads Network off the site ',
    status: 'completed',
    type: 'enhancement',
    targetDate: '2025-12-27'
  },
];

const STATUS_DISPLAY_ORDER: RoadmapStatus[] = ['completed', 'in-progress', 'planned'];

const Roadmap = () => {
  const [roadmapItems] = useState<RoadmapItem[]>(ROADMAP_DATA);

  const statusStyles: Record<RoadmapStatus, string> = {
    planned: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  };

  const typeStyles: Record<RoadmapType, string> = {
    feature: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    bug: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    enhancement: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  };

  const statusLabels: Record<RoadmapStatus, string> = {
    planned: 'planned',
    'in-progress': 'in progress',
    completed: 'completed'
  };

  const typeLabels: Record<RoadmapType, string> = {
    feature: 'feature',
    bug: 'bug',
    enhancement: 'enhancement'
  };

  const getStatusCount = (status: RoadmapStatus) =>
    roadmapItems.filter(item => item.status === status).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-gray-100">Website Roadmap</h1>

      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Current Version: 1.2.0</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="dark:text-gray-300">Completed: {getStatusCount('completed')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="dark:text-gray-300">In Progress: {getStatusCount('in-progress')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
            <span className="dark:text-gray-300">Planned: {getStatusCount('planned')}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        {STATUS_DISPLAY_ORDER.map((status) => (
          <div key={status}>
            <h2 className="text-2xl font-semibold mb-4 capitalize dark:text-gray-100">
              {statusLabels[status]} ({getStatusCount(status)})
            </h2>

            <div className="space-y-4">
              {roadmapItems
                .filter(item => item.status === status)
                .map(item => (
                  <RoadmapCard
                    key={item.id}
                    item={item}
                    statusStyle={statusStyles[status]}
                    statusLabel={statusLabels[status]}
                    typeStyle={typeStyles[item.type]}
                    typeLabel={typeLabels[item.type]}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <FeatureSuggestionSection />
    </div>
  );
};

const RoadmapCard = ({
  item,
  statusStyle,
  statusLabel,
  typeStyle,
  typeLabel
}: {
  item: RoadmapItem;
  statusStyle: string;
  statusLabel: string;
  typeStyle: string;
  typeLabel: string;
}) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-blue-500 border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-medium dark:text-gray-100">{item.title}</h3>
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeStyle}`}>
          {typeLabel}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{item.description}</p>

    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
      {item.targetDate && (
        <div>
          <span className="font-medium">Target:</span> {new Date(item.targetDate).toLocaleDateString()}
        </div>
      )}
      {item.completedDate && (
        <div>
          <span className="font-medium">Completed:</span> {new Date(item.completedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  </div>
);

const FeatureSuggestionSection = () => (
  <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
    <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Suggest an Improvement</h2>
    <p className="mb-4 text-gray-700 dark:text-gray-300">Have an idea for improving Quranify? We&apos;d love to hear it!</p>
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => window.open('https://github.com/EasyCanadianGamer/quranify/issues/new?template=feature_request.md', '_blank')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Submit Feature Request
      </button>
      <button
        onClick={() => window.open('https://github.com/EasyCanadianGamer/quranify/issues/new?template=bug_report.md', '_blank')}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Report a Bug
      </button>
    </div>
  </div>
);

export default Roadmap;
