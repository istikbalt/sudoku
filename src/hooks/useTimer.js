import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom Timer hook for tracking gameplay elapsed time.
 * Handles pause/resume, start, reset, and setting initial elapsed seconds.
 * 
 * @param {number} initialSeconds - Starting time in seconds
 * @returns {object} - Timer state and controllers
 */
export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((newSeconds = 0) => {
    setSeconds(newSeconds);
    setIsActive(false);
  }, []);

  // Update timer every second if active
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  // Format seconds into MM:SS or HH:MM:SS
  const formatTime = useCallback((totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${formattedMins}:${formattedSecs}`;
    }
    return `${mins}:${formattedSecs}`; // e.g. "05:12"
  }, []);

  return {
    seconds,
    isActive,
    start,
    pause,
    reset,
    setSeconds,
    formatTime
  };
}
