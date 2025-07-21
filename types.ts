// types.ts

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
  rank: string;
  score: number;
  nivel?: string; // si lo agregas más adelante
  saldoRentaFija: number;
  saldoInversiones: number;
  saldoTrading: number;
  saldoTotal: number;
  gananciasRentaFija: number;
  gananciasInversiones: number;
  gananciasTrading: number;
  inversiones: string[];           // actualmente son array de string vacías
  operacionesTrading: string[];    // igual que arriba
  historialLogros: string[];       // igual que arriba
  createdAt?: any;
  updatedAt?: any;
}
