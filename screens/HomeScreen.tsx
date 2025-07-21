// screens/HomeScreen.tsx
import React from 'react';
import { Image, View, Text, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { formatearSaldo } from '../utils/format';
import { doc, getDoc } from 'firebase/firestore';
import { UserData } from '../types'; // si tienes definido tu tipo
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';



export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [userData, setUserData] = useState<UserData | null>(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }
    }
  });

  return unsubscribe;
}, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const saldoTotal = 100000;
  const saldoTrading = 30000;
  const saldoInversiones = 30000;
  const saldoRentaFija = 40000;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido{user?.displayName ? `, ${user.displayName}` : ''} 👋</Text>
      {userData?.photoURL && (
        <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
      )}
      <Text style={styles.username}>
        👋 Hola, {userData?.displayName || 'Usuario'}
      </Text>
      <Text style={styles.info}>🎯 Nivel: {userData?.nivel || '---'}</Text>
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

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
  card: {
    backgroundColor: '#e0f2fe',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    marginBottom: 15,
    alignItems: 'center',
  },
  cardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  cardMini: {
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
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
