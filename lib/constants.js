export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const CATEGORIES = [
  { value: 'aarti', label: 'Aarti', description: '1' },
  { value: 'bhajan', label: 'Bhajan', description: '2' },
  { value: 'mantra', label: 'Mantra', description: '3' },
  { value: 'chalisa', label: 'Chalisa', description: '4' },
];

export const GODS = [
  'Ayyappa',
  'Brahma', 
  'Durga', 
  'Ganesha', 
  'Hanuman', 
  'Kartikeya', 
  'Kali', 
  'Krishna', 
  'Lakshmi', 
  'Parvati', 
  'Rama', 
  'Radha', 
  'Saraswati', 
  'Shani', 
  'Shiva', 
  'ShyamBaba',
  'Sita',
  'Surya', 
  'Venkateshwara', 
  'Vishnu', 
  'Vitthal', 

];
