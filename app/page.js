'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/Common/StatsCard';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Database, Languages, FileText, Users, BarChart3 } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics. Please try again.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const retryFetchStats = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to Aarti Sangrah Admin Panel
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Languages"
              value={stats.totalLanguages}
              icon={Languages}
              color="purple"
            />
            <StatsCard
              title="Total Content"
              value={stats.totalContent}
              icon={FileText}
              color="blue"
            />
            <StatsCard
              title="Total Categories"
              value={stats.totalCategories}
              icon={Database}
              color="green"
            />
            <StatsCard
              title="Content Types"
              value={Object.keys(stats.contentByCategory).length}
              icon={Users}
              color="orange"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Content by Language</h2>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.contentByLanguage).map(([language, count]) => (
                <div
                  key={language}
                  className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200"
                >
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {language === 'hi' ? 'Hindi' : 
                     language === 'kn' ? 'Kannada' :
                     language === 'mr' ? 'Marathi' :
                     language === 'raj' ? 'Rajasthani' :
                     language === 'ta' ? 'Tamil' :
                     language === 'te' ? 'Telugu' : language}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content by Category */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Content by Category</h2>
              <Database className="w-5 h-5 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(stats.contentByCategory).map(([category, count]) => (
                <div
                  key={category}
                  className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200"
                >
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/add-content"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <h3 className="font-medium text-gray-900">Add New Content</h3>
            <p className="text-sm text-gray-600 mt-1">Add aarti, bhajan, mantra, or chalisa</p>
          </a>
          
          <a
            href="/view-content"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <h3 className="font-medium text-gray-900">View Content</h3>
            <p className="text-sm text-gray-600 mt-1">Browse and manage existing content</p>
          </a>

          <button
            onClick={retryFetchStats}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-left"
          >
            <h3 className="font-medium text-gray-900">Refresh Stats</h3>
            <p className="text-sm text-gray-600 mt-1">Update dashboard statistics</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center text-gray-500 py-8">
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
