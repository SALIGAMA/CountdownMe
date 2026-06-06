export type EventCategory =
  | 'birthday'
  | 'anniversary'
  | 'trip'
  | 'holiday'
  | 'goal'
  | 'other';

export interface CountdownEvent {
  id: string;
  name: string;
  targetDate: string; // ISO 8601
  emoji: string;
  category: EventCategory;
  gradientIndex: number;
  notificationsEnabled: boolean;
  notificationId?: string;
  createdAt: string;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}
