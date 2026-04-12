import { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../i18n/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [langCode, setLangCode] = useState('en');

  const lang = translations[langCode];
  const langMeta = LANGUAGES.find((l) => l.code === langCode);

  // Apply dir to <html> for RTL support
  useEffect(() => {
    document.documentElement.setAttribute('dir', langMeta.dir);
    document.documentElement.setAttribute('lang', langCode);
  }, [langCode, langMeta]);

  return (
    <LangContext.Provider value={{ langCode, setLangCode, lang, langMeta }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
