import React from 'react';
import { X, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BackgroundSelector = ({ isOpen, onClose }) => {
  const { chatBackground, setChatBackground, isDark } = useTheme();

  const backgrounds = [
    { id: 'default', name: 'Default', preview: isDark ? 'from-gray-900 to-gray-800' : 'from-gray-50 to-gray-100' },
    { id: 'gradient-blue', name: 'Ocean Blue', preview: isDark ? 'from-blue-900 to-indigo-900' : 'from-blue-50 to-indigo-100' },
    { id: 'gradient-purple', name: 'Purple Dream', preview: isDark ? 'from-purple-900 to-pink-900' : 'from-purple-50 to-pink-100' },
    { id: 'gradient-green', name: 'Forest Green', preview: isDark ? 'from-green-900 to-emerald-900' : 'from-green-50 to-emerald-100' },
    { id: 'solid-dark', name: 'Dark Mode', preview: 'from-gray-800 to-gray-800' },
    { id: 'solid-light', name: 'Light Mode', preview: 'from-white to-white' },
  ];

  const handleBackgroundSelect = (backgroundId) => {
    setChatBackground(backgroundId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-md ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Chat Background
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleBackgroundSelect(bg.id)}
                className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  chatBackground === bg.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : isDark 
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${bg.preview} mb-2`} />
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {bg.name}
                </p>
                {chatBackground === bg.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;