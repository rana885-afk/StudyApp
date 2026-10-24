import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimer, STUDY_MINUTES, BREAK_MINUTES } from '../viewmodels/useTimer';

export default function PomodoroTimerScreen() {
  const {
    mode, isRunning, completedSessions, display, progress,
    start, pause, reset, switchMode,
  } = useTimer();

  const isStudy = mode === 'study';
  const accent = isStudy ? '#4F46E5' : '#10B981';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Pomodoro Timer</Text>

      <View style={styles.modes}>
        <TouchableOpacity
          style={[styles.modeBtn, isStudy && styles.modeActive]}
          onPress={() => switchMode('study')}
        >
          <Text style={[styles.modeText, isStudy && styles.modeTextActive]}>
            Study ({STUDY_MINUTES} min)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, !isStudy && styles.modeActive]}
          onPress={() => switchMode('break')}
        >
          <Text style={[styles.modeText, !isStudy && styles.modeTextActive]}>
            Break ({BREAK_MINUTES} min)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.circle, { borderColor: accent }]}>
        <Text style={[styles.time, { color: accent }]}>{display}</Text>
        <Text style={styles.modeLabel}>{isStudy ? 'Focus time' : 'Take a break'}</Text>
      </View>

      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.round(progress * 100)}%`, backgroundColor: accent },
          ]}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: accent }]}
          onPress={isRunning ? pause : start}
        >
          <Text style={styles.mainText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>{completedSessions}</Text>
        <Text style={styles.statsLabel}>
          study {completedSessions === 1 ? 'session' : 'sessions'} completed
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', paddingHorizontal: 20 },
  header: { fontSize: 26, fontWeight: '800', color: '#111827', alignSelf: 'flex-start', paddingTop: 20, paddingBottom: 16 },
  modes: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, alignSelf: 'stretch' },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  modeActive: { backgroundColor: '#fff' },
  modeText: { color: '#6B7280', fontWeight: '600' },
  modeTextActive: { color: '#111827' },
  circle: {
    width: 250, height: 250, borderRadius: 125, borderWidth: 10,
    alignItems: 'center', justifyContent: 'center', marginTop: 36, backgroundColor: '#fff',
  },
  time: { fontSize: 56, fontWeight: '800' },
  modeLabel: { fontSize: 15, color: '#6B7280', marginTop: 4 },
  barBg: { height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', alignSelf: 'stretch', marginTop: 28, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  controls: { flexDirection: 'row', marginTop: 28, alignItems: 'center' },
  mainBtn: { width: 150, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  mainText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  resetBtn: {
    width: 110, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center',
    marginLeft: 14, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff',
  },
  resetText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  statsCard: {
    alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1,
    borderColor: '#E5E7EB', padding: 18, marginTop: 32, alignItems: 'center',
  },
  statsNumber: { fontSize: 32, fontWeight: '800', color: '#4F46E5' },
  statsLabel: { color: '#6B7280', marginTop: 2 },
});