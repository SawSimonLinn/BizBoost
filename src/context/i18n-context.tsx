
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/locales/en.json';
import my from '@/locales/my.json';
import ko from '@/locales/ko.json';
import zh from '@/locales/zh.json';

type Language = 'en' | 'my' | 'ko' | 'zh';

type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  en,
  my,
  ko,
  zh,
};

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('bizboost_language') as Language;
    if (storedLang && translations[storedLang]) {
      setLanguageState(storedLang);
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if(isHydrated) {
        localStorage.setItem('bizboost_language', lang);
    }
  };

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);
  
  if (!isHydrated) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
