import { useRef, useState, useCallback } from 'react';

const SPIN_DURATION_MS = 5500;
const MIN_ROTATIONS = 7;
const MAX_ROTATIONS = 13;

// Pointer is at the TOP of the wheel (-π/2 in canvas coords)
const POINTER_ANGLE = -Math.PI / 2;

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

export function useWheel({ participants, onWinner, playTickSound }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(0); // 0..1
  const rafRef = useRef(null);
  const rotationRef = useRef(0);
  const lastTickSegment = useRef(-1);

  const spin = useCallback(() => {
    if (isSpinning || participants.length < 2) return;

    const count = participants.length;
    const arc = (2 * Math.PI) / count;

    const winnerIndex = Math.floor(Math.random() * count);
    const totalRotations = MIN_ROTATIONS + Math.random() * (MAX_ROTATIONS - MIN_ROTATIONS);

    // Winner segment mid angle (in the wheel's local frame)
    const winnerMidAngle = winnerIndex * arc + arc / 2;

    // We want: finalRotation + winnerMidAngle ≡ POINTER_ANGLE (mod 2π)
    // So: finalRotation ≡ POINTER_ANGLE - winnerMidAngle (mod 2π)
    const jitter = (Math.random() - 0.5) * arc * 0.55;
    const targetMod = ((POINTER_ANGLE - winnerMidAngle + jitter) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    const currentMod = ((rotationRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 2 * Math.PI;

    const spinAmount = totalRotations * 2 * Math.PI + delta;
    const startAngle = rotationRef.current;

    setIsSpinning(true);
    lastTickSegment.current = -1;

    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);
      const easedProgress = easeOut(progress);

      const currentRotation = startAngle + spinAmount * easedProgress;
      rotationRef.current = currentRotation;
      setRotation(currentRotation);
      setSpinSpeed(1 - easedProgress); // 1 = fast, 0 = stopped

      // Tick: detect segment crossing at pointer (top)
      const normalizedAngle = ((POINTER_ANGLE - currentRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentSegment = Math.floor(normalizedAngle / arc) % count;
      if (currentSegment !== lastTickSegment.current) {
        lastTickSegment.current = currentSegment;
        const speed = 1 - easedProgress;
        playTickSound(speed);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = startAngle + spinAmount;
        setRotation(startAngle + spinAmount);
        setIsSpinning(false);
        onWinner(participants[winnerIndex], winnerIndex);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [isSpinning, participants, onWinner, playTickSound]);

  return { rotation, isSpinning, spinSpeed, spin };
}
