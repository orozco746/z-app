import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export const getSaldosUsuario = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  const docRef = doc(db, 'usuarios', user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const actualizarSaldo = async (campo: string, valor: number) => {
  const user = auth.currentUser;
  if (!user) return;
  const docRef = doc(db, 'usuarios', user.uid);
  await updateDoc(docRef, {
    [campo]: valor
  });
};
