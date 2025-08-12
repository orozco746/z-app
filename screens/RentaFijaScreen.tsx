import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { formatearSaldo } from '../utils/format';

const screenWidth = Dimensions.get('window').width;

const categories = ['CDT', 'Propiedad raíz', 'Proyectos', 'Otros'];

const monedas = [
  { code: 'USD', exchangeRate: 1, rendimiento: 4.35 },
  { code: 'COP', exchangeRate: 4125, rendimiento: 9.25 },
  { code: 'MXN', exchangeRate: 16.8 },
  { code: 'EUR', exchangeRate: 0.93 },
  { code: 'YEN', exchangeRate: 156 },
  { code: 'AUD', exchangeRate: 1.5 },
];

export default function RentaFijaScreen() {
  const { userData } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [monto, setMonto] = useState('');

  const handleInversion = async () => {
    const cantidadCOP = parseFloat(monto);

    if (isNaN(cantidadCOP) || cantidadCOP <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un valor mayor a 0.');
      return;
    }

    if (!userData || cantidadCOP > userData.saldoTotal * 4125) {
      Alert.alert('Saldo insuficiente', 'No tienes suficiente saldo disponible.');
      return;
    }

    // Conversión de COP a USD
    const selectedMoneda = monedas.find((moneda) => moneda.code === selectedCurrency);
    if (!selectedMoneda) {
      Alert.alert('Moneda no válida', 'Por favor selecciona una moneda válida.');
      return;
    }

    // Conversión
    const cantidadUSD = cantidadCOP / selectedMoneda.exchangeRate;

    if (cantidadUSD > userData.saldoTotal) {
      Alert.alert('Saldo insuficiente', 'No tienes suficiente saldo en USD para esta inversión.');
      return;
    }

    try {
      const userRef = doc(db, 'usuarios', userData.uid);

      // Actualización en Firestore (saldoTotal - USD, saldoRentaFija + COP)
      await updateDoc(userRef, {
        saldoTotal: increment(-cantidadUSD),
        saldoRentaFija: increment(cantidadCOP),
      });

      Alert.alert('¡CDT tomado!', `Inversión de ${formatearSaldo(cantidadCOP)} COP en ${selectedCurrency}`);
      setMonto('');
      setSelectedCurrency(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo procesar la inversión.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inversiones en Renta Fija</Text>

      {!selectedCategory && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Pressable key={cat} style={styles.card} onPress={() => setSelectedCategory(cat)}>
              <Text style={styles.cardTitle}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {selectedCategory === 'CDT' && !selectedCurrency && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {monedas.map((moneda) => (
            <Pressable
              key={moneda.code}
              style={styles.card}
              onPress={() => setSelectedCurrency(moneda.code)}
            >
              <Text style={styles.cardTitle}>{moneda.code}</Text>
              {moneda.rendimiento && (
                <Text style={styles.rateText}>
                  1 USD ≈ {moneda.exchangeRate} {moneda.code}
                </Text>
              )}
              {moneda.rendimiento && (
                <Text style={styles.rateText}>Rendimiento: {moneda.rendimiento}% E.A.</Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      )}

      {selectedCurrency && (
        <View style={styles.form}>
          <Text style={styles.label}>¿Cuánto deseas invertir en {selectedCurrency}?</Text>
          <TextInput
            value={monto}
            onChangeText={setMonto}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Ej: 50000"
          />
          <Pressable style={styles.invertirBtn} onPress={handleInversion}>
            <Text style={styles.invertirText}>Invertir</Text>
          </Pressable>
          <Pressable style={styles.volverBtn} onPress={() => setSelectedCurrency(null)}>
            <Text style={styles.volverText}>← Volver a monedas</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.bottomButtons}>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Mis inversiones</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Retirar ganancias</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#e0f2fe',
    width: screenWidth * 0.7,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  rateText: {
    fontSize: 14,
    color: '#475569',
  },
  form: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1e293b',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  invertirBtn: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
  },
  invertirText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  volverBtn: {
    padding: 10,
  },
  volverText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  bottomButtons: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    width: '80%',
  },
  secondaryText: {
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '600',
  },
});
