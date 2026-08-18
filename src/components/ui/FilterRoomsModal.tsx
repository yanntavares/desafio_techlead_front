'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { CalendarIcon, CloseIcon } from './Icons';

export type CapacityRange = '1-4' | '5-8' | '9-12' | '12+';

type FilterRoomsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: { date: string; capacity: CapacityRange | null }) => void;
};

const capacityRanges: CapacityRange[] = ['1-4', '5-8', '9-12', '12+'];

export function FilterRoomsModal({ isOpen, onClose, onApply }: FilterRoomsModalProps) {
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState<CapacityRange | null>('1-4');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClear = () => {
    setDate('');
    setCapacity(null);
  };

  const handleApply = () => {
    onApply?.({ date, capacity });
    onClose();
  };

  return (
    <div
      id="filter-rooms-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="filter-rooms-modal"
        className="w-full max-w-sm bg-white rounded-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Filtrar Salas</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <div id="filter-rooms-date">
            <p className="text-sm font-semibold text-normal mb-1.5">Data</p>
            <Input
              type="date"
              icon={<CalendarIcon width={18} height={18} />}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div id="filter-rooms-capacity">
            <p className="text-sm font-semibold text-normal mb-1.5">Capacidade</p>
            <div className="flex flex-wrap gap-2">
              {capacityRanges.map((range) => (
                <Button
                  key={range}
                  variant="hollow"
                  label={range}
                  onClick={() => setCapacity(capacity === range ? null : range)}
                  className={
                    capacity === range
                      ? 'bg-blue-50 border-2 border-darkest-blue text-darkest-blue font-semibold px-4 py-2 text-sm'
                      : 'border px-4 py-2 text-sm'
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-6 py-4 border-t border-border/30">
          <Button variant="hollow" label="Limpar Filtros" onClick={handleClear} className="w-full sm:w-auto" />
          <Button variant="primary" label="Aplicar Filtros" onClick={handleApply} className="w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}
