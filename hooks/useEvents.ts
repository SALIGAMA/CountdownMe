import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownEvent, EventCategory } from '../types';
import { CATEGORY_DEFAULT_GRADIENT } from '../constants/categories';
import { GRADIENTS } from '../constants/gradients';

const STORAGE_KEY = '@countdown_events';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function useEvents() {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setEvents(JSON.parse(raw));
      } catch (_) {
        // storage read failed; start fresh
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = useCallback(async (updated: CountdownEvent[]) => {
    setEvents(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addEvent = useCallback(
    async (
      partial: Omit<CountdownEvent, 'id' | 'createdAt' | 'gradientIndex'>
    ) => {
      const gradientIndex =
        CATEGORY_DEFAULT_GRADIENT[partial.category] ??
        events.length % GRADIENTS.length;
      const event: CountdownEvent = {
        ...partial,
        id: generateId(),
        gradientIndex,
        createdAt: new Date().toISOString(),
      };
      await save([event, ...events]);
      return event;
    },
    [events, save]
  );

  const updateEvent = useCallback(
    async (id: string, patch: Partial<CountdownEvent>) => {
      const updated = events.map((e) => (e.id === id ? { ...e, ...patch } : e));
      await save(updated);
    },
    [events, save]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      await save(events.filter((e) => e.id !== id));
    },
    [events, save]
  );

  const getEvent = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events]
  );

  return { events, loading, addEvent, updateEvent, deleteEvent, getEvent };
}
