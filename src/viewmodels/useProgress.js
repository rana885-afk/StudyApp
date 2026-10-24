
import { useMemo } from 'react';
import { useTasks } from './useTasks';
import { addDays, toDateString, SHORT_DAYS } from '../utils/dates';

export function useProgress() {
  const { tasks } = useTasks();

  return useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    
    const today = new Date();
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const day = addDays(today, -i);
      const key = toDateString(day);
      const count = tasks.filter(
        (t) =>
          t.completed &&
          toDateString(new Date(t.completedAt || t.createdAt)) === key
      ).length;
      last7.push({ key, label: SHORT_DAYS[day.getDay()], count });
    }
    const completedThisWeek = last7.reduce((sum, d) => sum + d.count, 0);

    
    const map = {};
    tasks.forEach((t) => {
      const name = t.subject.trim() || 'No subject';
      if (!map[name]) map[name] = { name, total: 0, done: 0 };
      map[name].total += 1;
      if (t.completed) map[name].done += 1;
    });
    const bySubject = Object.values(map)
      .map((s) => ({ ...s, percent: Math.round((s.done / s.total) * 100) }))
      .sort((a, b) => b.total - a.total);

    return { total, completed, pending, percent, last7, completedThisWeek, bySubject };
  }, [tasks]);
}