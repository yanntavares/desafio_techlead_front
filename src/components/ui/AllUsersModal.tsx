'use client';

import { useEffect } from 'react';
import { Button } from './Button';
import { CloseIcon } from './Icons';
import { UserRow, type ActiveUser } from './ActiveUsersPanel';

type AllUsersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  users: ActiveUser[];
  onUserDeactivated?: (id: string) => void;
};

export function AllUsersModal({ isOpen, onClose, users, onUserDeactivated }: AllUsersModalProps) {
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
      id="all-users-modal-backdrop"
      className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="all-users-modal"
        className="w-full max-w-md md:max-w-lg max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h2 className="text-xl font-bold text-darkest-blue">Usuários Ativos</h2>
          <Button variant="ghost" onClick={onClose} ariaLabel="Fechar" className="p-0">
            <CloseIcon />
          </Button>
        </div>

        <div className="flex flex-col gap-4 p-6 overflow-y-auto">
          {users.map((user) => (
            <UserRow key={user.id} user={user} onDeactivated={onUserDeactivated} />
          ))}
        </div>
      </div>
    </div>
  );
}
