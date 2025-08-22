import React, { useState, useCallback, useEffect } from 'react';
import { BiometricStatus, ConnectionStatus, UserData } from '../types';
import { biometricService } from '../services/hikvisionService';
import { FingerprintIcon } from './icons/Icons';

interface BiometricControlProps {
  onScanSuccess: (userData: UserData) => void;
  onScanReset: () => void;
}

const BiometricControl: React.FC<BiometricControlProps> = ({ onScanSuccess, onScanReset }) => {
  const [scanStatus, setScanStatus] = useState<BiometricStatus>(BiometricStatus.IDLE);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(biometricService.getConnectionStatus());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    biometricService.connect();

    const unsubscribeStatus = biometricService.onStatusChange(setConnectionStatus);
    const unsubscribeData = biometricService.onData((userData) => {
      setScanStatus(BiometricStatus.SUCCESS);
      onScanSuccess(userData);
    });
    const unsubscribeError = biometricService.onError((errorMessage) => {
      setError(errorMessage);
      setScanStatus(BiometricStatus.FAILED);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeData();
      unsubscribeError();
    };
  }, [onScanSuccess]);

  const handleScan = useCallback(() => {
    if (scanStatus === BiometricStatus.SUCCESS) {
      onScanReset();
      setScanStatus(BiometricStatus.IDLE);
      setError('');
      return;
    }

    setScanStatus(BiometricStatus.SCANNING);
    setError('');
    biometricService.startScan();
  }, [onScanReset, scanStatus]);

  const handleDemoScan = useCallback(() => {
    const mockPassenger: UserData = {
        fullName: 'Anelisa Josefina Huerta Delgado',
        email: 'ahuerta@example.com',
        phone: '0414-1234567',
        address: 'Av. Principal, Edif. A, Apto 1',
        emergencyContactName: 'Carlos Huerta',
        emergencyContactPhone: '0412-7654321',
        biometricId: '14475713',
        department: 'INGENIERIA DE PETROLEO',
    };
    onScanSuccess(mockPassenger);
    setScanStatus(BiometricStatus.SUCCESS);
  }, [onScanSuccess]);

  const getStatusContent = () => {
    // Prioridad a los mensajes de conexión
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTING:
        return {
          iconColor: 'text-yellow-500 animate-pulse',
          text: 'Conectando al servicio biométrico...',
          buttonText: 'Espere...',
          buttonDisabled: true,
        };
      case ConnectionStatus.ERROR:
        return {
          iconColor: 'text-red-500',
          text: 'Error de conexión. Asegúrese que el software del lector esté activo.',
          buttonText: 'Reintentar Conexión',
          buttonDisabled: false,
          buttonAction: () => biometricService.connect(),
          showDemoButton: true,
        };
      case ConnectionStatus.DISCONNECTED:
         return {
          iconColor: 'text-gray-400',
          text: 'Servicio desconectado.',
          buttonText: 'Conectar',
          buttonDisabled: false,
          buttonAction: () => biometricService.connect(),
        };
    }

    // Mensajes de estado del escaneo
    switch (scanStatus) {
      case BiometricStatus.SCANNING:
        return {
          iconColor: 'text-blue-500 animate-pulse',
          text: 'Esperando huella en el lector...',
          buttonText: 'Escaneando...',
          buttonDisabled: true,
        };
      case BiometricStatus.SUCCESS:
        return {
          iconColor: 'text-green-500',
          text: 'Huella reconocida exitosamente.',
          buttonText: 'Escanear de Nuevo',
          buttonDisabled: false,
        };
      case BiometricStatus.FAILED:
        return {
          iconColor: 'text-red-500',
          text: error,
          buttonText: 'Reintentar Escaneo',
          buttonDisabled: false,
        };
      case BiometricStatus.IDLE:
      default:
        return {
          iconColor: 'text-gray-400 dark:text-gray-500',
          text: 'Listo para escanear la huella del pasajero.',
          buttonText: 'Iniciar Escaneo',
          buttonDisabled: false,
        };
    }
  };

  const { iconColor, text, buttonText, buttonDisabled, buttonAction, showDemoButton } = getStatusContent();

  return (
    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex flex-col items-center text-center">
      <div className={`p-4 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-300 ${scanStatus === BiometricStatus.SUCCESS ? 'bg-green-100 dark:bg-green-900/50' : ''} ${connectionStatus === ConnectionStatus.ERROR || scanStatus === BiometricStatus.FAILED ? 'bg-red-100 dark:bg-red-900/50' : ''}`}>
        <FingerprintIcon className={`w-16 h-16 transition-colors duration-300 ${iconColor}`} />
      </div>
      <p className={`mt-4 text-sm font-medium h-10 flex items-center justify-center ${
          connectionStatus === ConnectionStatus.ERROR || scanStatus === BiometricStatus.FAILED ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {text}
      </p>
      <div className="flex flex-col items-center">
        <button
          onClick={buttonAction || handleScan}
          disabled={buttonDisabled}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
        {showDemoButton && (
          <button
            onClick={handleDemoScan}
            className="mt-2 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-200"
          >
            Usar Modo de Demostración
          </button>
        )}
      </div>
    </div>
  );
};

export default BiometricControl;