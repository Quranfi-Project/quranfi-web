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
    status: 'planned',
    type: 'enhancement'
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
];

const STATUS_DISPLAY_ORDER: RoadmapStatus[] = ['completed', 'in-progress', 'planned'];

const Roadmap = () => {
  const [roadmapItems] = useState<RoadmapItem[]>(ROADMAP_DATA);

  const statusStyles: Record<RoadmapStatus, string> = {
    planned: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const typeStyles: Record<RoadmapType, string> = {
    feature: 'bg-purple-100 text-purple-800',
    bug: 'bg-red-100 text-red-800',
    enhancement: 'bg-yellow-100 text-yellow-800'
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
      <h1 className="text-3xl font-bold mb-8 text-center">Website Roadmap</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Version: 1.2.0</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span>Completed: {getStatusCount('completed')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span>In Progress: {getStatusCount('in-progress')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
            <span>Planned: {getStatusCount('planned')}</span>
          </div>
        </div>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        {STATUS_DISPLAY_ORDER.map((status) => (
          <div key={status}>
            <h2 className="text-2xl font-semibold mb-4 capitalize">
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
  <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-medium">{item.title}</h3>
      <div className="flex gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeStyle}`}>
          {typeLabel}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>
    </div>
    
    <p className="text-gray-600 mt-1 mb-4">{item.description}</p>
    
    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
<div className="mt-12 p-6 bg-blue-50 rounded-lg">
  <h2 className="text-xl font-semibold mb-4">Suggest an Improvement</h2>
  <p className="mb-4">Have an idea for improving Quranify? We'd love to hear it!</p>
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