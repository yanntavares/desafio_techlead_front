'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from './Button';
import { HomeIcon, CalendarIcon, LogOutIcon, MenuIcon, CloseIcon } from './Icons';
import { logout as logoutApi } from '@/app/api/api';
import { getCurrentUser, getRefreshToken, clearAuthCookies } from '@/utils/lib/auth';

interface NavItem {
  icon: ReactNode;
  label: string;
  href?: string;
}

export const Nav_items: NavItem[] = [
  {
    label: 'Home',
    href: '/platform',
    icon: <HomeIcon />,
  },
  {
    label: 'Minhas Reservas',
    href: `/platform/reservations`,
    icon: <CalendarIcon />,
  },
];

export const NavBottom: NavItem[] = [
  {
    label: 'Log Out',
    icon: <LogOutIcon />,
  },
];

export function NavRow({
  item,
  active,
  onClick,
  onNavigate,
}: {
  item: NavItem;
  active?: boolean;
  onClick?: () => void;
  onNavigate?: () => void;
}) {
  const className = `flex items-center gap-2 px-2 py-3 cursor-pointer transition-colors duration-150 w-full text-left ${
    active
      ? 'bg-[#1E3A8A]/[15%] border border-[#1E3A8A]/[15%] shadow-sm border-l-[#1E3A8A] border-l-4'
      : 'hover:bg-white/60'
  }`;

  const inner = (
    <>
      <span className={active ? 'text-[#1E3A8A]' : 'text-normal'}>{item.icon}</span>
      <span
        className={`text-sm font-semibold font-jakarta ${active ? 'text-[#1E3A8A]' : 'text-normal'}`}
      >
        {item.label}
      </span>
    </>
  );

  if (item.href)
    return (
      <Link href={item.href} className={className} onClick={onNavigate}>
        {inner}
      </Link>
    );

  return (
    <button className={className} onClick={onClick}>
      {inner}
    </button>
  );
}

export function NavDivider() {
  return <div className="my-3 h-px bg-zinc-400/[12%]" />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(getCurrentUser()?.role === 'ADMIN');
  }, []);

  async function handleLogout() {
    const refreshToken = getRefreshToken();
    if (refreshToken) await logoutApi(refreshToken).catch(() => {});
    clearAuthCookies();
    router.push('/');
  }

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-border/60 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="rounded-full w-9 h-9">
            <Image src="/icons/logo.png" alt="Logo" width={36} height={36} className="w-full h-full rounded-full" />
          </div>
          <span className="text-darkest-blue font-extrabold text-xl">Booking</span>
        </div>
        <Button variant="ghost" onClick={() => setIsMobileOpen(true)} ariaLabel="Abrir menu" className="p-0 text-darkest-blue">
          <MenuIcon />
        </Button>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[1000] w-72 h-dvh bg-border lg:bg-border/60 px-1 py-6 flex flex-col
        transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:flex
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="rounded-full w-12 h-12">
              <Image
                src="/icons/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="w-full h-full rounded-full"
              />
            </div>
            <span className="text-darkest-blue font-extrabold text-4xl">Booking</span>
          </div>
          <Button variant="ghost" onClick={closeMobile} ariaLabel="Fechar menu" className="p-0 text-darkest-blue lg:hidden">
            <CloseIcon />
          </Button>
        </div>
        <nav className="flex flex-col gap-2 mt-8 flex-1">
          {Nav_items.map((item) => {
            const isActive =
              item.href === '/platform'
                ? pathname === item.href
                : !!item.href && pathname.startsWith(item.href);

            return <NavRow key={item.label} item={item} active={isActive} onNavigate={closeMobile} />;
          })}
        </nav>
        <nav className="flex flex-col gap-2 mt-8 w-full">
          {isAdmin && (
            <Link href="/platform/admin_panel" onClick={closeMobile} className="w-full pr-4">
              <Button label="Painel do Administrador" variant="panel" className="w-full"></Button>
            </Link>
          )}
          {NavBottom.map((item) => {
            return <NavRow key={item.label} item={item} onClick={handleLogout} />;
          })}
        </nav>
      </aside>
    </>
  );
}
