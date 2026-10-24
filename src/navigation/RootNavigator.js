import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

import TodoListScreen from '../screens/TodoListScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';

import WeeklyScheduleScreen from '../screens/WeeklyScheduleScreen';
import AddStudySessionScreen from '../screens/AddStudySessionScreen';
import SessionDetailsScreen from '../screens/SessionDetailsScreen';

import PomodoroTimerScreen from '../screens/PomodoroTimerScreen';
import SubjectsListScreen from '../screens/SubjectsListScreen';
import SubjectDetailsScreen from '../screens/SubjectDetailsScreen';

import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeDashboardScreen} options={{ headerShown: false }} />

            <Stack.Screen name="TodoList" component={TodoListScreen} options={{ title: 'Tasks' }} />
            <Stack.Screen name="AddEditTask" component={AddEditTaskScreen} options={{ title: 'Task' }} />
            <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />

            <Stack.Screen name="WeeklySchedule" component={WeeklyScheduleScreen} options={{ title: 'Schedule' }} />
            <Stack.Screen name="AddStudySession" component={AddStudySessionScreen} options={{ title: 'Study Session' }} />
            <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} options={{ title: 'Session Details' }} />

            <Stack.Screen name="PomodoroTimer" component={PomodoroTimerScreen} options={{ title: 'Timer' }} />
            <Stack.Screen name="SubjectsList" component={SubjectsListScreen} options={{ title: 'Subjects' }} />
            <Stack.Screen name="SubjectDetails" component={SubjectDetailsScreen} options={{ title: 'Subject' }} />

            <Stack.Screen name="ProgressTracking" component={ProgressTrackingScreen} options={{ title: 'Progress' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Reminders' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}