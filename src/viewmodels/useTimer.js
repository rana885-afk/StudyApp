// ViewModel: Pomodoro timer logic (study / break, start / pause / reset).
import { useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';

export const STUDY_MINUTES = 25;
export const BREAK_MINUTES = 5;

const totalSeconds = (mode) =>
  (mode === 'study' ? STUDY_MINUTES : BREAK_MINUTES) * 60;

export function useTimer() {
  const [mode, setMode] = useState('study'); // 'study' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds('study'));
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const endTimeRef = useRef(null);

  // Tick: compare with the real clock so the timer stays accurate
  useEffect(() => {
    if (!isRunning) return undefined;

    const id = setInterval(() => {
      const left = Math.max(
        0,
        Math.round((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(left);

      if (left === 0) {
        Vibration.vibrate([0, 500, 300, 500]);
        setIsRunning(false);

        const nextMode = mode === 'study' ? 'break' : 'study';
        if (mode === 'study') setCompletedSessions((c) => c + 1);
        setMode(nextMode);
        setSecondsLeft(totalSeconds(nextMode));
      }
    }, 250);

    return () => clearInterval(id);
  }, [isRunning, mode]);

  const start = () => {
    endTimeRef.current = Date.now() + secondsLeft * 1000;
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds(mode));
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(totalSeconds(newMode));
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = 1 - secondsLeft / totalSeconds(mode);

  return {
    mode,
    isRunning,
    completedSessions,
    display: `${minutes}:${seconds}`,
    progress,
    start,
    pause,
    reset,
    switchMode,
  };
}