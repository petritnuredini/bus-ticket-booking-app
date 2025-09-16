# Multi-Language Support

This project implements multi-language support using i18next and react-i18next libraries, with Albanian as the default language and English as a secondary option.

## Structure

- `client/src/i18n/index.js` - Main i18next configuration
- `client/src/i18n/locales/` - Directory containing language files
  - `sq/translation.json` - Albanian translations (default)
  - `en/translation.json` - English translations

## How to Use

### Using Translations in Components

Import the `useTranslation` hook and use it to access translations:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

### Changing Language

Use the `useLanguage` hook to access language changing functionality:

```jsx
import { useLanguage } from '../contexts/LanguageContext';

function GlobalLanguageSwitcher({ position = 'top-right' }) {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'sq' ? 'en' : 'sq';
    changeLanguage(newLang);
  };

  return (
    <div className="language-switcher">
      <button onClick={toggleLanguage}>
        {currentLanguage === 'sq' ? 'English' : 'Shqip'}
      </button>
    </div>
  );
}
```

## Adding New Translations

### Adding Translation Keys

To add new translation keys, update the JSON files in each language directory:

1. Add the key to `client/src/i18n/locales/sq/translation.json` (Albanian)
2. Add the same key to `client/src/i18n/locales/en/translation.json` (English)

Example structure:
```json
{
  "section": {
    "key": "Translation value"
  }
}
```

### Adding New Languages

To add a new language:

1. Create a new directory in `client/src/i18n/locales/` named with the language code (e.g., `de` for German)
2. Add a `translation.json` file with all the translation keys
3. Update the `LanguageContext.js` file to include the new language:

```jsx
// In LanguageContext.js
const value = {
  currentLanguage,
  changeLanguage,
  languages: [
    { code: 'sq', name: 'Shqip' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' } // New language
  ]
};
```

4. Update the `i18n/index.js` file to include the new language:

```jsx
// Import the new translation file
import translationDE from './locales/de/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  sq: {
    translation: translationSQ
  },
  de: {
    translation: translationDE
  }
};
```

## Best Practices

1. Use semantic keys (e.g., `common.welcome` instead of `welcome`)
2. Organize translations in logical sections
3. Maintain consistency between translation files
4. Use variables in translations with curly braces: `{t('greeting', { name: 'John' })}`
5. Provide a fallback text for keys that might be missing: `{t('key.might.be.missing', 'Fallback text')}`
