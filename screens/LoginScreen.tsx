import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, RootStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 👇 Esto soluciona el error: 'Inicio' not assignable to 'never'

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    try {
      let userCredential;

      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const saldoInicial = 100000;

        await setDoc(doc(db, 'usuarios', user.uid), {
          uid: user.uid,
          correo: user.email,
          displayName: 'Jugador anónimo',
          photoURL: 'https://example.com/default.png',
          score: 0,
          rank: 'Novato',
          saldoTotal: saldoInicial,
          saldoRentaFija: 0,
          saldoInversiones: 0,
          saldoTrading: 0,
          gananciasRentaFija: 0,
          gananciasInversiones: 0,
          gananciasTrading: 0,
          inversiones: [],
          operacionesTrading: [],
          historialLogros: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      navigation.navigate('Tabs', { screen: 'Inicio' });

    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Tabs', { screen: 'Inicio' });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Portafolio</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
        </Text>
      </Pressable>

      <Text style={styles.toggleText} onPress={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? '¿Ya tienes cuenta? Inicia sesión'
          : '¿No tienes cuenta? Regístrate'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleText: {
    marginTop: 16,
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '500',
  },
});
