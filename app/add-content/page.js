'use client';

import { useState } from 'react';
import { ContentForm } from '@/components/Forms/ContentForm';
import { Alert } from '@/components/UI/Alert';
import { apiService } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AddContent() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setSuccess('');

    try {
      const response = await apiService.addContent(formData);

      toast.success('Content added successfully!!');
      setSuccess(`Content "${formData.title}" has been added successfully to ${formData.language} / ${formData.category}`);
      // Reset form
      setTimeout(() => {
        setSuccess('');
      }, 1000);
      
    } catch (error) {
      console.error('Error adding content:', error);
      
      const errorMessage = error.response?.data?.error || 'Failed to add content. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Content</h1>
        <p className="text-gray-600 mt-2">
          Add new aarti, bhajan, mantra, or chalisa to the database
        </p>
      </div>

      {success && (
        <Alert type="success" title="Success!">
          {success}
        </Alert>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 max-sm:p-2">
        <ContentForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 max-sm:p-2">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Guidelines</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Ensure all fields are filled accurately</li>
          <li>• Use proper formatting for content fields</li>
          <li>• Double-check the language and category selection</li>
          <li>• Generate ID automatically or follow the naming convention: language_category_number</li>
          <li>• Content in original script should be in the appropriate font</li>
          <li>• Alphabetic content should be proper transliteration</li>
        </ul>
      </div>
    </div>
  );
}