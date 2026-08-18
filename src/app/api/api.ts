import { getAccessToken } from '@/utils/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RoomStatus {
  RESERVED = 'RESERVED',
  AVAILABLE = 'AVAILABLE',
  REMOVED = 'REMOVED',
}

export enum ReservationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  reservations: Reservation[];
  favorites: FavoriteRoom[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string;
  status: RoomStatus;
  reservations: Reservation[];
  favoritedBy: FavoriteRoom[];
}

export interface Reservation {
  id: string;
  user: User;
  userId: string;
  room: Room;
  roomId: string;
  startDateTime: string;
  endDateTime: string;
  status: ReservationStatus;
}

export interface FavoriteRoom {
  id: string;
  user: User;
  userId: string;
  room: Room;
  roomId: string;
}

export interface Token {
  jti: string;
  expiresAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateRoomDto {
  name: string;
  capacity: number;
  description?: string;
}

export interface UpdateRoomDto {
  name?: string;
  description?: string;
  capacity?: number;
  status?: RoomStatus;
}

export interface CreateReservationDto {
  userId: string;
  roomId: string;
  startDateTime: string;
  endDateTime: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  acessToken: string;
  refreshToken: string;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  return apiFetch('/user', {
    method: 'POST',
    body: JSON.stringify(dto),
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function login(dto: LoginDto): Promise<AuthTokens> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function logout(refreshToken: string) {
  return apiFetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

function normalizeRoom(room: Room): Room {
  return { ...room, reservations: room.reservations ?? [] };
}

export async function getActiveRooms(): Promise<Room[]> {
  const rooms: Room[] = await apiFetch('/room/active', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  });
  return rooms.map(normalizeRoom);
}

export async function getAllRooms(): Promise<Room[]> {
  const rooms: Room[] = await apiFetch('/room', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  });
  return rooms.map(normalizeRoom);
}

function placeholderRoom(roomId: string): Room {
  return {
    id: roomId,
    name: 'Sala indisponível',
    capacity: 0,
    status: RoomStatus.REMOVED,
    reservations: [],
    favoritedBy: [],
  };
}

export async function getUserReservation(userId: string): Promise<Reservation[]> {
  const [reservations, rooms]: [Reservation[], Room[]] = await Promise.all([
    apiFetch(`/user/${userId}/reservations`, {
      method: 'GET',
      accessToken: getAccessToken() ?? undefined,
    }),
    getActiveRooms(),
  ]);
  const roomsById = new Map(rooms.map((room) => [room.id, room]));
  return reservations.map((r) => ({ ...r, room: roomsById.get(r.roomId) ?? placeholderRoom(r.roomId) }));
}

export async function getRoomReservations(roomId: string): Promise<Reservation[]> {
  return apiFetch(`/room/${roomId}/reservations`, {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function createRoom(dto: CreateRoomDto): Promise<Room> {
  return apiFetch('/room', {
    method: 'POST',
    body: JSON.stringify(dto),
    accessToken: getAccessToken() ?? undefined,
  })
}

export async function getUser(id: string): Promise<User> {
  return apiFetch(`/user/${id}`, {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function allUsers(): Promise<User[]> {
  return apiFetch('/user', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  })
}

export async function countUsers(): Promise<number> {
  return apiFetch('/user/count', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  })
}

export async function countRooms(): Promise<number> {
  return apiFetch('/room/count', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  })
}

export async function countActiveReservations(): Promise<number> {
  return apiFetch('/reservation/count', {
    method: 'GET',
    accessToken: getAccessToken() ?? undefined,
  })
}

export async function updateRoom(id: string, dto: UpdateRoomDto): Promise<Room> {
  return apiFetch(`/room/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function deleteUser(id: string): Promise<User> {
  return apiFetch(`/user/${id}`, {
    method: 'DELETE',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function deleteRoom(id: string): Promise<Room> {
  return apiFetch(`/room/${id}`, {
    method: 'DELETE',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function activateRoom(id: string): Promise<Room> {
  return apiFetch(`/room/${id}/activate`, {
    method: 'PATCH',
    accessToken: getAccessToken() || undefined,
  })
}

export async function createReservation(dto: CreateReservationDto): Promise<Reservation> {
  return apiFetch('/reservation', {
    method: 'POST',
    body: JSON.stringify(dto),
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function deleteReservation(id: string): Promise<Reservation> {
  return apiFetch(`/reservation/${id}`, {
    method: 'DELETE',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function completeReservation(id: string): Promise<Reservation> {
  return apiFetch(`/reservation/${id}/complete`, {
    method: 'PATCH',
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function apiFetch(
  path: string,
  options: RequestInit & { accessToken?: string; _retried?: boolean } = {},
  refreshToken?: () => Promise<boolean>,
) {
  const { accessToken, ...restOptions } = options;

  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      ...restOptions,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(restOptions.headers ?? {}),
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à API.');
  }

  if (response.status === 401 && refreshToken && !options._retried) {
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(path, { ...options, _retried: true }, refreshToken);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error([].concat(body.message || response.statusText).join(', '));
  }

  return response.status === 204 ? null : response.json();
}
