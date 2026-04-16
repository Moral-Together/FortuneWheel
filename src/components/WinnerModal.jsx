import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LangContext';

const CONFETTI_COLORS = [
  '#FF4757', '#FFA502', '#FFDD59', '#2ED573',
  '#1E90FF', '#A29BFE', '#FF6B9D', '#00CEC9',
  '#FFD700', '#FF6600', '#E84393', '#00B894',
];

// Pre-computed confetti (no Math.random at render time)
const CONFETTI_PIECES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 1.26) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: (i * 0.031) % 0.7,
  duration: 1.5 + (i * 0.061) % 1.8,
  rotate: (i * 37) % 720 - 360,
  size: 7 + (i * 0.43) % 12,
  shape: i % 4, // 0=rect, 1=thin, 2=circle, 3=star
  drift: ((i * 19) % 140) - 70,
}));

// Firework burst positions
const FIREWORKS = [
  { x: '15%', y: '20%', color: '#FFD700',  delay: 0,    size: 6 },
  { x: '80%', y: '15%', color: '#FF6B9D',  delay: 0.15, size: 7 },
  { x: '88%', y: '70%', color: '#2ED573',  delay: 0.3,  size: 5 },
  { x: '10%', y: '75%', color: '#1E90FF',  delay: 0.1,  size: 6 },
  { x: '50%', y: '10%', color: '#A29BFE',  delay: 0.4,  size: 8 },
  { x: '70%', y: '85%', color: '#FFA502',  delay: 0.2,  size: 5 },
];

const BURST_ANGLES = Array.from({ length: 12 }, (_, i) => (i / 12) * 360);

function FireworkBurst({ x, y, color, delay, size }) {
  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 98 }}>
      {BURST_ANGLES.map((angle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((angle * Math.PI) / 180) * (60 + size * 4),
            y: Math.sin((angle * Math.PI) / 180) * (60 + size * 4),
            scale: [0, 1.4, 0.6, 0],
            opacity: [1, 1, 0.5, 0],
          }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        />
      ))}
      {/* Center flash */}
      <motion.div
        style={{
          position: 'absolute',
          width: size * 4,
          height: size * 4,
          borderRadius: '50%',
          backgroundColor: color,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 30px 10px ${color}`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2, 0], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.5, delay }}
      />
    </div>
  );
}

function Confetti() {
  return (
    <div className="confetti-container" aria-hidden="true">
      {CONFETTI_PIECES.map((p) => (
        <motion.div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.shape === 1 ? p.size * 0.4 : p.size,
            height: p.shape === 1 ? p.size * 1.6 : p.shape === 2 ? p.size : p.size,
            borderRadius: p.shape === 2 ? '50%' : p.shape === 0 ? '2px' : '0',
            backgroundColor: p.shape === 3 ? 'transparent' : p.color,
            color: p.color,
            fontSize: p.shape === 3 ? p.size * 1.4 : undefined,
            lineHeight: 1,
          }}
          initial={{ y: -30, opacity: 1, rotate: 0, x: 0, scale: 1 }}
          animate={{
            y: '115vh',
            opacity: [1, 1, 1, 0.6, 0],
            rotate: p.rotate,
            x: p.drift,
            scale: [1, 1.1, 0.9, 1, 0.8],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.2, 0, 0.8, 1] }}
        >
          {p.shape === 3 && '★'}
        </motion.div>
      ))}
    </div>
  );
}

export default function WinnerModal({ winner, onClose, mode }) {
  const { lang } = useLang();
  const closeRef = useRef(null);

  useEffect(() => {
    if (winner) setTimeout(() => closeRef.current?.focus(), 100);
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [winner, onClose]);

  return (
    <AnimatePresence>
      {winner && (
        <>
          <Confetti />
          {/* Fireworks */}
          {FIREWORKS.map((fw, i) => (
            <FireworkBurst key={i} {...fw} />
          ))}

          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.3, opacity: 0, y: 80, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="modal__stars" aria-hidden="true">✨</div>
              <div className="modal__trophy">🏆</div>
              <h2 className="modal__title">{lang.winner}</h2>
              <p className="modal__name">{winner}</p>
              {mode === 'elimination' && (
                <p className="modal__note">{lang.winnerNote}</p>
              )}
              <motion.button
                ref={closeRef}
                className="modal__close-btn"
                onClick={onClose}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                dir="ltr"
              >
                {lang.continueBtn}
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
