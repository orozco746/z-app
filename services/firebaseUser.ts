// services/firebaseUser.ts

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const guardarUsuarioGoogle = async (uid: string, nombre: string, email: string) => {
  const userRef = doc(db, 'usuarios', uid);
  await setDoc(userRef, {
    id: uid,
    nombre,
    email,
    saldoTotal: 100000,
    saldoTrading: 30000,
    saldoInversiones: 30000,
    saldoRentaFija: 40000,
    gananciasAcumuladas: 0,
    operacionesRealizadas: 0,
    nivel: 'básico',
    creadoEn: new Date().toISOString()
  }, { merge: true });
};
