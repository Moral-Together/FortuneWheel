import { useRef, useEffect } from 'react';
import { drawWheel } from '../utils/wheelDraw';
import { getSegmentColor } from '../utils/colors';
import { useLang } from '../context/LangContext';

const DOT_COUNT = 16;

export default function Wheel({ participants, rotation, isSpinning, spinSpeed, celebratingSegment }) {
  const canvasRef = useRef(null);
  const { lang } = useLang();

  // Main draw: runs when rotation/participants change (during spin or after)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Don't re-draw if glow animation is running (it handles drawing)
    if (celebratingSegment >= 0) return;
    drawWheel(canvas, participants, rotation, lang.wheelEmpty);
  }, [participants, rotation, lang, celebratingSegment]);

  // Glow animation: runs after spin stops to celebrate winner
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || celebratingSegment < 0) return;

    const startTime = performance.now();
    let rafId;

    function animateGlow(now) {
      const t = ((now - startTime) / 900); // one cycle = 900ms
      // Pulsing: 0→1→0
      const intensity = (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      drawWheel(canvas, participants, rotation, lang.wheelEmpty, celebratingSegment, intensity);
      rafId = requestAnimationFrame(animateGlow);
    }

    rafId = requestAnimationFrame(animateGlow);
    return () => {
      cancelAnimationFrame(rafId);
      // Redraw clean after animation ends
      drawWheel(canvas, participants, rotation, lang.wheelEmpty);
    };
  }, [celebratingSegment, participants, rotation, lang]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement?.parentElement;
      if (!parent) return;
      const available = Math.min(parent.offsetWidth, window.innerHeight * 0.72, 700);
      const size = Math.max(available, 260);
      canvas.width = size;
      canvas.height = size;
      drawWheel(canvas, participants, rotation, lang.wheelEmpty);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Motion blur based on speed (0=sharp, 1=max blur)
  const blurPx = isSpinning ? Math.min(spinSpeed * 3, 2.2).toFixed(1) : 0;

  return (
    <div className="wheel-wrapper">
      {/* Spinning ring */}
      <div className={`wheel-ring ${isSpinning ? 'wheel-ring--spinning' : ''}`}>
        {/* Speed overlay — radial streaks during fast spin */}
        {isSpinning && spinSpeed > 0.3 && (
          <div
            className="wheel-speed-overlay"
            style={{ opacity: Math.min((spinSpeed - 0.3) / 0.7, 0.6) }}
          />
        )}

        <canvas
          ref={canvasRef}
          className="wheel-canvas"
          style={{
            filter: blurPx > 0 ? `blur(${blurPx}px)` : 'none',
            transition: isSpinning ? 'filter 0.1s' : 'filter 0.6s',
          }}
        />
      </div>

      {/* Pointer at TOP pointing DOWN */}
      <div className={`wheel-pointer ${isSpinning ? 'wheel-pointer--spinning' : ''}`}>
        <svg width="52" height="56" viewBox="0 0 52 56" fill="none">
          <defs>
            <linearGradient id="arrowGrad" x1="26" y1="0" x2="26" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF6600" />
            </linearGradient>
            <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <polygon
            points="26,54 7,6 26,19 45,6"
            fill="rgba(0,0,0,0.3)"
            transform="translate(3,3)"
          />
          <polygon
            points="26,54 7,6 26,19 45,6"
            fill="url(#arrowGrad)"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#arrowGlow)"
          />
        </svg>
      </div>

      {/* Decorative rim lights */}
      <div className={`wheel-dots ${isSpinning ? 'wheel-dots--spinning' : ''}`}>
        {Array.from({ length: DOT_COUNT }).map((_, i) => {
          const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
          return (
            <div
              key={i}
              className="wheel-dot"
              style={{
                left: `calc(50% + ${Math.cos(angle) * 50}%)`,
                top: `calc(50% + ${Math.sin(angle) * 50}%)`,
                backgroundColor: getSegmentColor(i),
                '--dot-delay': `${(i / DOT_COUNT).toFixed(3)}s`,
                animationDelay: `${(i * 0.09) % 1.4}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
