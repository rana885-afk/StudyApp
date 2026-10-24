import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../viewmodels/useTasks';

const PRIORITY_COLORS = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

export default function TodoListScreen({ navigation }) {
  const { pendingTasks, completedTasks, toggleComplete } = useTasks();
  const [tab, setTab] = useState('pending');

  const data = tab === 'pending' ? pendingTasks : completedTasks;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TaskDetails', { id: item.id })}
    >
      <TouchableOpacity
        style={[styles.check, item.completed && styles.checkDone]}
        onPress={() => toggleComplete(item.id)}
      >
        {item.completed && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.cardBody}>
        <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
          {item.title}
        </Text>
        <Text style={styles.meta}>
          {[item.subject, item.dueDate].filter(Boolean).join('  •  ') || 'No details'}
        </Text>
      </View>

      <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'pending' && styles.tabActive]}
          onPress={() => setTab('pending')}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>
            Pending ({pendingTasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'completed' && styles.tabActive]}
          onPress={() => setTab('completed')}
        >
          <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>
            Completed ({completedTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {tab === 'pending' ? 'No pending tasks. Tap + to add one.' : 'No completed tasks yet.'}
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', padding: 20, paddingBottom: 8 },
  tabs: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { color: '#6B7280', fontWeight: '600' },
  tabTextActive: { color: '#4F46E5' },
  list: { padding: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  check: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#9CA3AF',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  checkDone: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  checkMark: { color: '#fff', fontWeight: '800' },
  cardBody: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  taskDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  meta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 15 },
  fab: {
    position: 'absolute', right: 24, bottom: 32, width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});