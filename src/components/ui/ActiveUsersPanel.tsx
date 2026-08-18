'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { SearchIcon, TrashIcon } from './Icons';
import { AllUsersModal } from './AllUsersModal';
import { DeactivateUserModal } from './DeactivateUserModal';

export type ActiveUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  isAdmin: boolean;
};

type ActiveUsersPanelProps = {
  users: ActiveUser[];
  previewCount?: number;
  onUserDeactivated?: (id: string) => void;
};

export function UserRow({ user, onDeactivated }: { user: ActiveUser; onDeactivated?: (id: string) => void }) {
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${user.color}`}
        >
          {user.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#191C1E] truncate">{user.name}</p>
          <p className="text-sm text-[#505F76] truncate">{user.email}</p>
        </div>
      </div>

      {onDeactivated && !user.isAdmin && (
        <>
          <Button
            variant="ghost"
            onClick={() => setIsDeactivateOpen(true)}
            ariaLabel="Tornar usuário inativo"
            className="p-0 text-red-600 shrink-0"
          >
            <TrashIcon />
          </Button>

          <DeactivateUserModal
            isOpen={isDeactivateOpen}
            onClose={() => setIsDeactivateOpen(false)}
            id={user.id}
            name={user.name}
            onDeactivated={() => onDeactivated(user.id)}
          />
        </>
      )}
    </div>
  );
}

export function ActiveUsersPanel({ users, previewCount = 3, onUserDeactivated }: ActiveUsersPanelProps) {
  const [isAllUsersOpen, setIsAllUsersOpen] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div
      id="admin-panel-users"
      className="lg:col-span-1 bg-white border-2 border-border/30 rounded-2xl p-6 flex flex-col gap-4 h-auto md:h-[378px] overflow-y-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xl font-bold text-[#191C1E]">Usuários Ativos</span>
        <div className="w-full sm:w-40">
          <Input
            type="search"
            icon={<SearchIcon width={18} height={18} />}
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {users.slice(0, previewCount).map((user) => (
          <UserRow key={user.id} user={user} onDeactivated={onUserDeactivated} />
        ))}
      </div>

      <Button
        variant="ghost"
        label="Ver Todos"
        onClick={() => setIsAllUsersOpen(true)}
        className="p-0 text-sm font-semibold text-darkest-blue self-center mt-2"
      />

      <AllUsersModal
        isOpen={isAllUsersOpen}
        onClose={() => setIsAllUsersOpen(false)}
        users={users}
        onUserDeactivated={onUserDeactivated}
      />
    </div>
  );
}
