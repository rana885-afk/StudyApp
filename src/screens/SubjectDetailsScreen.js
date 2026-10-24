import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubjects } from '../viewmodels/useSubjects';
import { useTasks } from '../viewmodels/useTasks';

export default function SubjectDetailsScreen({ navigation, route }) {
  const { getSubject, deleteSubject } = useSubjects();
  const { tasks, toggleComplete } = useTasks();
  const subject = getSubject(route.params?.id);

  // The subject may have just been deleted
  if (!subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>This subject no longer exists.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const subjectTasks = tasks.filter(
    (t) => t.subject.trim().toLowerCase() === subject.name.toLowerCase()
  );
  const doneCount = subjectTasks.filter((t) => t.completed).length;

  const onDelete = () => {
    Alert.alert(
      'Delete subject',
      'The subject will be removed. Its tasks will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSubject(subject.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetails', { id: item.id })}
    >
      <TouchableOpacity
        style={[styles.check, item.completed && styles.checkDone]}
        onPress={() => toggleComplete(item.id)}
      >
        {item.completed && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.taskBody}>
        <Text style={[styles.taskTitle, item.completed && styles.taskDone]}>
          {item.title}
        </Text>
        {!!item.dueDate && <Text style={styles.meta}>Due {item.dueDate}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.banner, { backgroundColor: subject.color }]}>
        <Text style={styles.bannerTitle}>{subject.name}</Text>
        <Text style={styles.bannerSub}>
          {doneCount} of {subjectTasks.length} tasks completed
        </Text>
      </View>

      <FlatList
        data={subjectTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tasks for this subject yet. When you add a task, type "{subject.name}" in its Subject field.
          </Text>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Subject</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  banner: { padding: 24, paddingTop: 28 },
  bannerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  bannerSub: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  list: { padding: 20 },
  taskCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  check: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: '#9CA3AF',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  checkDone: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  checkMark: { color: '#fff', fontWeight: '800' },
  taskBody: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  taskDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  meta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 15, paddingHorizontal: 20 },
  deleteBtn: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  backBtn: { alignSelf: 'center', marginTop: 20 },
  backText: { color: '#4F46E5', fontWeight: '700', fontSize: 16 },
});