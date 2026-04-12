import { useState, useEffect } from 'react';

function loadFromSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useSession() {
  const [participants, setParticipants] = useState(() =>
    loadFromSession('fw_participants', [])
  );
  const [winners, setWinners] = useState(() =>
    loadFromSession('fw_winners', [])
  );
  const [mode, setMode] = useState(() =>
    loadFromSession('fw_mode', 'elimination')
  );

  useEffect(() => {
    saveToSession('fw_participants', participants);
  }, [participants]);

  useEffect(() => {
    saveToSession('fw_winners', winners);
  }, [winners]);

  useEffect(() => {
    saveToSession('fw_mode', mode);
  }, [mode]);

  function addParticipant(name) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (participants.includes(trimmed)) return false;
    setParticipants((prev) => [...prev, trimmed]);
    return true;
  }

  function removeParticipant(name) {
    setParticipants((prev) => prev.filter((p) => p !== name));
  }

  function addWinner(name) {
    setWinners((prev) => [{ name, time: new Date().toLocaleTimeString() }, ...prev]);
    if (mode === 'elimination') {
      removeParticipant(name);
    }
  }

  function resetAll() {
    setParticipants([]);
    setWinners([]);
  }

  function resetWinners() {
    setWinners([]);
  }

  return {
    participants,
    winners,
    mode,
    setMode,
    addParticipant,
    removeParticipant,
    addWinner,
    resetAll,
    resetWinners,
  };
}
