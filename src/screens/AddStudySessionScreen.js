import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import AuthInput from '../components/AuthInput';
import { useSchedule } from '../viewmodels/useSchedule';
import { parseTime12, formatTime12 } from '../utils/time';

export default function AddStudySessionScreen({ navigation, route }) {
  const { days, addSession, updateSession, getSession } = useSchedule();
  const editId = route.params?.id;
  const existing = editId ? getSession(editId) : null;

  const [subject, setSubject] = useState(existing?.subject ?? '');
  const [day, setDay] = useState(existing?.day ?? route.params?.day ?? days[0]);
  const [startTime, setStartTime] = useState(formatTime12(existing?.startTime));
  const [endTime, setEndTime] = useState(formatTime12(existing?.endTime));
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const start24 = parseTime12(startTime);
    const end24 = parseTime12(endTime);

    if (!subject.trim()) e.subject = 'Subject is required.';
    if (!start24) e.startTime = 'Use h:mm AM/PM (e.g. 4:30 PM).';
    if (!end24) e.endTime = 'Use h:mm AM/PM (e.g. 6:00 PM).';
    if (start24 && end24 && end24 <= start24) {
      e.endTime = 'End time must be after start time.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;
    const data = {
      subject: subject.trim(),
      day,
      startTime: parseTime12(startTime), // saved as 24h
      endTime: parseTime12(endTime),
      notes: notes.trim(),
    };
    if (existing) {
      updateSession(existing.id, data);
    } else {
      addSession(data);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>{existing ? 'Edit Session' : 'New Study Session'}</Text>

        <AuthInput
          label="Subject"
          placeholder="e.g. Physics"
          autoCapitalize="words"
          value={subject}
          onChangeText={setSubject}
          error={errors.subject}
        />

        <Text style={styles.label}>Day</Text>
        <View style={styles.dayWrap}>
          {days.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, day === d && styles.chipActive]}
              onPress={() => setDay(d)}
            >
              <Text style={[styles.chipText, day === d && styles.chipTextActive]}>
                {d.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeCol}>
            <AuthInput
              label="Start time"
              placeholder="4:30 PM"
              autoCapitalize="characters"
              value={startTime}
              onChangeText={setStartTime}
              error={errors.startTime}
            />
          </View>
          <View style={styles.timeCol}>
            <AuthInput
              label="End time"
              placeholder="6:00 PM"
              autoCapitalize="characters"
              value={endTime}
              onChangeText={setEndTime}
              error={errors.endTime}
            />
          </View>
        </View>

        <AuthInput
          label="Notes (optional)"
          placeholder="What will you study?"
          autoCapitalize="sentences"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>{existing ? 'Save Changes' : 'Add Session'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  dayWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  chip: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff',
    marginRight: 8, marginBottom: 8,
  },
  chipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  chipText: { color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  timeRow: { flexDirection: 'row' },
  timeCol: { flex: 1, marginRight: 8 },
  saveBtn: {
    height: 50, borderRadius: 12, backgroundColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});