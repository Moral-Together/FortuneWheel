import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function HistoryLog({ winners, onClear }) {
  const { lang } = useLang();

  if (winners.length === 0) return null;

  return (
    <div className="history">
      <div className="history__header">
        <h3 className="history__title">🏆 {lang.history}</h3>
        <button className="history__clear" onClick={onClear} title="×">
          ×
        </button>
      </div>
      <div className="history__list">
        <AnimatePresence>
          {winners.map((w, i) => (
            <motion.div
              key={`${w.name}-${w.time}-${i}`}
              className="history__item"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="history__medal">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span className="history__name">{w.name}</span>
              <span className="history__time">{w.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
