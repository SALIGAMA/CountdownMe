import { EventCategory } from '../types';

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  trip: 'Trip',
  holiday: 'Holiday',
  goal: 'Goal',
  other: 'Other',
};

export const CATEGORY_EMOJIS: Record<EventCategory, string> = {
  birthday: '🎂',
  anniversary: '💍',
  trip: '✈️',
  holiday: '🎉',
  goal: '🏆',
  other: '⭐',
};

export const CATEGORY_DEFAULT_GRADIENT: Record<EventCategory, number> = {
  birthday: 0,
  anniversary: 5,
  trip: 2,
  holiday: 7,
  goal: 3,
  other: 8,
};

export const ALL_CATEGORIES: EventCategory[] = [
  'birthday', 'anniversary', 'trip', 'holiday', 'goal', 'other',
];
