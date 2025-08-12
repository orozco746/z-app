// types.ts
import { Timestamp } from 'firebase/firestore';

export type RootStackParamList = {
  Login: undefined;
  Cuestionario: undefined;
  Tabs: { screen: keyof BottomTabParamList } | undefined;
};

export type BottomTabParamList = {
  Inicio: undefined;
  Trading: undefined;
  Inversiones: undefined;
  RentaFija: undefined;
};

export interface UserData {
  uid: string;
  correo: string;
  displayName: string;
  photoURL: string;
  score: number;
  rank: string;
  saldoTotal: number;
  saldoRentaFija: number;
  saldoInversiones: number;
  saldoTrading: number;
  gananciasRentaFija: number;
  gananciasInversiones: number;
  gananciasTrading: number;
  inversiones: string[];
  operacionesTrading: string[];
  historialLogros: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
