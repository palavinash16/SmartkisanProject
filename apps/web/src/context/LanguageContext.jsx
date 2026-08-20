import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, getTranslation } from '../utils/translations';
import { LANGUAGE_REGISTRY } from '../utils/languageRegistry';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('sk_lang') || 'hi';
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState(() => {
    return !localStorage.getItem('sk_lang');
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('sk_lang', newLang);
    setIsFirstLaunch(false);
  };

  const t = (key) => getTranslation(lang, key);

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      t, 
      supportedLanguages: LANGUAGE_REGISTRY,
      isFirstLaunch,
      dismissFirstLaunch: () => setIsFirstLaunch(false)
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    const lang = localStorage.getItem('sk_lang') || 'hi';
    return {
      lang,
      setLang: (newLang) => localStorage.setItem('sk_lang', newLang),
      t: (key) => getTranslation(lang, key),
      supportedLanguages: LANGUAGE_REGISTRY,
      isFirstLaunch: false,
      dismissFirstLaunch: () => {}
    };
  }
  return context;
}