'use client';

import { useEffect } from 'react';
import { Button } from './Button';
import { CloseIcon } from './Icons';
import { RoomTile, type RegisteredRoom } from './RegisteredRoomsPanel';

type AllRoomsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rooms: RegisteredRoom[];
};

export function AllRoomsModal({ isOpen, onClose, rooms }: AllRoomsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="all-rooms-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="all-rooms-modal"
        className="w-full max-w-3xl lg:max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Salas Cadastradas</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomTile key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
