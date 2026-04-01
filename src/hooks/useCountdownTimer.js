/**
 * Custom hook for countdown timer management
 * Provides centralized logic for all timer-based features
 */

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook for managing countdown timers
 * @param {number} initialDuration - Initial duration in seconds
 * @param {boolean} enabled - Whether timer is enabled
 * @param {function} onTimeout - Callback when timer reaches 0
 * @returns {object} Timer state and controls
 */
export const useCountdownTimer = (
  initialDuration,
  enabled = true,
  onTimeout = null,
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const durationRef = useRef(initialDuration);

  // Update ref when duration changes
  useEffect(() => {
    durationRef.current = initialDuration;
  }, [initialDuration]);

  // Timer effect
  useEffect(() => {
    if (!enabled || timeRemaining <= 0 || !isRunning) {
      if (timeRemaining <= 0) {
        setIsRunning(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsRunning(false);
          if (onTimeout) {
            onTimeout();
          }
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled, timeRemaining, isRunning, onTimeout]);

  const reset = useCallback(() => {
    setTimeRemaining(durationRef.current);
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  return {
    timeRemaining,
    isRunning,
    reset,
    start,
    pause,
    resume,
  };
};

export default useCountdownTimer;
