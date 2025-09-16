import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

function GlobalLanguageSwitcher({ position = 'top-right' }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  // Define style based on position prop
  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      default:
        return { top: '20px', right: '20px' };
    }
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'sq' ? 'en' : 'sq';
    changeLanguage(newLang);
  };

  return (
    <div 
      className="global-language-switcher" 
      style={{
        position: 'fixed',
        zIndex: 1000,
        ...getPositionStyle(),
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 text-sm shadow-md"
      >
        {currentLanguage === 'sq' ? 'English' : 'Shqip'}
      </button>
    </div>
  );
}

export default GlobalLanguageSwitcher;
