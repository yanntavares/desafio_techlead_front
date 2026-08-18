'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FilterIcon, SearchIcon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { FilterRoomsModal, CapacityRange } from "@/components/ui/FilterRoomsModal";
import { getActiveRooms, Room } from "@/app/api/api";

function matchesCapacity(capacity: number, range: CapacityRange | null): boolean {
  if (!range) return true;
  if (range === '12+') return capacity >= 12;
  const [min, max] = range.split('-').map(Number);
  return capacity >= min && capacity <= max;
}

function isAvailableOnDate(room: Room, date: string): boolean {
  if (!date) return true;
  return !room.reservations.some(
    (r) => r.status === 'SCHEDULED' && date >= r.startDateTime.slice(0, 10) && date <= r.endDateTime.slice(0, 10),
  );
}

export default function HomePlatform() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ date: string; capacity: CapacityRange | null }>({
    date: '',
    capacity: null,
  });

  useEffect(() => {
    getActiveRooms()
      .then(setRooms)
      .catch((err) => setError(err instanceof Error ? err.message : 'Não foi possível carregar as salas'))
      .finally(() => setLoading(false));
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      matchesCapacity(room.capacity, filters.capacity) &&
      isAvailableOnDate(room, filters.date),
  );

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col justify-start gap-2">
          <span className="text-black text-2xl md:text-3xl lg:text-4xl font-bold">Salas Disponíveis</span>
          <span className="text-normal text-lg">Reserve a sala que você precisa. Rápido, Fácil e sem Burocracia.</span>
        </div>
        <div className="flex gap-4">
          <div className="w-full sm:w-80">
            <Input
              type="search"
              icon={<SearchIcon />}
              placeholder="Pesquisar salas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
          </div>
          <Button
            variant="hollow"
            onClick={() => setIsFilterOpen(true)}
            className="w-12 h-12 flex items-center justify-center p-0"
          >
            <FilterIcon />
          </Button>
        </div>
      </div>

      <div id="room-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-normal text-lg col-span-full">Carregando salas...</p>}
        {error && <p className="text-sm text-red-600 col-span-full">{error}</p>}
        {!loading && !error && filteredRooms.length === 0 && (
          <p className="text-normal text-lg col-span-full">Nenhuma sala encontrada.</p>
        )}
        {!loading && !error && filteredRooms.map((room, i) => (
          <Card
            key={room.id}
            id={room.id}
            name={room.name}
            description={room.description}
            capacity={room.capacity}
            variant={i === 0 ? 'primary' : 'secondary'}
            className={i === 0 ? 'sm:col-span-2 lg:col-span-3' : undefined}
          />
        ))}
      </div>

      <FilterRoomsModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} />
    </div>
  );
}
