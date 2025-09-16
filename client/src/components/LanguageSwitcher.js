import React from 'react';
import { Select } from 'antd';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  return (
    <div className="language-switcher">
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        style={{ width: 120 }}
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

export default LanguageSwitcher;
