import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import globalStyles from '../styles/globalStyles';

type Inversion = {
  id: string;
  activo: string;
  saldo: number;
  ganancia: number;
};

const activosDisponibles = [
  { nombre: 'Apple', saldo: 25000, ganancia: 700 },
  { nombre: 'Tesla', saldo: 22000, ganancia: -1500 },
  { nombre: 'Gold', saldo: 18000, ganancia: 600 },
  { nombre: 'S&P500', saldo: 30000, ganancia: 900 },
];

export default function InversionesScreen() {
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [saldoInversiones, setSaldoInversiones] = useState(0);

  useEffect(() => {
    const fetchSaldo = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSaldoInversiones(data.saldoInversiones || 0);
      }
    };
    fetchSaldo();
  }, []);

  const updateSaldoInversiones = async (nuevoSaldo: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, 'usuarios', user.uid);
    await updateDoc(docRef, {
      saldoInversiones: nuevoSaldo,
    });
    setSaldoInversiones(nuevoSaldo);
  };

  const cerrarInversion = async (id: string) => {
    const cerrada = inversiones.find(inv => inv.id === id);
    const liberado = cerrada!.saldo + cerrada!.ganancia;
    Alert.alert(
      'Inversión cerrada',
      `Has cerrado tu inversión en ${cerrada?.activo}.
Saldo liberado: $${liberado.toLocaleString()}.`
    );
    const nuevas = inversiones.filter(inv => inv.id !== id);
    setInversiones(nuevas);
    await updateSaldoInversiones(saldoInversiones + liberado);
  };

  const añadirInversion = async () => {
    const random = activosDisponibles[Math.floor(Math.random() * activosDisponibles.length)];
    const nueva: Inversion = {
      id: Date.now().toString(),
      activo: random.nombre,
      saldo: random.saldo,
      ganancia: random.ganancia,
    };
    setInversiones(prev => [...prev, nueva]);
    await updateSaldoInversiones(saldoInversiones - random.saldo);
    Alert.alert('Inversión añadida', `Inversión en ${nueva.activo} creada con éxito.`);
  };

  const renderItem = ({ item }: { item: Inversion }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.activo}</Text>
      <Text>💼 Saldo invertido: ${item.saldo.toLocaleString()}</Text>
      <Text style={{ color: item.ganancia >= 0 ? 'green' : 'red' }}>
        📈 {item.ganancia >= 0 ? 'Ganancia' : 'Pérdida'}: ${item.ganancia.toLocaleString()}
      </Text>
      <Pressable style={styles.closeButton} onPress={() => cerrarInversion(item.id)}>
        <Text style={styles.buttonText}>Cerrar inversión</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>📈 Inversiones Actuales</Text>

      <FlatList
        data={inversiones}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <Pressable style={styles.addButton} onPress={añadirInversion}>
        <Text style={styles.addButtonText}>➕ Añadir inversión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  addButton: {
    backgroundColor: '#1d4ed8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});