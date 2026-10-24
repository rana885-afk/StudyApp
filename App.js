import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TasksProvider } from './src/viewmodels/useTasks';
import { ScheduleProvider } from './src/viewmodels/useSchedule';
import { SubjectsProvider } from './src/viewmodels/useSubjects';
import { RemindersProvider } from './src/viewmodels/useReminders';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TasksProvider>
          <ScheduleProvider>
            <SubjectsProvider>
              <RemindersProvider>
                <StatusBar style="dark" />
                <RootNavigator />
              </RemindersProvider>
            </SubjectsProvider>
          </ScheduleProvider>
        </TasksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}