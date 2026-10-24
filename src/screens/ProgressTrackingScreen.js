import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProgress } from '../viewmodels/useProgress';
import { useTasks } from '../viewmodels/useTasks';

export default function ProgressTrackingScreen({ navigation }) {
  const { percent, completed, pending, completedThisWeek, last7, bySubject } = useProgress();
  const { tasks } = useTasks();

  const recent = tasks
    .filter((t) => t.completed)
    .sort((a, b) =>
      (b.completedAt || b.createdAt).localeCompare(a.completedAt || a.createdAt)
    )
    .slice(0, 5);

  const maxCount = Math.max(1, ...last7.map((d) => d.count));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>My Progress</Text>

        <View style={styles.card}>
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.cardLabel}>of your tasks are completed</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${percent}%` }]} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{completedThisWeek}</Text>
            <Text style={styles.statLabel}>This week</Text>
          </View>
        </View>

        <Text style={styles.section}>Last 7 days</Text>
        <View style={[styles.card, styles.chart]}>
          {last7.map((d) => (
            <View key={d.key} style={styles.chartCol}>
              <Text style={styles.chartCount}>{d.count}</Text>
              <View
                style={[styles.chartBar, { height: Math.max(4, (d.count / maxCount) * 80) }]}
              />
              <Text style={styles.chartLabel}>{d.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>By subject</Text>
        {bySubject.length === 0 ? (
          <Text style={styles.empty}>Add some tasks to see your progress.</Text>
        ) : (
          bySubject.map((s) => (
            <View key={s.name} style={styles.subjectRow}>
              <View style={styles.subjectTop}>
                <Text style={styles.subjectName}>{s.name}</Text>
                <Text style={styles.subjectCount}>
                  {s.done}/{s.total} • {s.percent}%
                </Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${s.percent}%` }]} />
              </View>
            </View>
          ))
        )}

        <Text style={styles.section}>Recently completed</Text>
        {recent.length === 0 ? (
          <Text style={styles.empty}>No completed tasks yet.</Text>
        ) : (
          recent.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.recentRow}
              onPress={() => navigation.navigate('TaskDetails', { id: t.id })}
            >
              <Text style={styles.recentCheck}>✓</Text>
              <Text style={styles.recentTitle}>{t.title}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 20, alignItems: 'center',
  },
  percent: { fontSize: 52, fontWeight: '800', color: '#4F46E5' },
  cardLabel: { color: '#6B7280', marginBottom: 14 },
  barBg: { height: 10, borderRadius: 5, backgroundColor: '#E5E7EB', alignSelf: 'stretch', overflow: 'hidden' },
  barFill: { height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  statsRow: { flexDirection: 'row', marginTop: 12 },
  statBox: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 14, alignItems: 'center', marginRight: 8,
  },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  section: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 24, marginBottom: 10 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  chartCol: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  chartCount: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  chartBar: { width: 22, borderRadius: 6, backgroundColor: '#4F46E5' },
  chartLabel: { fontSize: 12, color: '#374151', marginTop: 6 },
  subjectRow: { marginBottom: 14 },
  subjectTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  subjectName: { fontWeight: '700', color: '#111827' },
  subjectCount: { color: '#6B7280', fontSize: 13 },
  recentRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginBottom: 8,
  },
  recentCheck: { color: '#10B981', fontWeight: '800', marginRight: 10 },
  recentTitle: { flex: 1, color: '#111827', fontWeight: '600' },
  empty: { color: '#9CA3AF' },
});