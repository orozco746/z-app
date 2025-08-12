// screens/HomeScreen.tsx
import React from 'react';
import { Image, View, Text, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { formatearSaldo } from '../utils/format';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export default function HomeScreen() {
  const { user, userData, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido{user?.displayName ? `, ${user.displayName}` : ''} 👋</Text>

      {userData?.photoURL && (
        <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
      )}

      <Text style={styles.username}>👋 Hola, {userData?.displayName || 'Usuario'}</Text>
      <Text style={styles.info}>🎯 Rank: {userData?.rank || '---'}</Text>
      <Text style={styles.info}>🏅 Score: {userData?.score ?? 0}</Text>

      <Text style={styles.subtitle}>Tu portafolio actual:</Text>

      <View style={styles.saldosContainer}>
        <View style={styles.saldoBox}>
          <Text style={styles.saldoLabel}>Trading</Text>
          <Text style={styles.saldoValor}>
            {formatearSaldo(userData?.saldoTrading || 0)}
          </Text>
        </View>
        <View style={styles.saldoBox}>
          <Text style={styles.saldoLabel}>Inversiones</Text>
          <Text style={styles.saldoValor}>
            {formatearSaldo(userData?.saldoInversiones || 0)}
          </Text>
        </View>
        <View style={styles.saldoBox}>
          <Text style={styles.saldoLabel}>Renta fija</Text>
          <Text style={styles.saldoValor}>
            {formatearSaldo(userData?.saldoRentaFija || 0)}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Accesos útiles:</Text>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL('https://www.investing.com/news/')}
      >
        <Text style={styles.linkText}>📰 Noticias financieras</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL('https://alternative.me/crypto/fear-and-greed-index/')}
      >
        <Text style={styles.linkText}>😨 Greed & Fear Index</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL('https://www.investing.com/economic-calendar/')}
      >
        <Text style={styles.linkText}>📅 Calendario económico</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1f2937',
  },
  info: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#374151',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: '#dbeafe',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginVertical: 5,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d4ed8',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: '90%',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saldosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  saldoBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 90,
  },
  saldoLabel: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 2,
    textAlign: 'center',
  },
  saldoValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
});
