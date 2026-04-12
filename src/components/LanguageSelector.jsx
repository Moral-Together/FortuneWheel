import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { LANGUAGES } from '../i18n/translations';

export default function LanguageSelector() {
  const { langCode, setLangCode } = useLang();

  return (
    <div className="lang-selector">
      {LANGUAGES.map((l) => (
        <motion.button
          key={l.code}
          className={`lang-btn ${langCode === l.code ? 'lang-btn--active' : ''}`}
          onClick={() => setLangCode(l.code)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: langCode !== l.code ? 1.08 : 1 }}
          title={l.label}
          aria-label={l.label}
          aria-pressed={langCode === l.code}
        >
          <span className="lang-btn__flag">{l.flag}</span>
          <span className="lang-btn__label">{l.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
