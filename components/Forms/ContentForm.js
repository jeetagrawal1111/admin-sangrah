'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { TextArea } from '@/components/UI/TextArea';
import { LanguageSelector } from './LanguageSelector';
import { CATEGORIES, GODS } from '@/lib/constants';
import toast from 'react-hot-toast';
import { apiService } from '@/lib/api';

export const ContentForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    titleAlpha: '',
    god: '',
    category: '',
    language: '',
    content: '',
    contentAlpha: '',
    key: ''
  });

  const [errors, setErrors] = useState({});
  const [generatingId, setGeneratingId] = useState(false);
  const [translatingTitle, setTranslatingTitle] = useState(false);
  const [translatingContent, setTranslatingContent] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to enable navigation warning
  useEffect(() => {
    const hasData = Object.values(formData).some(value => value.trim() !== '');
    setHasUnsavedChanges(hasData);
  }, [formData]);

  useEffect(() => {
    if (formData.language) {
      document.title = `Aarti Sangrah - ${formData.language}`;
    } else {
      document.title = 'Aarti Sangrah - Admin Panel';
    }
  }, [formData.language]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handlePopState = (e) => {
      const confirmLeave = window.confirm(
        'Are you sure you want to exit? All changes will be lost.'
      );

      if (!confirmLeave) {
        window.history.pushState(null, '', window.location.href);
      } else {
        // Allow navigation
        setHasUnsavedChanges(false);
        window.removeEventListener('popstate', handlePopState);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const sanitizeTransliteratedText = (text) => {
    const replacements = {
      'svami': 'swami', 'dhyana': 'dhyan', 'bhagavana': 'bhagwan', 'hanumana': 'hanuman', 'bajaranga': 'bajarang', 'apane': 'apne', 'mem': 'mein',
      'Svami': 'Swami', 'shri': 'shree'
    };

    let sanitized = text;
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      sanitized = sanitized.replace(regex, replacements[key]);
    });

    return sanitized;
  };

  const getScriptName = (languageCode) => {
    const scriptMap = {
      'hi': 'Devanagari',
      'mr': 'Devanagari',
      'raj': 'Devanagari',
      'te': 'Telugu',
      'ta': 'Tamil',
      'kn': 'Kannada'
    };
    return scriptMap[languageCode] || 'Devanagari';
  };

  const convertHtmlToText = (html) => {
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<[^>]*>/g, '');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    text = textarea.value;
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
  };

  const transliterate = async (text, languageCode) => {
    if (!text.trim()) {
      toast.error('No text to translate');
      return '';
    }

    if (!languageCode) {
      toast.error('Please select a language first');
      return '';
    }

    try {
      const response = await fetch('https://www.aksharamukha.com/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: getScriptName(languageCode),
          target: 'RomanColloquial',
          text: text,
          nativize: true,
          postOptions: [],
          preOptions: []
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }
      const data = await response.text();
      const cleanText = convertHtmlToText(data);

      // Apply sanitization before returning
      const sanitizedText = sanitizeTransliteratedText(cleanText);

      return sanitizedText;
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate. Please try again.');
      return '';
    }
  };

  // Handle title translation
  const handleTitleTranslate = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter title in original script first');
      return;
    }

    setTranslatingTitle(true);
    try {
      const translatedText = await transliterate(formData.title, formData.language);
      if (translatedText) {
        handleChange('titleAlpha', translatedText);
        toast.success('Title translated successfully');
      }
    } finally {
      setTranslatingTitle(false);
    }
  };

  // Handle content translation
  const handleContentTranslate = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter content in original script first');
      return;
    }

    setTranslatingContent(true);
    try {
      const translatedText = await transliterate(formData.content, formData.language);
      if (translatedText) {
        handleChange('contentAlpha', translatedText);
        toast.success('Content translated successfully');
      }
    } finally {
      setTranslatingContent(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.titleAlpha.trim()) newErrors.titleAlpha = 'Alpha title is required';
    if (!formData.god.trim()) newErrors.god = 'God/Deity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.contentAlpha.trim()) newErrors.contentAlpha = 'Alpha content is required';
    if (!formData.key.trim()) newErrors.key = 'Key is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setHasUnsavedChanges(false); // Clear warning before submit
      onSubmit(formData, setFormData);
    }
  };

  const generateId = async () => {
    if (!formData.language || !formData.category) {
      toast.error('Please select language and category first');
      return;
    }

    setGeneratingId(true);
    try {
      const response = await apiService.getNextId(formData.language, formData.category);

      if (response.data.nextId) {
        handleChange('id', response.data.nextId);
        toast.success(`ID generated: ${response.data.nextId}`);
      } else {
        throw new Error('No ID returned from server');
      }
    } catch (error) {
      console.error('Error generating ID:', error);
      toast.error('Failed to generate ID. Please try again.');
      const randomNum = Math.floor(Math.random() * 1000) + 1;
      const newId = `${formData.language}_${formData.category}_${randomNum}`;
      handleChange('id', newId);
    } finally {
      setGeneratingId(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-sm:space-y-2">
      {/* Language & Category Section */}
      <div className="bg-white rounded-xl border-2 max-sm:border-0 border-gray-200 p-6 max-sm:p-0 max-sm:rounded-lg">
        <h3 className="text-lg max-sm:text-base font-semibold text-gray-900 mb-4 max-sm:mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 max-sm:mr-2 max-sm:w-1.5 max-sm:h-1.5"></span>
          Content Details
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-sm:gap-2">
          <LanguageSelector
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            error={errors.language}
          />

          <div>
            <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2 max-sm:mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-3 max-sm:px-2 max-sm:py-2 border-2 border-gray-300 rounded-xl max-sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base max-sm:text-sm ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} - {cat.description}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 max-sm:mt-1 text-sm max-sm:text-xs text-red-600 flex items-center">
                <span className="w-1.5 h-1.5 max-sm:w-1 max-sm:h-1 bg-red-500 rounded-full mr-2 max-sm:mr-1"></span>
                {errors.category}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ID Generation Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-sm:p-2 max-sm:rounded-lg max-sm:border">
        <h3 className="text-lg max-sm:text-base font-semibold text-gray-900 mb-4 max-sm:mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 max-sm:mr-2 max-sm:w-1.5 max-sm:h-1.5"></span>
          Content Identification
        </h3>
        <div className="flex items-end gap-4 max-sm:gap-2 max-sm:flex-col max-sm:items-stretch">
          <div className="flex-1 max-sm:flex-none">
            <Input
              label="Content ID *"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder="e.g., hi_aarti_1"
              error={errors.id}
              className="border-2 border-gray-300 rounded-xl max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 text-base max-sm:text-sm"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={generateId}
            disabled={!formData.language || !formData.category || generatingId}
            loading={generatingId}
            className="min-w-[140px] max-sm:min-w-0 max-sm:w-full border-2 border-gray-300 rounded-xl max-sm:rounded-lg hover:border-primary-300 transition-colors text-base max-sm:text-sm max-sm:py-2"
          >
            {generatingId ? 'Generating...' : 'Generate ID'}
          </Button>
        </div>
        <p className="text-sm max-sm:text-xs text-gray-500 mt-2 max-sm:mt-1">
          ID format: {formData.language || 'lang'}_{formData.category || 'category'}_number
        </p>
      </div>

      {/* God/Deity Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-sm:p-2 max-sm:rounded-lg max-sm:border">
        <h3 className="text-lg max-sm:text-base font-semibold text-gray-900 mb-4 max-sm:mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 max-sm:mr-2 max-sm:w-1.5 max-sm:h-1.5"></span>
          Deity Information
        </h3>
        <div>
          <label className="block text-sm max-sm:text-xs font-medium text-gray-700 mb-2 max-sm:mb-1">
            God/Deity *
          </label>
          <select
            value={formData.god}
            onChange={(e) => handleChange('god', e.target.value)}
            className={`w-full px-4 py-3 max-sm:px-2 max-sm:py-2 border-2 border-gray-300 rounded-xl max-sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base max-sm:text-sm ${errors.god ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
              }`}
          >
            <option value="">Select a god/deity</option>
            {GODS.map((god) => (
              <option key={god} value={god}>
                {god}
              </option>
            ))}
          </select>
          {errors.god && (
            <p className="mt-2 max-sm:mt-1 text-sm max-sm:text-xs text-red-600 flex items-center">
              <span className="w-1.5 h-1.5 max-sm:w-1 max-sm:h-1 bg-red-500 rounded-full mr-2 max-sm:mr-1"></span>
              {errors.god}
            </p>
          )}
        </div>
      </div>

      {/* Titles Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-sm:p-2 max-sm:rounded-lg max-sm:border">
        <h3 className="text-lg max-sm:text-base font-semibold text-gray-900 mb-4 max-sm:mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 max-sm:mr-2 max-sm:w-1.5 max-sm:h-1.5"></span>
          Title Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-sm:gap-2">
          <div>
            <Input
              label="Title (Original Script) *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., श्री गणेश आरती"
              error={errors.title}
              className="border-2 border-gray-300 rounded-xl max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 devanagari text-lg max-sm:text-base"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 max-sm:mb-1">
              <label className="block text-sm max-sm:text-xs font-medium text-gray-700">
                Title (Alphabetic) *
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleTitleTranslate}
                disabled={!formData.title.trim() || !formData.language || translatingTitle}
                loading={translatingTitle}
                className="text-xs max-sm:text-[10px]"
                style={{ borderRadius: '8px', padding: '4px' }}
              >
                {translatingTitle ? 'Translating...' : 'Translate'}
              </Button>
            </div>
            <Input
              value={formData.titleAlpha}
              onChange={(e) => handleChange('titleAlpha', e.target.value)}
              placeholder="e.g., Shree Ganesh Aarti"
              error={errors.titleAlpha}
              className="border-2 border-gray-300 rounded-xl max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 text-lg max-sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-sm:p-2 max-sm:rounded-lg max-sm:border">
        <h3 className="text-lg max-sm:text-base font-semibold text-gray-900 mb-4 max-sm:mb-2 flex items-center">
          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 max-sm:mr-2 max-sm:w-1.5 max-sm:h-1.5"></span>
          Content
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-sm:gap-2">
          <div>
            <TextArea
              label="Content (Original Script) *"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter the content in original script..."
              error={errors.content}
              rows={12}
              className="border-2 border-gray-300 rounded-xl max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 devanagari text-lg max-sm:text-base leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 max-sm:mb-1">
              <label className="block text-sm max-sm:text-xs font-medium text-gray-700">
                Content (Alphabetic) *
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleContentTranslate}
                disabled={!formData.content.trim() || !formData.language || translatingContent}
                loading={translatingContent}
                className="text-xs max-sm:text-[10px]"
                style={{ borderRadius: '8px', padding: '4px' }}
              >
                {translatingContent ? 'Translating...' : 'Translate'}
              </Button>
            </div>
            <TextArea
              value={formData.contentAlpha}
              onChange={(e) => handleChange('contentAlpha', e.target.value)}
              placeholder="Enter the content in alphabetic script..."
              error={errors.contentAlpha}
              rows={12}
              className="border-2 border-gray-300 rounded-xl max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 text-lg max-sm:text-base leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-sm:p-2 max-sm:rounded-lg max-sm:border">
        <div>
          <Input
            label="Key*"
            value={formData.key}
            onChange={(e) => handleChange('key', e.target.value)}
            placeholder="abc-xyz"
            error={errors.key}
            className="border-2 border-gray-300 rounded-xl mb-2 max-sm:rounded-lg px-4 py-3 max-sm:px-2 max-sm:py-2 focus:border-primary-500 devanagari text-lg max-sm:text-base"
          />
        </div>
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-3">
          <div className="max-sm:text-center">
            <h3 className="text-lg max-sm:text-base font-semibold text-gray-900">Ready to Add Content</h3>
            <p className="text-gray-600 text-sm max-sm:text-xs mt-1">
              Review all information before submitting
            </p>
          </div>
          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="px-8 py-3 max-sm:px-4 max-sm:py-2 max-sm:w-full rounded-xl max-sm:rounded-lg text-base max-sm:text-sm font-semibold"
          >
            Add Content
          </Button>
        </div>
      </div>
    </form>
  );
};
