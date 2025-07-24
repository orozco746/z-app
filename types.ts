// types.ts
import { Timestamp } from 'firebase/firestore';

export type RootStackParamList = {
  Inicio: undefined;      // Puede ser el wrapper del BottomTabs
  Simulador: undefined;   // (si tienes otra screen tipo quiz o detalle)
  RentaFija: undefined;   // Sólo si la usas desde stack también
  Trading: undefined;
  Inversiones: undefined;
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

