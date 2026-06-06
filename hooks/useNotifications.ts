import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { CountdownEvent } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleEventNotifications(
  event: CountdownEvent
): Promise<string | undefined> {
  if (!event.notificationsEnabled) return undefined;
  const granted = await requestNotificationPermission();
  if (!granted) return undefined;

  const targetDate = new Date(event.targetDate);

  // Notification on event day at 9am
  const dayOf = new Date(targetDate);
  dayOf.setHours(9, 0, 0, 0);

  if (dayOf.getTime() > Date.now()) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${event.emoji} ${event.name} is today!`,
        body: 'Your special event is here. Celebrate! 🎉',
        sound: true,
      },
      trigger: { date: dayOf },
    });
    return id;
  }
  return undefined;
}

export async function cancelEventNotification(
  notificationId: string
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
