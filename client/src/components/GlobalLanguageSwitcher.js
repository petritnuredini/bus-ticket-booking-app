import React from 'react';
import { Select } from 'antd';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const GlobalLanguageSwitcher = ({ position = 'top-right' }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
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

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  return (
    <div 
      className="global-language-switcher" 
      style={{
        position: 'fixed',
        zIndex: 1000,
        ...getPositionStyle(),
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '4px',
        padding: '6px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
        {t('common.language')}:
      </span>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        style={{ width: 100 }}
        size="small"
        dropdownMatchSelectWidth={false}
        aria-label={t('common.language')}
      >
        {languages.map((lang) => (
          <Option key={lang.code} value={lang.code}>
            {lang.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default GlobalLanguageSwitcher;
