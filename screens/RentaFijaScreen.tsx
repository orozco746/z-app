import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';


export default function RentaFijaScreen() {
  type NavigationProp = BottomTabNavigationProp<BottomTabParamList, 'RentaFija'>;
  const navigation = useNavigation<NavigationProp>();

  const [saldo, setSaldo] = useState(0);
  const [ganancias, setGanancias] = useState(0);

  useEffect(() => {
    const fetchDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSaldo(data.saldoRentaFija || 0);
        setGanancias(data.gananciasRentaFija || 0);
      }
    };

    fetchDatos();
  }, []);

  const retirarGanancias = async () => {
    Alert.alert('Éxito', `Has retirado $${ganancias.toLocaleString()} en ganancias.`);
    setGanancias(0);
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, 'usuarios', user.uid);
    await updateDoc(docRef, {
      gananciasRentaFija: 0
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renta Fija</Text>

      <Text style={styles.label}>Saldo invertido:</Text>
      <Text style={styles.value}>${saldo.toLocaleString()}</Text>

      <Text style={styles.label}>Ganancias disponibles:</Text>
      <Text style={styles.value}>${ganancias.toLocaleString()}</Text>

      <Button
        title="Retirar ganancias"
        onPress={retirarGanancias}
        disabled={ganancias <= 0}
      />

      <View style={{ marginTop: 30 }}>
        <Button title="Volver al inicio" onPress={() => navigation.navigate('Inicio')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  label: { fontSize: 18, marginTop: 10 },
  value: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
});