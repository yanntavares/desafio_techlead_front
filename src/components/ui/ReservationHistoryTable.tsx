'use client'

import { useState } from 'react';
import { Pagination } from './Pagination'; // Ajuste o caminho conforme sua estrutura

export type Reservation = {
  id: string;
  room: string;
  date: string;
  duration: string;
  status: string; // Ex: 'Concluída', 'Agendada', 'Cancelada'
};

// 2. Props: O componente agora exige receber um array dessas reservas
interface ReservationHistoryTableProps {
  reservations: Reservation[];
  onRowClick?: (id: string) => void;
}

export function ReservationHistoryTable({ reservations, onRowClick }: ReservationHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Cabeçalho */}
            <thead className="bg-[#F7F9FB] border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sala</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duração</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(reservation.id)}
                >
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#191C1E]">{reservation.room}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{reservation.date}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{reservation.duration}</span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renderiza a paginação passando as propriedades necessárias */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />
    </div>
  );
}