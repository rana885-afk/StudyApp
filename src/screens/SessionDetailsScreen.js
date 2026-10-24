import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSchedule } from '../viewmodels/useSchedule';
import { formatTime12 } from '../utils/time';

export default function SessionDetailsScreen({ navigation, route }) {
  const { getSession, deleteSession } = useSchedule();
  const session = getSession(route.params?.id);

  
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>This session no longer exists.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const onDelete = () => {
    Alert.alert('Delete session', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteSession(session.id);
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
        <Text style={styles.title}>{session.subject}</Text>

        <View style={styles.timePill}>
          <Text style={styles.timeText}>
                        {session.day}  •  {formatTime12(session.startTime)} - {formatTime12(session.endTime)}
          </Text>
        </View>

        <View style={styles.card}>
          <Row label="Subject" value={session.subject} />
          <Row label="Day" value={session.day} />
                    <Row label="Start time" value={formatTime12(session.startTime)} />
                    <Row label="End time" value={formatTime12(session.endTime)} />
          <Row label="Notes" value={session.notes} />
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('AddStudySession', { id: session.id })}
        >
          <Text style={styles.primaryText}>Edit Session</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827' },
  timePill: {
    alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 20, marginTop: 12, marginBottom: 20,
  },
  timeText: { color: '#4F46E5', fontWeight: '700' },
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
  deleteBtn: {
    height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 80, fontSize: 16 },
  backBtn: { alignSelf: 'center', marginTop: 20 },
  backText: { color: '#4F46E5', fontWeight: '700', fontSize: 16 },
});