import React from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReminders } from '../viewmodels/useReminders';
import { useTasks } from '../viewmodels/useTasks';
import { todayString, toDateString, addDays } from '../utils/dates';

export default function NotificationsScreen({ navigation }) {
  const { enabled, enable, disable, scheduledCount } = useReminders();
  const { tasks } = useTasks();

  const onToggle = async (value) => {
    try {
      if (value) await enable();
      else await disable();
    } catch (err) {
      Alert.alert('Reminders', err.message);
    }
  };

  const today = todayString();
  const weekLimit = toDateString(addDays(new Date(), 7));

  const withDate = tasks
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdue = withDate.filter((t) => t.dueDate < today);
  const soon = withDate.filter((t) => t.dueDate >= today && t.dueDate <= weekLimit);
  const later = withDate.filter((t) => t.dueDate > weekLimit);

  const Section = ({ title, items, color }) =>
    items.length === 0 ? null : (
      <View>
        <Text style={[styles.section, { color }]}>{title} ({items.length})</Text>
        {items.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.row}
            onPress={() => navigation.navigate('TaskDetails', { id: t.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{t.title}</Text>
              <Text style={styles.rowMeta}>
                {[t.subject, `Due ${t.dueDate}`].filter(Boolean).join('  •  ')}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Reminders</Text>

        <View style={styles.settingCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.settingTitle}>Task reminders</Text>
            <Text style={styles.settingText}>
              Get a notification the evening before (6 PM) and the morning of the due date (9 AM).
            </Text>
            {enabled && (
              <Text style={styles.settingCount}>{scheduledCount} reminders scheduled</Text>
            )}
          </View>
          <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ true: '#4F46E5' }}
          />
        </View>

        <Section title="Overdue" items={overdue} color="#EF4444" />
        <Section title="Due in the next 7 days" items={soon} color="#F59E0B" />
        <Section title="Later" items={later} color="#6B7280" />

        {withDate.length === 0 && (
          <Text style={styles.empty}>
            No upcoming tasks. Add a due date to a task and it will appear here.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 16 },
  settingCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 18,
  },
  settingTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  settingText: { color: '#6B7280', marginTop: 4, fontSize: 13 },
  settingCount: { color: '#4F46E5', marginTop: 6, fontWeight: '600', fontSize: 13 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginBottom: 8,
  },
  rowTitle: { fontWeight: '700', color: '#111827', fontSize: 15 },
  rowMeta: { color: '#6B7280', fontSize: 13, marginTop: 2 },
  arrow: { fontSize: 24, color: '#9CA3AF' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});