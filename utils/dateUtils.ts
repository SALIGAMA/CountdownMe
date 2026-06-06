import { CountdownParts } from '../types';

export function getCountdownParts(isoDate: string): CountdownParts {
  const now = new Date().getTime();
  const target = new Date(isoDate).getTime();
  const diff = target - now;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const isToday = target >= todayStart.getTime() && target <= todayEnd.getTime();

  if (diff <= 0 && !isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  }

  if (isToday) {
    const remainingToday = Math.max(0, diff);
    const hours = Math.floor(remainingToday / (1000 * 60 * 60));
    const minutes = Math.floor((remainingToday % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingToday % (1000 * 60)) / 1000);
    return { days: 0, hours, minutes, seconds, isPast: false, isToday: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false, isToday: false };
}

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function formatDateDisplay(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
