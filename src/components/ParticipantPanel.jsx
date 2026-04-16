import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSegmentColor } from '../utils/colors';
import { useLang } from '../context/LangContext';

export default function ParticipantPanel({
  participants,
  onAdd,
  onRemove,
  onReset,
  playPop,
}) {
  const { lang } = useLang();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError(lang.errorEmpty);
      return;
    }
    const added = onAdd(trimmed);
    if (!added) {
      setError(lang.errorDuplicate);
      return;
    }
    playPop();
    setInput('');
    setError('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="panel">
      <h2 className="panel__title" dir="ltr">👥 {lang.participants}</h2>

      <div className="panel__input-row">
        <input
          className={`panel__input ${error ? 'panel__input--error' : ''}`}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder={lang.inputPlaceholder}
          maxLength={30}
        />
        <motion.button
          className="panel__add-btn"
          onClick={handleAdd}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          aria-label={lang.participants}
        >
          +
        </motion.button>
      </div>

      {error && <p className="panel__error">{error}</p>}

      <div className="panel__list">
        <AnimatePresence>
          {participants.length === 0 && (
            <motion.p
              className="panel__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {lang.noParticipants}
            </motion.p>
          )}
          {participants.map((name, i) => (
            <motion.div
              key={name}
              className="participant-item"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              layout
            >
              <span
                className="participant-item__dot"
                style={{ backgroundColor: getSegmentColor(i) }}
              />
              <span className="participant-item__name">{name}</span>
              <button
                className="participant-item__remove"
                onClick={() => onRemove(name)}
                title={lang.removeParticipant}
                aria-label={`${lang.removeParticipant} ${name}`}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {participants.length > 0 && (
        <motion.button
          className="panel__reset-btn"
          onClick={onReset}
          whileTap={{ scale: 0.95 }}
          dir="ltr"
        >
          🗑️ {lang.resetAll}
        </motion.button>
      )}

      <div className="panel__count">
        <strong>{lang.total(participants.length)}</strong>
      </div>
    </div>
  );
}
