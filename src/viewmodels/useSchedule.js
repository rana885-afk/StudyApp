
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSession, DAYS } from '../models/Session';
import { useAuth } from '../context/AuthContext';

const ScheduleContext = createContext(null);

export function ScheduleProvider({ children }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const storageKey = user ? `sessions_${user.id}` : null;


  useEffect(() => {
    if (!storageKey) {
      setSessions([]);
      setLoaded(false);
      return;
    }
    (async () => {
      const raw = await AsyncStorage.getItem(storageKey);
      setSessions(raw ? JSON.parse(raw) : []);
      setLoaded(true);
    })();
  }, [storageKey]);

  
  useEffect(() => {
    if (storageKey && loaded) {
      AsyncStorage.setItem(storageKey, JSON.stringify(sessions));
    }
  }, [sessions, storageKey, loaded]);

  const addSession = (data) =>
    setSessions((prev) => [...prev, createSession(data)]);

  const updateSession = (id, changes) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const deleteSession = (id) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  const getSession = (id) => sessions.find((s) => s.id === id);

  
  const sessionsForDay = (day) =>
    sessions
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <ScheduleContext.Provider
      value={{
        sessions,
        days: DAYS,
        addSession,
        updateSession,
        deleteSession,
        getSession,
        sessionsForDay,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);