import { useState, useCallback } from 'react';
import { LangProvider, useLang } from './context/LangContext';
import Wheel from './components/Wheel';
import SpinButton from './components/SpinButton';
import ParticipantPanel from './components/ParticipantPanel';
import WinnerModal from './components/WinnerModal';
import HistoryLog from './components/HistoryLog';
import ModeToggle from './components/ModeToggle';
import LanguageSelector from './components/LanguageSelector';
import { useSession } from './hooks/useSession';
import { useWheel } from './hooks/useWheel';
import { useSound } from './hooks/useSound';

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}

function AppInner() {
  const { lang } = useLang();
  const {
    participants, winners, mode, setMode,
    addParticipant, removeParticipant, addWinner, resetAll, resetWinners,
  } = useSession();

  const [currentWinner, setCurrentWinner] = useState(null);
  const [celebratingSegment, setCelebratingSegment] = useState(-1);
  const { playPop, playWhoosh, playTickSound, playWinner } = useSound();

  const handleWinner = useCallback((name, winnerIdx) => {
    playWinner();
    setCurrentWinner(name);
    setCelebratingSegment(winnerIdx);
    addWinner(name);
  }, [playWinner, addWinner]);

  const { rotation, isSpinning, spinSpeed, spin } = useWheel({
    participants,
    onWinner: handleWinner,
    playTickSound,
  });

  function handleSpin() {
    if (participants.length < 2 || isSpinning) return;
    playWhoosh();
    spin();
  }

  function handleCloseModal() {
    setCurrentWinner(null);
    setCelebratingSegment(-1);
  }

  const canSpin = participants.length >= 2 && !isSpinning;

  return (
    <div className={`app ${isSpinning ? 'app--spinning' : ''}`}>
      <div className="bg-gradient" aria-hidden="true" />
      <Background />

      <main className="app__main">
        {/* ===== LEFT SIDEBAR: title + lang + participants ===== */}
        <aside className="app__sidebar app__sidebar--left">
          <div className="sidebar-title" dir="ltr">
            <span className="sidebar-title__icon">🎡</span>
            <h1 className="sidebar-title__text">{lang.title}</h1>
            <span className="sidebar-title__icon">⭐</span>
          </div>
          <LanguageSelector />
          <ParticipantPanel
            participants={participants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            onReset={resetAll}
            playPop={playPop}
          />
        </aside>

        {/* ===== CENTER: wheel + spin button ===== */}
        <section className="app__center">
          <Wheel
            participants={participants}
            rotation={rotation}
            isSpinning={isSpinning}
            spinSpeed={spinSpeed}
            celebratingSegment={celebratingSegment}
          />
          <SpinButton
            onSpin={handleSpin}
            isSpinning={isSpinning}
            disabled={!canSpin}
          />
          {participants.length < 2 && !isSpinning && (
            <p className="app__hint">{lang.hint}</p>
          )}
        </section>

        {/* ===== RIGHT SIDEBAR: logo + mode + history ===== */}
        <aside className="app__sidebar app__sidebar--right">
          {/* Logo block — styled like the Fortune Wheel title */}
          <div className="logo-block">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Moral Together — Connecting for Godswill"
              className="logo-block__img"
            />
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
          <HistoryLog winners={winners} onClear={resetWinners} />
        </aside>
      </main>

      <WinnerModal
        winner={currentWinner}
        onClose={handleCloseModal}
        mode={mode}
      />
    </div>
  );
}

// Pre-computed background data
const STARS_DATA = Array.from({ length: 100 }, (_, i) => {
  const types = ['white', 'gold', 'pink', 'blue'];
  return {
    id: i,
    left: `${(i * 13.71 + 7.3) % 100}%`,
    top: `${(i * 11.37 + 3.1) % 100}%`,
    animationDelay: `${(i * 0.237) % 5}s`,
    animationDuration: `${1.8 + (i * 0.19) % 3.5}s`,
    size: `${1.5 + (i * 0.13) % 3.5}px`,
    type: types[i % 4],
  };
});

const ORBS = [
  { color: 'rgba(138,43,226,0.22)', size: 380, top: '10%',  left: '5%',  duration: '9s',  delay: '0s' },
  { color: 'rgba(30,144,255,0.18)',  size: 320, top: '60%',  left: '75%', duration: '11s', delay: '2s' },
  { color: 'rgba(255,20,147,0.15)',  size: 280, top: '80%',  left: '15%', duration: '8s',  delay: '1s' },
  { color: 'rgba(255,215,0,0.12)',   size: 200, top: '30%',  left: '80%', duration: '13s', delay: '3s' },
  { color: 'rgba(46,213,115,0.12)',  size: 240, top: '5%',   left: '60%', duration: '10s', delay: '0.5s' },
];

function Background() {
  return (
    <div className="stars" aria-hidden="true">
      {ORBS.map((o, i) => (
        <div
          key={`orb-${i}`}
          className="orb"
          style={{
            background: o.color, width: o.size, height: o.size,
            top: o.top, left: o.left,
            animationDuration: o.duration, animationDelay: o.delay,
          }}
        />
      ))}
      {STARS_DATA.map((s) => (
        <div
          key={s.id}
          className={`star star--${s.type}`}
          style={{
            left: s.left, top: s.top,
            animationDelay: s.animationDelay, animationDuration: s.animationDuration,
            width: s.size, height: s.size,
          }}
        />
      ))}
    </div>
  );
}
