// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TradingScreen from '../screens/TradingScreen';
import RentaFijaScreen from '../screens/RentaFijaScreen';
import InversionesScreen from '../screens/InversionesScreen'; // (puedes crearla luego)

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Inversiones" component={InversionesScreen} />
      <Tab.Screen name="RentaFija" component={RentaFijaScreen} />

    </Tab.Navigator>
  );
}
