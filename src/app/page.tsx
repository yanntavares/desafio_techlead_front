'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MailIcon, LockIcon } from '@/components/ui/Icons';
import { login } from '@/app/api/api';
import { setAuthCookies } from '@/utils/lib/auth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tokens = await login({ email, password });
      setAuthCookies(tokens);
      router.push('/platform');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 overflow-y-auto">
      <div className="flex items-center justify-center bg-[#FAFAFA] border-2 border-border/30 w-full max-w-[420px] h-auto rounded-xl shadow-lg my-8">
        <form className="flex flex-col gap-6 w-full p-6 md:p-12" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl text-darkest-blue font-bold">Booking</p>
            <p className="text-md font-semibold text-normal">Entre na sua conta</p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Input>
            <Input
              label="Senha"
              type="password"
              password={true}
              placeholder="******"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></Input>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              label={loading ? 'Entrando...' : 'Login'}
              className="w-full"
              disabled={loading}
            ></Button>
          </div>
          <div className="flex items-center justify-center border-t-2 border-border/30 pt-2 gap-1">
            <p className="text-normal text-sm font-medium">Não tem uma conta? </p>
            <Link href="/cadastro">
              <p className="font-semibold text-darkest-blue">Cadastre-se</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
