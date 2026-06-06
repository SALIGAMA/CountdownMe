import { useState, useEffect } from 'react';
import { CountdownParts } from '../types';
import { getCountdownParts } from '../utils/dateUtils';

export function useCountdown(targetDate: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdownParts(targetDate));

  useEffect(() => {
    const tick = () => setParts(getCountdownParts(targetDate));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return parts;
}
