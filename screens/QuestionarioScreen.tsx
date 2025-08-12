import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function QuestionarioScreen() {
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [experiencia, setExperiencia] = useState('');

  const guardarRespuestas = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Error', 'No hay usuario autenticado.');

    try {
      await addDoc(collection(db, 'respuestasCuestionario'), {
        uid: user.uid,
        correo: user.email,
        nombre,
        objetivo,
        experiencia,
        createdAt: serverTimestamp(),
      });

      Alert.alert('¡Gracias!', 'Tu perfil ha sido guardado exitosamente.');
      setNombre('');
      setObjetivo('');
      setExperiencia('');
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Cuestionario de Perfil</Text>

      <TextInput
        placeholder="¿Cómo te gustaría que te llamemos?"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="¿Cuál es tu objetivo con el simulador?"
        value={objetivo}
        onChangeText={setObjetivo}
        style={styles.input}
      />

      <TextInput
        placeholder="¿Tienes experiencia en inversiones?"
        value={experiencia}
        onChangeText={setExperiencia}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={guardarRespuestas}>
        <Text style={styles.buttonText}>💾 Guardar respuestas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f9fafb' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
