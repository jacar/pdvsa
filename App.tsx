import React, { useState, useCallback } from 'react';
import { UserData, TripReportData, Passenger } from './types';
import PreRouteScreen from './components/RegistrationForm';
import TripReport from './components/TripReport';

const App: React.FC = () => {
    const [reportData, setReportData] = useState<TripReportData | null>(null);

    const handleTripStart = useCallback((passenger: UserData) => {
        // En una aplicación real, aquí comenzaría el seguimiento del viaje.
        // Para este demo, consideramos el viaje finalizado inmediatamente y generamos el reporte.

        // 1. Convierte UserData a Passenger para el formato del reporte
        const reportPassenger: Passenger = {
            name: passenger.fullName.toUpperCase(),
            // Estos campos no están en UserData, se podrían añadir al servicio biométrico
            cedula: passenger.biometricId || 'N/A', // Usando biometricId como placeholder
            department: 'N/A',
            time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        // 2. Crea el objeto de datos completo para el reporte
        const newReportData: TripReportData = {
            area: 'ADMINISTRATIVA-RICHMOND',
            driver: {
                name: 'ALBERTO ROMERO',
                unit: '274',
            },
            trip: {
                date: new Date(), // Usa la fecha y hora actual
                route: 'LOS MODINES- SANTA FE-RICHMOND',
            },
            passengers: [reportPassenger], // Incluye al pasajero identificado
        };

        // 3. Actualiza el estado para mostrar la pantalla de reporte
        setReportData(newReportData);
    }, []);

    const handleReset = useCallback(() => {
        setReportData(null); // Vuelve a la pantalla de registro
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 font-sans">
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-x-auto transition-all duration-500">
                {reportData ? (
                    <TripReport data={reportData} onReset={handleReset} />
                ) : (
                    <PreRouteScreen onStartRoute={handleTripStart} />
                )}
            </div>
            <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
                <p>&copy; 2024 Corporación J.F. C.A. Todos los derechos reservados.</p>
            </footer>
        </main>
    );
};

export default App;
