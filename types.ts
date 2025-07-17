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

export type UserData = {
  id: string;
  nombre: string;
  email?: string;
  saldoTotal: number;
  saldoTrading: number;
  saldoInversiones: number;
  saldoRentaFija: number;
  gananciasAcumuladas: number;
  operacionesRealizadas: number;
  nivel?: string; // básico, intermedio, avanzado
};

