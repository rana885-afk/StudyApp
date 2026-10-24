import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../viewmodels/useTasks';

const PRIORITY_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

export default function TaskDetailsScreen({ navigation, route }) {
  const { getTask, toggleComplete, deleteTask } = useTasks();
  const task = getTask(route.params?.id);

  // The task may have just been deleted
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>This task no longer exists.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const onDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const Row = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
            <Text style={styles.badgeText}>{task.priority}</Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>
            {task.completed ? '✓ Completed' : '⏳ Pending'}
          </Text>
        </View>

        <View style={styles.card}>
          <Row label="Subject" value={task.subject} />
          <Row label="Due date" value={task.dueDate} />
          <Row label="Notes" value={task.notes} />
          <Row label="Created" value={task.createdAt.slice(0, 10)} />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => toggleComplete(task.id)}>
          <Text style={styles.primaryText}>
            {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('AddEditTask', { id: task.id })}
        >
          <Text style={styles.secondaryText}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontSize: 24, fontWeight: '800', color: '#111827', marginRight: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  statusPill: {
    alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginTop: 12, marginBottom: 20,
  },
  statusText: { color: '#4F46E5', fontWeight: '700' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 16, marginBottom: 20,
  },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  rowValue: { fontSize: 16, color: '#111827' },
  primaryBtn: {
    height: 50, borderRadius: 12, backgroundColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  secondaryText: { color: '#4F46E5', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 80, fontSize: 16 },
  backBtn: { alignSelf: 'center', marginTop: 20 },
  backText: { color: '#4F46E5', fontWeight: '700', fontSize: 16 },
});