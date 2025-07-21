import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { guardarUsuarioGoogle } from '../services/firebaseUser';



WebBrowser.maybeCompleteAuthSession();



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: 'TU_CLIENT_ID_WEB', // Web Client ID desde Firebase > Auth > Google
});

useEffect(() => {
  if (response?.type === 'success') {
    const { id_token } = (response.authentication || {}) as { id_token?: string };
    if (id_token) {
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCred) => {
          const user = userCred.user;
          const nombre = user.displayName ?? 'Usuario';
          const email = user.email ?? 'sin-email';
          await guardarUsuarioGoogle(user.uid, nombre, email);
          console.log('Usuario de Google guardado en Firestore');
        })
        .catch((err) => console.log('Error al autenticar con Google:', err));
    }
  }
}, [response]);


  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña.');
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('Registro exitoso', '¡Bienvenido!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Ingreso exitoso', 'Bienvenido de nuevo');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Pressable style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.toggle}>
          {isRegistering
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </Text>
      </Pressable>
      <Pressable
  style={[styles.button, { backgroundColor: '#db4437' }]}
  onPress={() => promptAsync()}
>
  <Text style={styles.buttonText}>Entrar con Google</Text>
</Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  toggle: {
    color: '#1d4ed8',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
