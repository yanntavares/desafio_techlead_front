import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-6 bg-[#FAFAFA] border-2 border-border/30 w-[420px] rounded-xl shadow-lg p-12">
        <div className="flex flex-col items-center gap-1">
          <p className="text-3xl text-darkest-blue font-bold">404</p>
          <p className="text-md font-semibold text-normal">Página não encontrada</p>
        </div>
        <Link href="/" className="w-full">
          <Button label="Voltar para o início" className="w-full" />
        </Link>
      </div>
    </div>
  );
}
