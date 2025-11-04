'use client';

import { LANGUAGES } from '@/lib/constants';

export const LanguageSelector = ({ value, onChange, error, className = '' }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Language *
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`input-field px-4 py-3 max-sm:px-2 max-sm:py-2 border-2 border-gray-300 rounded-xl max-sm:rounded-lg min-w-full ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      >
        <option value="">Select a language</option>
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};