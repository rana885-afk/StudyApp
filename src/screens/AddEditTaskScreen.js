import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import AuthInput from '../components/AuthInput';
import { useTasks } from '../viewmodels/useTasks';
import { PRIORITIES } from '../models/Task';

export default function AddEditTaskScreen({ navigation, route }) {
  const { addTask, updateTask, deleteTask, getTask } = useTasks();
  const editId = route.params?.id;
  const existing = editId ? getTask(editId) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [subject, setSubject] = useState(existing?.subject ?? '');
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [priority, setPriority] = useState(existing?.priority ?? 'Medium');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Task title is required.';
    if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      e.dueDate = 'Use the format YYYY-MM-DD (e.g. 2026-11-05).';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;
    const data = { title, subject, dueDate: dueDate.trim(), priority, notes };
    if (existing) {
      updateTask(existing.id, { ...data, title: title.trim(), subject: subject.trim(), notes: notes.trim() });
    } else {
      addTask(data);
    }
    navigation.goBack();
  };

  const onDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(existing.id);
          navigation.navigate('TodoList');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>{existing ? 'Edit Task' : 'New Task'}</Text>

        <AuthInput
          label="Title"
          placeholder="e.g. Finish chapter 3"
          autoCapitalize="sentences"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />
        <AuthInput
          label="Subject"
          placeholder="e.g. Mathematics"
          autoCapitalize="words"
          value={subject}
          onChangeText={setSubject}
        />
        <AuthInput
          label="Due date"
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          value={dueDate}
          onChangeText={setDueDate}
          error={errors.dueDate}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, priority === p && styles.chipActive]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <AuthInput
          label="Notes (optional)"
          placeholder="Anything to remember..."
          autoCapitalize="sentences"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>{existing ? 'Save Changes' : 'Add Task'}</Text>
        </TouchableOpacity>

        {existing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Task</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  priorityRow: { flexDirection: 'row', marginBottom: 16 },
  chip: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff', marginRight: 8,
  },
  chipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  chipText: { color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  saveBtn: {
    height: 50, borderRadius: 12, backgroundColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});