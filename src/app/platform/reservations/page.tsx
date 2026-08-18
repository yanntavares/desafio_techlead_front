'use client';

import { useEffect, useState } from 'react';
import { getUser, getUserReservation, Reservation as ApiReservation } from '@/app/api/api';
import { getCurrentUser } from '@/utils/lib/auth';
import { formatDate, formatTimeRange, getInitials } from '@/utils/lib/format';
import { SearchIcon } from '@/components/ui/Icons';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { ReservationCard } from '@/components/ui/ReservationCard';
import { ReservationDetailsModal } from '@/components/ui/ReservationDetailsModal';
import { ReservationHistoryTable } from '@/components/ui/ReservationHistoryTable';

function formatDuration(startIso: string, endIso: string): string {
  const hours = (new Date(endIso).getTime() - new Date(startIso).getTime()) / 3_600_000;
  return `${hours}h`;
}

type BookedBy = { name: string; email: string; initials: string };
const defaultBookedBy: BookedBy = { name: 'Você', email: 'voce@example.com', initials: 'VC' };

function toCardProps(r: ApiReservation, bookedBy?: BookedBy) {
  return {
    id: r.id,
    name: r.room.name,
    capacity: r.room.capacity,
    description: r.room.description,
    date: formatDate(r.startDateTime),
    time: formatTimeRange(r.startDateTime, r.endDateTime),
    status: r.status as 'COMPLETED' | 'SCHEDULED' | 'CANCELED',
    bookedBy,
  };
}

function toHistoryRow(r: ApiReservation) {
  return {
    id: r.id,
    room: r.room.name,
    date: formatDate(r.startDateTime),
    duration: formatDuration(r.startDateTime, r.endDateTime),
    status: r.status,
  };
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<ApiReservation[]>([]);
  const [bookedBy, setBookedBy] = useState<BookedBy | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const activeReservationsPerPage = 3;

  useEffect(() => {
    const userId = getCurrentUser()?.sub;
    if (!userId) {
      setError('Não foi possível identificar o usuário logado.');
      setLoading(false);
      return;
    }
    Promise.all([getUserReservation(userId), getUser(userId)])
      .then(([data, user]) => {
        setReservations(data);
        setBookedBy({ name: user.name, email: user.email, initials: getInitials(user.name) });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as reservas'),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCanceled = (updated: ApiReservation) => {

    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status } : r)),
    );
  };

  const handleCompleted = (updated: ApiReservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status } : r)),
    );
  };

  const filteredReservations = reservations.filter((r) =>
    r.room.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const activeReservations = filteredReservations.filter((r) => r.status === 'SCHEDULED');
  const historyReservations = filteredReservations.filter((r) => r.status !== 'SCHEDULED');
  const selectedReservation = reservations.find((r) => r.id === selectedHistoryId);

  const lastActiveReservationIndex = currentActivePage * activeReservationsPerPage;
  const firstActiveReservationIndex = lastActiveReservationIndex - activeReservationsPerPage;
  const currentActiveReservations = activeReservations.slice(
    firstActiveReservationIndex,
    lastActiveReservationIndex,
  );
  const totalActivePages = Math.ceil(activeReservations.length / activeReservationsPerPage);

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col justify-start gap-2">
          <span className="text-black text-2xl md:text-3xl lg:text-4xl font-bold">Minhas Reservas</span>
          <span className="text-normal text-lg">
            Gerencie suas reservas. Cancele quando quiser.
          </span>
        </div>
        <div className="w-full sm:w-80">
          <Input
            type="search"
            icon={<SearchIcon />}
            placeholder="Pesquisar reservas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-bold text-3xl text-black mb-4">Reservas Ativas</span>
        </div>

        {loading && <p className="text-normal text-lg">Carregando reservas...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && activeReservations.length === 0 && (
          <p className="text-normal text-lg">Nenhuma reserva ativa.</p>
        )}
        {!loading && !error && activeReservations.length > 0 && (
          <div className="flex flex-col w-full">
            <div className="flex flex-wrap gap-6">
              {currentActiveReservations.map((r) => (
                <ReservationCard
                  key={r.id}
                  {...toCardProps(r, bookedBy)}
                  onCanceled={handleCanceled}
                  onCompleted={handleCompleted}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentActivePage}
              totalPages={totalActivePages}
              onPageChange={setCurrentActivePage}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-bold text-3xl text-black mb-4">Histórico de Reservas</span>
        </div>
        <ReservationHistoryTable
          reservations={historyReservations.map(toHistoryRow)}
          onRowClick={setSelectedHistoryId}
        ></ReservationHistoryTable>
      </div>

      {selectedReservation && (
        <ReservationDetailsModal
          isOpen
          onClose={() => setSelectedHistoryId(null)}
          date={formatDate(selectedReservation.startDateTime)}
          time={formatTimeRange(selectedReservation.startDateTime, selectedReservation.endDateTime)}
          status={selectedReservation.status as 'COMPLETED' | 'SCHEDULED' | 'CANCELED'}
          roomName={selectedReservation.room.name}
          capacity={selectedReservation.room.capacity}
          description={selectedReservation.room.description}
          bookedBy={bookedBy ?? defaultBookedBy}
        />
      )}
    </div>
  );
}
