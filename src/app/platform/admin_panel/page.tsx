'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RegisteredRoomsPanel } from '@/components/ui/RegisteredRoomsPanel';
import { ActiveUsersPanel, type ActiveUser } from '@/components/ui/ActiveUsersPanel';
import { CreateRoomModal } from '@/components/ui/CreateRoomModal';
import { ActiveUsersIcon, CalendarIcon, GlobeIcon, RoomIcon } from '@/components/ui/Icons';
import {
  getAllRooms,
  getRoomReservations,
  allUsers,
  countUsers,
  countRooms,
  countActiveReservations,
  ReservationStatus,
  Role,
  Room,
  User,
  UserStatus,
} from '@/app/api/api';
import { getInitials } from '@/utils/lib/format';

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-amber-100 text-amber-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
];

function toActiveUser(user: User): ActiveUser {
  const hash = [...user.name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initials: getInitials(user.name),
    color: AVATAR_COLORS[hash % AVATAR_COLORS.length],
    isAdmin: user.role === Role.ADMIN,
  };
}

export default function AdminPanel() {
  const [registeredRooms, setRegisteredRooms] = useState<Room[]>([]);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<{
    users: number | null;
    rooms: number | null;
    reservations: number | null;
  }>({ users: null, rooms: null, reservations: null });
  const [countsError, setCountsError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [topRoom, setTopRoom] = useState<{ name: string; count: number } | null>(null);

  useEffect(() => {
    getAllRooms()
      .then(setRegisteredRooms)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as salas'),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    Promise.all([countUsers(), countRooms(), countActiveReservations()])
      .then(([users, rooms, reservations]) => setCounts({ users, rooms, reservations }))
      .catch((err) =>
        setCountsError(
          err instanceof Error ? err.message : 'Não foi possível carregar os indicadores',
        ),
      );
  }, []);

  useEffect(() => {
    if (registeredRooms.length === 0) return;
    Promise.all(
      registeredRooms.map((room) =>
        getRoomReservations(room.id).then((reservations) => ({
          name: room.name,
          count: reservations.filter((r) => r.status !== ReservationStatus.CANCELED).length,
        })),
      ),
    )
      .then((counts) => setTopRoom(counts.reduce((max, curr) => (curr.count > max.count ? curr : max))))
      .catch(() => {});
  }, [registeredRooms]);

  useEffect(() => {
    allUsers()
      .then((users) =>
        setActiveUsers(users.filter((u) => u.status === UserStatus.ACTIVE).map(toActiveUser)),
      )
      .catch(() => {});
  }, []);

  const stats = [
    { title: 'Usuários Ativos', parameter: counts.users ?? '...', icon: <ActiveUsersIcon /> },
    {
      title: 'Salas Cadastradas',
      parameter: counts.rooms ?? '...',
      icon: <RoomIcon />,
      badge: 'Total',
    },
    { title: 'Reservas Ativas', parameter: counts.reservations ?? '...', icon: <CalendarIcon /> },
    {
      title: 'Sala Mais Reservada',
      parameter: topRoom ? (topRoom.count > 0 ? topRoom.name : 'Sem reservas') : '...',
      icon: <GlobeIcon />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col justify-start gap-2">
          <span className="text-black text-4xl font-bold">Visão Geral</span>
          <span className="text-normal text-lg">Monitore as salas e reservas.</span>
        </div>
        <div className="flex gap-4 md:gap-8">
          <Button
            label=" + Nova Sala"
            variant="primary"
            className="w-40"
            onClick={() => setIsCreateRoomOpen(true)}
          ></Button>
        </div>
      </div>

      {(error || countsError) && (
        <p className="text-sm text-red-600">{error || countsError}</p>
      )}
      {loading && <p className="text-sm text-normal">Carregando salas...</p>}

      <div id="admin-panel-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Badge
            key={stat.title}
            title={stat.title}
            parameter={stat.parameter}
            icon={stat.icon}
            badge={stat.badge}
          />
        ))}
      </div>

      <div id="admin-panel-body" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RegisteredRoomsPanel rooms={registeredRooms} />

        <ActiveUsersPanel
          users={activeUsers}
          onUserDeactivated={(id) => setActiveUsers((prev) => prev.filter((u) => u.id !== id))}
        />
      </div>

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onCreate={(room) => setRegisteredRooms((rooms) => [...rooms, room])}
      />
    </div>
  );
}
