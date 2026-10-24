// ViewModel: all the task logic lives here. Screens only call these functions.
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTask } from '../models/Task';
import { useAuth } from '../context/AuthContext';

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const storageKey = user ? `tasks_${user.id}` : null;

  // Load this user's tasks when they log in
  useEffect(() => {
    if (!storageKey) {
      setTasks([]);
      setLoaded(false);
      return;
    }
    (async () => {
      const raw = await AsyncStorage.getItem(storageKey);
      setTasks(raw ? JSON.parse(raw) : []);
      setLoaded(true);
    })();
  }, [storageKey]);

  // Save whenever the tasks change
  useEffect(() => {
    if (storageKey && loaded) {
      AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, storageKey, loaded]);

  const addTask = (data) => setTasks((prev) => [createTask(data), ...prev]);

  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const toggleComplete = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const getTask = (id) => tasks.find((t) => t.id === id);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        pendingTasks,
        completedTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        getTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);