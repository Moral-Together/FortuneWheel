import { useLang } from '../context/LangContext';

export default function ModeToggle({ mode, onChange }) {
  const { lang } = useLang();

  return (
    <div className="mode-toggle">
      <span className="mode-toggle__label">{lang.mode}:</span>
      <div className="mode-toggle__buttons">
        <button
          className={`mode-btn ${mode === 'elimination' ? 'mode-btn--active' : ''}`}
          onClick={() => onChange('elimination')}
          title={lang.modeEliminationTip}
        >
          ✂️ {lang.modeElimination}
        </button>
        <button
          className={`mode-btn ${mode === 'repeat' ? 'mode-btn--active' : ''}`}
          onClick={() => onChange('repeat')}
          title={lang.modeRepeatTip}
        >
          🔁 {lang.modeRepeat}
        </button>
      </div>
    </div>
  );
}
