// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import QuestionarioScreen from './screens/QuestionarioScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();


function AppNavigation() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Tabs" component={BottomTabs} />
            <Stack.Screen name="Cuestionario" component={QuestionarioScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
