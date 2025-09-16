import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

function PublicHeader() {
  return (
    <div className="bg-gray-800 flex justify-end p-2">
      <LanguageSwitcher />
    </div>
  );
}

export default PublicHeader;
