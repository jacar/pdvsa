import { UserData, ConnectionStatus } from '../types';

const WEBSOCKET_URL = 'ws://localhost:12345';

type StatusListener = (status: ConnectionStatus) => void;
type DataListener = (data: UserData) => void;
type ErrorListener = (error: string) => void;

class BiometricService {
  private static instance: BiometricService;
  private ws: WebSocket | null = null;
  private statusListeners: Set<StatusListener> = new Set();
  private dataListeners: Set<DataListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private connectionTimeout: number | null = null;


  private constructor() {
    // El constructor es privado para el patrón Singleton.
  }

  public static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService();
    }
    return BiometricService.instance;
  }

  private setStatus(status: ConnectionStatus) {
    if (this.connectionStatus === status) return;
    this.connectionStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    
    this.setStatus(ConnectionStatus.CONNECTING);
    
    this.connectionTimeout = window.setTimeout(() => {
      if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
        console.error("Timeout de conexión WebSocket. El servicio no respondió a tiempo.");
        this.ws.close();
      }
    }, 3000); // 3-second timeout

    this.ws = new WebSocket(WEBSOCKET_URL);

    this.ws.onopen = () => {
      if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
      console.log("Conectado al servicio biométrico local.");
      this.setStatus(ConnectionStatus.CONNECTED);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.status === 'success' && message.data) {
          console.log("Datos del pasajero recibidos:", message.data);
          this.dataListeners.forEach(listener => listener(message.data as UserData));
        } else if (message.status === 'error') {
          console.error("Error desde el servicio biométrico:", message.message);
          this.errorListeners.forEach(listener => listener(message.message || 'Error desconocido del lector.'));
        }
      } catch (error) {
        console.error("Error al procesar el mensaje del servicio biométrico:", error);
        this.errorListeners.forEach(listener => listener('Respuesta inválida del servicio local.'));
      }
    };

    this.ws.onerror = (event) => {
      if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
      console.error("Error en la conexión WebSocket. Verifique que el servicio en 'ws://localhost:12345' esté en ejecución.");
      this.setStatus(ConnectionStatus.ERROR);
    };

    this.ws.onclose = () => {
      if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
      console.log("Desconectado del servicio biométrico local.");
      // Si el estado ya es ERROR (por timeout o error explícito), no lo cambies a DISCONNECTED.
      if (this.connectionStatus !== ConnectionStatus.ERROR) {
          this.setStatus(ConnectionStatus.DISCONNECTED);
      }
      this.ws = null;
    };
  }

  public startScan() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Enviando comando de escaneo al servicio local...");
      this.ws.send(JSON.stringify({ command: 'scan' }));
    } else {
      console.error("No se puede iniciar el escaneo, no hay conexión con el servicio biométrico.");
      this.errorListeners.forEach(listener => listener('No hay conexión con el lector.'));
      this.connect(); // Intenta reconectar
    }
  }
  
  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    // Enviar el estado actual inmediatamente
    listener(this.connectionStatus);
    return () => this.statusListeners.delete(listener);
  }

  public onData(listener: DataListener): () => void {
    this.dataListeners.add(listener);
    return () => this.dataListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  public getConnectionStatus(): ConnectionStatus {
      return this.connectionStatus;
  }
}

export const biometricService = BiometricService.getInstance();