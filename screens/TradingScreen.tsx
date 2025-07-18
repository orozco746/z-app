import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import CandlestickChart from '../components/CandlestickChart';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserData } from '../types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types';

type NavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Trading'>;

const candles = [
  { open: 100, high: 110, low: 95, close: 105 },
  { open: 105, high: 112, low: 101, close: 102 },
  { open: 102, high: 108, low: 100, close: 107 },
  { open: 107, high: 115, low: 105, close: 110 },
  { open: 110, high: 120, low: 109, close: 117 },
];

const opciones = ['Largo', 'Corto', 'Esperar', 'No operar'];

export default function TradingScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const lastClose = candles[candles.length - 1].close;

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;

        const total = data.saldoTotal || 1;
        const pctRentaFija = (data.saldoRentaFija / total) * 100;
        const pctInversiones = (data.saldoInversiones / total) * 100;

        const cumple =
          pctRentaFija >= 70 && pctRentaFija <= 100 &&
          pctInversiones >= 20 && pctInversiones <= 30;

        if (!cumple) {
          Alert.alert(
            'Requisitos no cumplidos',
            'Para operar en Trading necesitas tener entre 70-100% en renta fija y 20-30% en inversiones.'
          );
          navigation.navigate('Inicio');
          return;
        }

        setUserData(data);
      }
    };

    fetchUser();
  }, []);

  const resetForm = () => {
    setSelectedDecision(null);
    setStopLoss('');
    setTakeProfit('');
  };

  const confirmarOperacion = () => {
    if (!stopLoss || !takeProfit) {
      Alert.alert('Faltan datos', 'Por favor ingresa Stop Loss y Take Profit');
      return;
    }

    Alert.alert(
      'Operación registrada',
      `Tipo: ${selectedDecision}\nEntrada: $${lastClose}\nSL: $${stopLoss}\nTP: $${takeProfit}`
    );

    resetForm();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Simulador de Trading</Text>

      <CandlestickChart data={candles} width={340} height={260} />

      <Text style={styles.question}>¿Qué decisión tomarías en esta gráfica?</Text>

      <View style={styles.optionsContainer}>
        {opciones.map((opcion) => (
          <Pressable
            key={opcion}
            onPress={() => setSelectedDecision(opcion)}
            style={[
              styles.optionButton,
              selectedDecision === opcion && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedDecision === opcion && styles.optionTextSelected,
              ]}
            >
              {opcion}
            </Text>
          </Pressable>
        ))}
      </View>

      {(selectedDecision === 'Largo' || selectedDecision === 'Corto') && (
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>📍 Entrada: ${lastClose}</Text>

          <TextInput
            style={styles.input}
            placeholder="Stop Loss"
            keyboardType="numeric"
            value={stopLoss}
            onChangeText={setStopLoss}
          />
          <TextInput
            style={styles.input}
            placeholder="Take Profit"
            keyboardType="numeric"
            value={takeProfit}
            onChangeText={setTakeProfit}
          />

          <Pressable style={styles.confirmButton} onPress={confirmarOperacion}>
            <Text style={styles.confirmText}>✅ Confirmar operación</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#1f2937',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    margin: 6,
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  optionSelected: {
    backgroundColor: '#2563eb',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#1f2937',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
