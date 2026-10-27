import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, type Language, type TranslationKey } from '../locales';

export const LANGUAGE_STORAGE_KEY = 'py_interview_pro_lang';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const defaultLanguageContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => translations.en[key] ?? String(key),
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'en' || stored === 'pt-BR' || stored === 'es') {
        return stored;
      }
      // Infer browser language
      if (typeof navigator !== 'undefined') {
        const navLang = navigator.language.toLowerCase();
        if (navLang.startsWith('pt')) return 'pt-BR';
        if (navLang.startsWith('es')) return 'es';
      }
    } catch {
      // Ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.setAttribute('lang', language);
    } catch {
      // Ignore
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = useMemo(() => {
    const currentDict = translations[language] || translations.en;
    return (key: TranslationKey): string => {
      return currentDict[key] ?? translations.en[key] ?? String(key);
    };
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  return context || defaultLanguageContext;
};
