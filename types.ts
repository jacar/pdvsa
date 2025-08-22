export interface Driver {
  name: string;
  unit: string;
}

export interface Trip {
  date: Date;
  route: string;
}

export interface Passenger {
  name: string;
  cedula: string;
  department: string;
  time: string;
}

export interface TripReportData {
  area: string;
  driver: Driver;
  trip: Trip;
  passengers: Passenger[];
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  biometricId?: string;
}

export enum ConnectionStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

export enum BiometricStatus {
  IDLE,
  SCANNING,
  SUCCESS,
  FAILED,
}
