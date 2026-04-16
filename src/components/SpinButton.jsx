import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function SpinButton({ onSpin, isSpinning, disabled }) {
  const { lang } = useLang();

  return (
    <motion.button
      className={`spin-btn ${isSpinning ? 'spin-btn--spinning' : ''} ${disabled ? 'spin-btn--disabled' : ''}`}
      onClick={onSpin}
      disabled={disabled || isSpinning}
      whileTap={!disabled && !isSpinning ? { scale: 0.93 } : {}}
      whileHover={!disabled && !isSpinning ? { scale: 1.06 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={lang.spinBtn}
      dir="ltr"
    >
      <span className="spin-btn__text">
        {isSpinning ? lang.spinning : lang.spinBtn}
      </span>
    </motion.button>
  );
}
