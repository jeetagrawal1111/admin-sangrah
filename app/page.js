'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/Common/StatsCard';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Database, Languages, FileText, Users } from 'lucide-react';
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
      const response = await apiService.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
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

      {stats && (
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
      )}

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

        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center text-gray-500 py-8">
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}