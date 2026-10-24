import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubjects } from '../viewmodels/useSubjects';
import { useTasks } from '../viewmodels/useTasks';

export default function SubjectsListScreen({ navigation }) {
  const { subjects, addSubject } = useSubjects();
  const { tasks } = useTasks();
  const [name, setName] = useState('');

  const countFor = (subjectName) =>
    tasks.filter(
      (t) => t.subject.trim().toLowerCase() === subjectName.toLowerCase()
    ).length;

  const onAdd = () => {
    try {
      addSubject(name);
      setName('');
    } catch (err) {
      Alert.alert('Cannot add subject', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const count = countFor(item.name);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SubjectDetails', { id: item.id })}
      >
        <View style={[styles.colorBar, { backgroundColor: item.color }]} />
        <View style={styles.cardBody}>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.count}>
            {count} {count === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Subjects</Text>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="New subject (e.g. Mathematics)"
          placeholderTextColor="#9AA0A6"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          onSubmitEditing={onAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No subjects yet. Add your first one above.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', padding: 20, paddingBottom: 12 },
  addRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8 },
  input: {
    flex: 1, height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12,
    paddingHorizontal: 14, backgroundColor: '#fff', fontSize: 16, color: '#111827',
  },
  addBtn: {
    height: 48, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center', marginLeft: 10,
  },
  addText: { color: '#fff', fontWeight: '700' },
  list: { padding: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB',
    marginBottom: 12, overflow: 'hidden',
  },
  colorBar: { width: 8, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: 16 },
  subjectName: { fontSize: 17, fontWeight: '700', color: '#111827' },
  count: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  arrow: { fontSize: 28, color: '#9CA3AF', paddingRight: 16 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 50, fontSize: 15 },
});