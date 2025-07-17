// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppNavigation() {
  const { user, loading } = useAuth();

  if (loading) return null; // opcional: puedes poner un spinner

  return (
    <NavigationContainer>
      {user ? <BottomTabs /> : <LoginScreen />}
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
