import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

// Create the context
const LanguageContext = createContext();

// Create a custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Create the provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'sq'); // Albanian is default

  // Function to change the language
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('i18nextLng', language);
  };

  // Initialize language from localStorage if available
  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng');
    if (storedLanguage) {
      changeLanguage(storedLanguage);
    } else {
      // If no language is set, default to Albanian
      changeLanguage('sq');
    }
  }, []);

  // Context value
  const value = {
    currentLanguage,
    changeLanguage,
    languages: [
      { code: 'sq', name: 'Shqip' },
      { code: 'en', name: 'English' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
