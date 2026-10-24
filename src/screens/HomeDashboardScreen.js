import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../viewmodels/useTasks';
import { useSchedule } from '../viewmodels/useSchedule';
import { useProgress } from '../viewmodels/useProgress';
import { todayString, dayName } from '../utils/dates';
import { formatTime12 } from '../utils/time';

const ACTIONS = [
  { title: 'Tasks', route: 'TodoList', icon: '✅' },
  { title: 'Schedule', route: 'WeeklySchedule', icon: '📅' },
  { title: 'Timer', route: 'PomodoroTimer', icon: '⏱️' },
  { title: 'Subjects', route: 'SubjectsList', icon: '📚' },
  { title: 'Progress', route: 'ProgressTracking', icon: '📈' },
  { title: 'Reminders', route: 'Notifications', icon: '🔔' },
];

export default function HomeDashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { pendingTasks } = useTasks();
  const { sessionsForDay } = useSchedule();
  const { percent } = useProgress();

  const today = new Date();
  const todaySessions = sessionsForDay(dayName(today));
  const dueToday = pendingTasks.filter((t) => t.dueDate === todayString());
  const dueSoon = pendingTasks
    .filter((t) => t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hello}>Hello, {user?.name} 👋</Text>
        <Text style={styles.date}>
          {dayName(today)}, {todayString()}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{dueToday.length}</Text>
            <Text style={styles.statLabel}>Due today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{todaySessions.length}</Text>
            <Text style={styles.statLabel}>Sessions today</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.progressCard}
          onPress={() => navigation.navigate('ProgressTracking')}
        >
          <View style={styles.progressTop}>
            <Text style={styles.progressTitle}>Overall progress</Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${percent}%` }]} />
          </View>
        </TouchableOpacity>

        <Text style={styles.section}>Quick access</Text>
        <View style={styles.grid}>
          {ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.route}
              style={styles.gridItem}
              onPress={() => navigation.navigate(a.route)}
            >
              <Text style={styles.gridIcon}>{a.icon}</Text>
              <Text style={styles.gridText}>{a.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>Today's study sessions</Text>
        {todaySessions.length === 0 ? (
          <Text style={styles.empty}>No sessions today.</Text>
        ) : (
          todaySessions.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.row}
              onPress={() => navigation.navigate('SessionDetails', { id: s.id })}
            >
              <Text style={styles.rowTitle}>{s.subject}</Text>
              <Text style={styles.rowMeta}>
                {formatTime12(s.startTime)} - {formatTime12(s.endTime)}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.section}>Coming up</Text>
        {dueSoon.length === 0 ? (
          <Text style={styles.empty}>No tasks with a due date.</Text>
        ) : (
          dueSoon.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.row}
              onPress={() => navigation.navigate('TaskDetails', { id: t.id })}
            >
              <Text style={styles.rowTitle}>{t.title}</Text>
              <Text style={styles.rowMeta}>Due {t.dueDate}</Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.logout} onPress={signOut}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  hello: { fontSize: 26, fontWeight: '800', color: '#111827' },
  date: { color: '#6B7280', marginTop: 4, marginBottom: 18 },
  statsRow: { flexDirection: 'row' },
  statBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 14, alignItems: 'center', marginRight: 8,
  },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#4F46E5' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  progressCard: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 16, marginTop: 12,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressTitle: { fontWeight: '700', color: '#111827' },
  progressPercent: { fontWeight: '800', color: '#4F46E5' },
  barBg: { height: 10, borderRadius: 5, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  section: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 24, marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: {
    width: '31%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', paddingVertical: 18, alignItems: 'center', marginBottom: 10,
  },
  gridIcon: { fontSize: 26 },
  gridText: { marginTop: 6, fontWeight: '600', color: '#374151', fontSize: 13 },
  row: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 14, marginBottom: 8,
  },
  rowTitle: { fontWeight: '700', color: '#111827', fontSize: 15 },
  rowMeta: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  empty: { color: '#9CA3AF' },
  logout: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', marginTop: 28,
  },
  logoutText: { color: '#EF4444', fontWeight: '700' },
});