
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSubject } from '../models/Subject';
import { useAuth } from '../context/AuthContext';

const SubjectsContext = createContext(null);

export function SubjectsProvider({ children }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const storageKey = user ? `subjects_${user.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setSubjects([]);
      setLoaded(false);
      return;
    }
    (async () => {
      const raw = await AsyncStorage.getItem(storageKey);
      setSubjects(raw ? JSON.parse(raw) : []);
      setLoaded(true);
    })();
  }, [storageKey]);

 
  useEffect(() => {
    if (storageKey && loaded) {
      AsyncStorage.setItem(storageKey, JSON.stringify(subjects));
    }
  }, [subjects, storageKey, loaded]);

  const addSubject = (name) => {
    const clean = name.trim();
    if (!clean) throw new Error('Subject name is required.');
    if (subjects.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
      throw new Error('This subject already exists.');
    }
    setSubjects((prev) => [
      ...prev,
      createSubject({ name: clean, colorIndex: prev.length }),
    ]);
  };

  const deleteSubject = (id) =>
    setSubjects((prev) => prev.filter((s) => s.id !== id));

  const getSubject = (id) => subjects.find((s) => s.id === id);

  return (
    <SubjectsContext.Provider
      value={{ subjects, addSubject, deleteSubject, getSubject }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export const useSubjects = () => useContext(SubjectsContext);