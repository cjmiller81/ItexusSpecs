import { useState, useCallback } from 'react';

export const useDustToggle = (initialState = false) => {
  const [showDust, setShowDust] = useState(initialState);

  const toggleDust = useCallback(() => {
    setShowDust(prev => !prev);
  }, []);

  const resetDust = useCallback(() => {
    setShowDust(initialState);
  }, [initialState]);

  return {
    showDust,
    toggleDust,
    resetDust,
    setShowDust,
  };
};
