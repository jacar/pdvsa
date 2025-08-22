import React, { useState, useCallback } from 'react';
import { UserData } from '../types';
import BiometricControl from './HikvisionControl';
import { UserIcon, EmailIcon, PhoneIcon, HomeIcon, ShieldIcon, BriefcaseIcon } from './icons/Icons';

interface PreRouteScreenProps {
  onStartRoute: (userData: UserData) => void;
}

const InfoDisplayRow: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center p-2 rounded">
        <div className="text-blue-500">{icon}</div>
        <div className="ml-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const PreRouteScreen: React.FC<PreRouteScreenProps> = ({ onStartRoute }) => {
  const [passengerData, setPassengerData] = useState<UserData | null>(null);

  const handleScanSuccess = useCallback((userData: UserData) => {
    setPassengerData(userData);
  }, []);

  const handleScanReset = useCallback(() => {
    setPassengerData(null);
  }, []);

  return (
    <div className="p-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro de Viaje</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Identifique al pasajero con el lector biométrico para iniciar la ruta.
        </p>
      </header>

      <BiometricControl onScanSuccess={handleScanSuccess} onScanReset={handleScanReset} />

      {passengerData && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Pasajero Identificado</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <InfoDisplayRow label="Nombre Completo" value={passengerData.fullName} icon={<UserIcon />} />
              {passengerData.department && <InfoDisplayRow label="Gerencia" value={passengerData.department} icon={<BriefcaseIcon />} />}
              <InfoDisplayRow label="Correo Electrónico" value={passengerData.email} icon={<EmailIcon />} />
              <InfoDisplayRow label="Teléfono" value={passengerData.phone} icon={<PhoneIcon />} />
              <InfoDisplayRow label="Dirección" value={passengerData.address} icon={<HomeIcon />} />
              <InfoDisplayRow label="Contacto de Emergencia" value={`${passengerData.emergencyContactName} (${passengerData.emergencyContactPhone})`} icon={<ShieldIcon />} />
          </div>
          <div className="pt-6">
            <button
              onClick={() => onStartRoute(passengerData)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Iniciar Ruta con {passengerData.fullName.split(' ')[0]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreRouteScreen;