import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, getTranslation } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('sk_lang') || 'hi';
  });

  const setLang = (newLang) => {
    if (TRANSLATIONS[newLang]) {
      setLangState(newLang);
      localStorage.setItem('sk_lang', newLang);
    }
  };

  const t = (key) => getTranslation(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if component is rendered outside Provider
    const lang = localStorage.getItem('sk_lang') || 'hi';
    return {
      lang,
      setLang: (newLang) => localStorage.setItem('sk_lang', newLang),
      t: (key) => getTranslation(lang, key),
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
