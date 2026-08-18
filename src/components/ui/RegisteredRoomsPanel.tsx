'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { CapacityIcon } from './Icons';
import { AllRoomsModal } from './AllRoomsModal';
import { AdminRoomDetailsModal } from './AdminRoomDetailsModal';
import { EditRoomModal } from './EditRoomModal';
import { RemoveRoomModal } from './RemoveRoomModal';

import { activateRoom, type Room } from '@/app/api/api';

export type RegisteredRoom = Room;

type RegisteredRoomsPanelProps = {
  rooms: RegisteredRoom[];
  previewCount?: number;
};

export function RoomTile({ room: initialRoom }: { room: RegisteredRoom }) {
  const [room, setRoom] = useState(initialRoom);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [reactivateError, setReactivateError] = useState<string | null>(null);

  const handleReactivate = async () => {
    setReactivateError(null);
    setIsReactivating(true);
    try {
      setRoom(await activateRoom(room.id));
    } catch (err) {
      setReactivateError(err instanceof Error ? err.message : 'Não foi possível reativar a sala');
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsDetailsOpen(true)}
        className="p-0 text-left border border-border/30 rounded-lg overflow-hidden hover:border-darkest-blue/40 block"
      >
        <div className="relative w-full h-48 bg-gray-200">
          <Image src="/images/placeholder.png" alt={room.name} fill sizes="240px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-1 p-3">
          <span className="font-bold text-[#191C1E]">{room.name}</span>
          <div className="flex items-center gap-1 text-[#505F76]">
            <CapacityIcon />
            <span className="text-sm font-semibold">{room.capacity}</span>
          </div>
        </div>
      </Button>

      <AdminRoomDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        roomId={room.id}
        name={room.name}
        capacity={room.capacity}
        description={room.description}
        status={room.status}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
        onRemove={() => {
          setIsDetailsOpen(false);
          setIsRemoveOpen(true);
        }}
        onReactivate={handleReactivate}
        reactivating={isReactivating}
        reactivateError={reactivateError}
      />

      <EditRoomModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        id={room.id}
        name={room.name}
        capacity={room.capacity}
        description={room.description}
        onSave={setRoom}
      />

      <RemoveRoomModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        id={room.id}
        name={room.name}
        onRemove={setRoom}
      />
    </>
  );
}

export function RegisteredRoomsPanel({ rooms, previewCount = 2 }: RegisteredRoomsPanelProps) {
  const [isAllRoomsOpen, setIsAllRoomsOpen] = useState(false);

  return (
    <div
      id="admin-panel-rooms"
      className="lg:col-span-2 bg-white border-2 border-border/30 rounded-2xl p-6 flex flex-col gap-4 h-auto md:h-[378px] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-[#191C1E]">Salas Cadastradas</span>
        <Button variant="ghost" label="Ver Todos →" onClick={() => setIsAllRoomsOpen(true)} className="p-0 text-sm font-semibold text-darkest-blue" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.slice(0, previewCount).map((room) => (
          <RoomTile key={room.id} room={room} />
        ))}
      </div>

      <AllRoomsModal isOpen={isAllRoomsOpen} onClose={() => setIsAllRoomsOpen(false)} rooms={rooms} />
    </div>
  );
}
