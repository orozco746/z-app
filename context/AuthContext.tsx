import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { UserData } from '../types';

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => void;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: () => {},
  refreshUserData: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, 'usuarios', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setUserData(snap.data() as UserData);
    } else {
      setUserData(null);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
