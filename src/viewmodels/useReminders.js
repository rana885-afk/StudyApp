
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../context/AuthContext';
import { useTasks } from './useTasks';
import { addDays, parseDate } from '../utils/dates';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const RemindersContext = createContext(null);


const scheduleAll = async (tasks) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Task reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const now = new Date();
  let count = 0;

  for (const task of tasks) {
    if (task.completed || !task.dueDate) continue;

    const due = parseDate(task.dueDate);
    const dayBefore = addDays(due, -1);
    dayBefore.setHours(18, 0, 0, 0);
    const dueMorning = new Date(due);
    dueMorning.setHours(9, 0, 0, 0);

    const slots = [
      { date: dayBefore, title: 'Task due tomorrow' },
      { date: dueMorning, title: 'Task due today' },
    ];

    for (const slot of slots) {
      if (slot.date <= now || count >= 60) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: slot.title, body: task.title },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: slot.date,
          channelId: 'reminders',
        },
      });
      count += 1;
    }
  }
  return count;
};

export function RemindersProvider({ children }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [enabled, setEnabled] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  const storageKey = user ? `reminders_${user.id}` : null;

  
  useEffect(() => {
    if (!storageKey) {
      setEnabled(false);
      return;
    }
    (async () => {
      const raw = await AsyncStorage.getItem(storageKey);
      setEnabled(raw === 'true');
    })();
  }, [storageKey]);

  
  useEffect(() => {
    if (!enabled) return;
    (async () => {
      try {
        setScheduledCount(await scheduleAll(tasks));
      } catch (err) {
        setScheduledCount(0);
      }
    })();
  }, [enabled, tasks]);

  const enable = async () => {
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') {
      throw new Error('Notification permission was denied.');
    }
    setEnabled(true);
    if (storageKey) await AsyncStorage.setItem(storageKey, 'true');
  };

  const disable = async () => {
    setEnabled(false);
    setScheduledCount(0);
    if (storageKey) await AsyncStorage.setItem(storageKey, 'false');
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return (
    <RemindersContext.Provider value={{ enabled, enable, disable, scheduledCount }}>
      {children}
    </RemindersContext.Provider>
  );
}

export const useReminders = () => useContext(RemindersContext);