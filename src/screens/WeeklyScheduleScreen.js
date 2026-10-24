import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSchedule } from '../viewmodels/useSchedule';
import { formatTime12 } from '../utils/time';

const JS_DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export default function WeeklyScheduleScreen({ navigation }) {
  const { days, sessionsForDay } = useSchedule();
  const [selectedDay, setSelectedDay] = useState(JS_DAY_NAMES[new Date().getDay()]);

  const data = sessionsForDay(selectedDay);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SessionDetails', { id: item.id })}
    >
      <View style={styles.timeBox}>
                <Text style={styles.time}>{formatTime12(item.startTime)}</Text>
        <Text style={styles.timeTo}>to</Text>
               <Text style={styles.time}>{formatTime12(item.endTime)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.subject}>{item.subject}</Text>
        {!!item.notes && (
          <Text style={styles.notes} numberOfLines={1}>{item.notes}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Weekly Schedule</Text>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayRow}
        >
          {days.map((day) => {
            const active = day === selectedDay;
            const count = sessionsForDay(day).length;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, active && styles.dayChipActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayText, active && styles.dayTextActive]}>
                  {day.slice(0, 3)}
                </Text>
                <Text style={[styles.dayCount, active && styles.dayTextActive]}>
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={styles.dayTitle}>{selectedDay}</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No study sessions on {selectedDay}. Tap + to add one.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddStudySession', { day: selectedDay })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', padding: 20, paddingBottom: 12 },
  dayRow: { paddingHorizontal: 20 },
  dayChip: {
    width: 62, paddingVertical: 10, borderRadius: 14, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 10,
  },
  dayChipActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  dayText: { color: '#374151', fontWeight: '700' },
  dayTextActive: { color: '#fff' },
  dayCount: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  dayTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginHorizontal: 20, marginTop: 20, marginBottom: 8 },
  list: { padding: 20, paddingTop: 8, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  timeBox: { alignItems: 'center', paddingRight: 14, marginRight: 14, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  time: { fontWeight: '700', color: '#4F46E5' },
  timeTo: { fontSize: 11, color: '#9CA3AF' },
  cardBody: { flex: 1 },
  subject: { fontSize: 16, fontWeight: '700', color: '#111827' },
  notes: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 50, fontSize: 15, paddingHorizontal: 20 },
  fab: {
    position: 'absolute', right: 24, bottom: 32, width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 32, marginTop: -2 },
});