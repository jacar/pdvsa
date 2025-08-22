import React from 'react';
import { TripReportData } from '../types';

interface TripReportProps {
    data: TripReportData;
    onReset: () => void;
}

// Component to display the trip report
const TripReport: React.FC<TripReportProps> = ({ data, onReset }) => {
    const { area, driver, trip, passengers } = data;
    const tripDate = trip.date;
    const isPM = tripDate.getHours() >= 12;

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white text-black font-mono text-xs sm:text-sm">
            {/* Header with Logos and Title */}
            <header className="grid grid-cols-[1fr_2fr_1fr] items-center pb-4 border-b-2 border-black">
                <div className="flex justify-start items-center">
                    {/* PDVSA Logo Placeholder */}
                    <div className="w-32 h-16 flex flex-col items-center justify-center bg-red-600 text-white font-sans p-1">
                        <span className="text-2xl font-bold">PDVSA</span>
                        <span className="text-xs font-semibold">PETROBOSCÁN</span>
                    </div>
                </div>
                <h1 className="col-span-1 text-center font-bold text-base sm:text-lg whitespace-nowrap">
                    REPORTE DE VIAJES DIARIOS
                </h1>
                <div className="flex justify-end items-center text-right">
                    {/* JF Logo Placeholder */}
                    <div className="text-center font-sans">
                        <div className="w-16 h-16 flex items-center justify-center border-[3px] border-blue-700 rounded-full text-blue-700 font-bold relative">
                            <span className="text-4xl italic">JF</span>
                            <span className="absolute top-0 right-0 text-xs font-bold">C.A</span>
                        </div>
                        <p className="text-xs mt-1 font-semibold">RIF: J-50014920-4</p>
                    </div>
                </div>
            </header>

            {/* Sub-header with Area */}
            <section className="py-2">
                <div className="inline-block border-2 border-black">
                    <p className="font-bold text-center bg-gray-300 px-4 py-1 border-b-2 border-black">AREA</p>
                    <p className="text-center px-4 py-1 font-semibold">{area}</p>
                </div>
            </section>

            {/* Conductor and Trip Info */}
            <section className="border-t-2 border-b-2 border-black py-1">
                <div className="flex justify-between items-end">
                    <p className="font-bold">CONDUCTOR: {driver.name}</p>
                    <p className="font-bold text-right">UNIDAD: {driver.unit}</p>
                </div>
                <div className="grid grid-cols-[auto_auto_auto_auto_1fr_auto_auto] items-stretch border-t-2 border-b-2 border-black mt-1">
                    <div className="text-center border-r-2 border-black"><p className="font-bold p-1 border-b-2 border-black">DIA</p><p className="p-1 font-semibold">{tripDate.getDate()}</p></div>
                    <div className="text-center border-r-2 border-black"><p className="font-bold p-1 border-b-2 border-black">MES</p><p className="p-1 font-semibold">{tripDate.getMonth() + 1}</p></div>
                    <div className="text-center border-r-2 border-black"><p className="font-bold p-1 border-b-2 border-black">AÑO</p><p className="p-1 font-semibold">{tripDate.getFullYear().toString().slice(-2)}</p></div>
                    <div className="px-2 text-center border-r-2 border-black"><p className="font-bold p-1 border-b-2 border-black">HORA</p><p className="p-1 font-semibold">{tripDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}</p></div>
                    <div className="font-bold text-center flex items-center justify-center"><p>{trip.route}</p></div>
                    <div className="text-center border-l-2 border-black"><p className="font-bold p-1 border-b-2 border-black">AM:</p><p className="p-1 font-bold">{!isPM ? 'X' : ''}</p></div>
                    <div className="text-center"><p className="font-bold p-1 border-b-2 border-black">PM:</p><p className="p-1 font-bold">{isPM ? 'X' : ''}</p></div>
                </div>
            </section>

            {/* Passenger Table */}
            <section className="mt-1">
                <table className="w-full border-collapse border-2 border-black">
                    <thead>
                        <tr className="bg-gray-300 font-bold">
                            <th className="border-2 border-black p-2 text-center uppercase">nombre_apellido</th>
                            <th className="border-2 border-black p-2 text-center uppercase">cedula</th>
                            <th className="border-2 border-black p-2 text-center uppercase">gerencia</th>
                            <th className="border-2 border-black p-2 text-center uppercase">hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passengers.map((passenger, index) => (
                            <tr key={index} className="[&>td]:border-2 [&>td]:border-black [&>td]:p-2">
                                <td>{passenger.name}</td>
                                <td className="text-center">{passenger.cedula}</td>
                                <td>{passenger.department}</td>
                                <td className="text-center">{passenger.time}</td>
                            </tr>
                        ))}
                        {/* Add empty rows to fill space */}
                        {Array.from({ length: Math.max(0, 8 - passengers.length) }).map((_, index) => (
                             <tr key={`empty-${index}`} className="[&>td]:border-2 [&>td]:border-black h-10">
                                <td>&nbsp;</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            <section className="mt-8 text-center font-sans">
                <button
                  onClick={onReset}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
                >
                  Registrar Nuevo Viaje
                </button>
            </section>
        </div>
    );
};

export default TripReport;
