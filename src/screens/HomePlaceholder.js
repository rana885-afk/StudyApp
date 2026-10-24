import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

// Temporary home screen until the real dashboard is built.
export default function HomePlaceholder({ navigation }) {
  const { user, signOut } = useAuth();

  const Button = ({ title, route, danger }) => (
    <TouchableOpacity
      style={[styles.button, danger && styles.logout]}
      onPress={route ? () => navigation.navigate(route) : signOut}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Hello, {user?.name} 👋</Text>
        <Text style={styles.subtitle}>You are logged in as {user?.email}</Text>

        <Button title="Open My Tasks" route="TodoList" />
        <Button title="Open Weekly Schedule" route="WeeklySchedule" />
        <Button title="Open Pomodoro Timer" route="PomodoroTimer" />
        <Button title="Open Subjects" route="SubjectsList" />
        <Button title="Log Out" danger />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 15, color: '#6B7280', marginTop: 8, marginBottom: 24 },
  button: {
    width: 260, height: 48, borderRadius: 12, backgroundColor: '#4F46E5',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  logout: { backgroundColor: '#EF4444' },
  buttonText: { color: '#fff', fontWeight: '700' },
});