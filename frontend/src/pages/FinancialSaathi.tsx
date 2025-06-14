import React, { useEffect, useState } from 'react';

interface FinancialSaathiProps {}

const FinancialSaathi: React.FC<FinancialSaathiProps> = () => {
  const [language, setLanguage] = useState('hi');
  const [status, setStatus] = useState('Initializing...');
  const [debug, setDebug] = useState('App starting...');

  useEffect(() => {
    const config = {
      openaiApiKey: 'sk-proj-...', // Replace with actual key
      defaultLanguage: 'hi',
      enableDebug: true,
      maxConversationHistory: 6,
    };

    if (config.openaiApiKey === 'your-openai-api-key-here') {
      setStatus('Setup required - please add your OpenAI API key');
      return;
    }

    // Example init function
    const initAssistant = async () => {
      try {
        // Here you should initialize your assistant logic (maybe a class instance or hook)
        setStatus('Financial Saathi initialized successfully!');
      } catch (error: any) {
        setStatus(`Error: ${error.message}`);
      }
    };

    initAssistant();
  }, []);

  const languages = [
    { code: 'hi', label: '🇮🇳 हिंदी' },
    { code: 'te', label: '🇮🇳 తెలుగు' },
    { code: 'ta', label: '🇮🇳 தமிழ்' },
    { code: 'en', label: '🇺🇸 English' },
    { code: 'bn', label: '🇮🇳 বাংলা' },
    { code: 'gu', label: '🇮🇳 ગુજરાતી' },
  ];

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white rounded-2xl shadow-lg text-center">
      {/* <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 text-left">
        <h3 className="text-yellow-800 font-bold mb-2">⚠️ Setup Required</h3>
        <p><strong>Step 1:</strong> Replace <code className="bg-gray-800 text-white px-1 rounded">your-openai-api-key-here</code> with your OpenAI API key</p>
        <p><strong>Step 2:</strong> The app will auto-detect your language</p>
        <p><strong>Step 3:</strong> Type or speak in any supported Indian language</p>
      </div> */}

      <h1 className="text-4xl font-bold text-gray-800">🏦 Financial Saathi</h1>
      <p className="text-lg text-gray-600 mb-6">आपका वित्तीय सहायक - Your Financial Assistant</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {languages.map(lang => (
          <button
            key={lang.code}
            className={`border-2 px-4 py-2 rounded-full font-medium transition-all ${language === lang.code ? 'bg-indigo-500 text-white shadow-md' : 'border-indigo-500 text-indigo-500'}`}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="bg-teal-100 border-2 border-teal-400 rounded p-4 text-teal-900 font-medium mb-4">
        Selected: {languages.find(l => l.code === language)?.label}
      </div>

      <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto text-left border mb-4">
        <div className="bg-gray-200 text-gray-800 p-3 rounded mb-2">
          नमस्ते! मैं आपका वित्तीय सहायक हूं। पहले ऊपर से अपनी भाषा चुनें, फिर टाइप करें या बोलें!
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:border-indigo-500" placeholder="Type your message..." />
        <button className="px-6 py-3 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600">Send</button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button className="w-20 h-20 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center hover:bg-green-600">🎤</button>
        <button className="w-20 h-20 rounded-full bg-red-500 text-white text-2xl flex items-center justify-center hover:bg-red-600 hidden">📞</button>
      </div>

      <div className="bg-blue-50 border-l-4 border-indigo-400 p-4 mb-4 text-left text-gray-700 font-medium">
        {status}
      </div>

      <div className="bg-gray-900 text-gray-200 text-xs font-mono p-3 rounded h-32 overflow-y-auto">
        {debug}
      </div>
    </div>
  );
};

export default FinancialSaathi;
