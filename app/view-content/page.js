'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/UI/Button';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Search, Filter, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LANGUAGES, CATEGORIES } from '@/lib/constants';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ViewContent() {
  const [filters, setFilters] = useState({
    language: '',
    category: ''
  });
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('titleAlpha');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch content when filters change
  useEffect(() => {
    if (filters.language && filters.category) {
      fetchContent();
    }
  }, [filters.language, filters.category]);

  const fetchContent = async () => {
    if (!filters.language || !filters.category) {
      toast.error('Please select both language and category');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getContent(filters.language, filters.category);
      setContent(response.data);
      toast.success(`Loaded ${response.data.length} items`);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Clear content when filters change
    if (field === 'language' || field === 'category') {
      setContent([]);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort content
  const filteredAndSortedContent = content
    .filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(query) ||
        item.titleAlpha?.toLowerCase().includes(query) ||
        item.god?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const SortableHeader = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="space-y-6 max-sm:space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Content</h1>
        <p className="text-gray-600 mt-2">
          Browse and manage existing spiritual content
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filter Content
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-sm:gap-2 mb-4 max-sm:mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language *
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">Select Language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show Button */}
          <div className="flex items-end">
            <Button
              onClick={fetchContent}
              disabled={!filters.language || !filters.category || loading}
              loading={loading}
              className="w-full py-3"
            >
              Show Content
            </Button>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search in titles, content, or gods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Content List
              </h3>
              {filteredAndSortedContent.length > 0 && (
                <span className="text-sm text-gray-500">
                  ({filteredAndSortedContent.length} items)
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {filters.language && filters.category
                  ? `Showing ${CATEGORIES.find(c => c.value === filters.category)?.label} in ${LANGUAGES.find(l => l.code === filters.language)?.name}`
                  : 'Select language and category to view content'
                }
              </p>
            </div>

            {filteredAndSortedContent.length > 0 && (
              <div className="items-center space-x-4 text-sm">
                <div className="text-gray-600 mb-1">Sort by:</div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="titleAlpha">Alphabetic Title</option>
                  <option value="title">Original Title</option>
                  <option value="god">God/Deity</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">Loading content...</span>
            </div>
          ) : filteredAndSortedContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {filters.language && filters.category
                  ? 'No content found for the selected filters'
                  : 'Select language and category to view content'
                }
              </p>
              <p className="text-gray-400 text-sm">
                {!filters.language || !filters.category
                  ? 'Choose both language and category above, then click "Show Content"'
                  : 'Try different filters or search terms'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-sm:space-y-2">
              {filteredAndSortedContent.map((item) => (
                <div key={item.id} className="border-2 border-gray-200 rounded-xl max-sm:rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {item.god}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.id}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {item.titleAlpha}
                        </h4>

                        <p className="text-gray-600 text-sm devanagari">
                          {item.title}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className=" text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {expandedItems.has(item.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedItems.has(item.id) && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Original Script Content */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                            Original Script Content
                          </h5>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm devanagari leading-relaxed">
                              {item.content}
                            </pre>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.content)}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            Copy Content
                          </button>
                        </div>

                        {/* Alphabetic Content */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                            <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                            Alphabetic Content
                          </h5>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                              {item.contentAlpha}
                            </pre>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.contentAlpha)}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            Copy Content
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 max-sm:space-x-2 max-sm:flex-wrap max-sm:gap-2 mt-6 max-sm:mt-4 pt-4 max-sm:pt-3 border-t border-gray-200">
                        <Button variant="danger" size="sm" disabled>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
