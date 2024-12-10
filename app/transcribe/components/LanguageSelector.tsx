import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../types';

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'jv', name: 'Javanese' },
  { code: 'su', name: 'Sundanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Globe className="h-7 w-7 text-blue-600" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-base font-medium
        shadow-sm transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none 
        focus:ring-2 focus:ring-blue-500/20 sm:text-lg"
      >
        {languages.map((language) => (
          <option 
            key={language.code} 
            value={language.code}
            className="py-2 text-base"
          >
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}