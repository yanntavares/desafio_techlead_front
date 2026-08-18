'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { CloseIcon } from './Icons';
import { createRoom, Room } from '@/app/api/api';

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (room: Room) => void;
};

export function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isValid = name.trim().length > 0 && Number(capacity) > 0;

  const handleCreate = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      const room = await createRoom({ name, description: description.trim() || undefined, capacity: Number(capacity) });
      onCreate?.(room);
      setName('');
      setDescription('');
      setCapacity('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="create-room-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="create-room-modal"
        className="w-full max-w-sm bg-white rounded-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Registrar Sala</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <Input
            label="Nome"
            placeholder="Ex: Sala de Reunião Executiva"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="Descrição (opcional)"
            placeholder="Ex: Sala com TV e videoconferência"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Input
            label="Capacidade"
            type="number"
            min={1}
            placeholder="Ex: 12"
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-6 py-4 border-t border-border/30">
          <Button
            variant="hollow"
            label="Cancelar"
            onClick={onClose}
            className="w-full sm:w-auto"
          />
          <Button
            variant="primary"
            label={loading ? 'Carregando...' : 'Registrar Sala'}
            onClick={handleCreate}
            disabled={!isValid || loading}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
