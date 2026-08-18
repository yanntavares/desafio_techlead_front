'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { Input } from './Input';
import { CapacityIcon, CloseIcon } from './Icons';
import { updateRoom, type Room } from '@/app/api/api';

type EditRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  description?: string;
  capacity: number;
  onSave?: (room: Room) => void;
};

export function EditRoomModal({ isOpen, onClose, id, name, description, capacity, onSave }: EditRoomModalProps) {
  const [formName, setFormName] = useState(name);
  const [formDescription, setFormDescription] = useState(description ?? '');
  const [formCapacity, setFormCapacity] = useState(String(capacity));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFormName(name);
    setFormDescription(description ?? '');
    setFormCapacity(String(capacity));
  }, [isOpen, name, description, capacity]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isValid = formName.trim().length > 0 && Number(formCapacity) > 0;

  const handleSave = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      const room = await updateRoom(id, {
        name: formName,
        description: formDescription || undefined,
        capacity: Number(formCapacity),
      });
      onSave?.(room);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="edit-room-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="edit-room-modal"
        className="w-full max-w-sm bg-white rounded-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Editar Sala</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-sm font-semibold text-[#191C1E]">Foto</span>
            {/* ponytail: upload não faz parte do escopo, mantém o placeholder fixo */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-200">
              <Image src="/images/placeholder.png" alt={formName} fill sizes="400px" className="object-cover" />
            </div>
          </div>

          <Input label="Nome da Sala" value={formName} onChange={(event) => setFormName(event.target.value)} />
          <Input
            label="Descrição"
            placeholder="Ex: Sala com TV e videoconferência"
            value={formDescription}
            onChange={(event) => setFormDescription(event.target.value)}
          />
          <Input
            label="Capacidade (Pessoas)"
            type="number"
            min={1}
            icon={<CapacityIcon />}
            value={formCapacity}
            onChange={(event) => setFormCapacity(event.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-6 py-4 border-t border-border/30">
          <Button variant="hollow" label="Cancelar" onClick={onClose} className="w-full sm:w-auto" />
          <Button
            variant="primary"
            label={loading ? 'Salvando...' : 'Salvar Alterações'}
            onClick={handleSave}
            disabled={!isValid || loading}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
