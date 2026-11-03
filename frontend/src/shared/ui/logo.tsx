import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import horizontalDark from '@/shared/assets/brand/logo-horizontal-dark.svg';
import horizontal from '@/shared/assets/brand/logo-horizontal.svg';
import stackedDark from '@/shared/assets/brand/logo-stacked-dark.svg';
import stacked from '@/shared/assets/brand/logo-stacked.svg';

const sources = {
  horizontal: { light: horizontal, dark: horizontalDark },
  stacked: { light: stacked, dark: stackedDark },
};

interface LogoProps {
  href?: string;
  // 'dark' é a versão clara da marca, para fundos escuros (sidebar, rodapé, foto)
  tone?: 'light' | 'dark';
  variant?: keyof typeof sources;
  // Altura da imagem; a largura acompanha a proporção da logo
  imageClassName?: string;
  className?: string;
}

export function Logo({
  href = '/',
  tone = 'light',
  variant = 'horizontal',
  imageClassName = 'h-10',
  className,
}: LogoProps) {
  return (
    <Link href={href} className={cn('inline-flex shrink-0 rounded-lg', className)}>
      <Image
        src={sources[variant][tone]}
        alt="Preservio"
        priority
        className={cn('w-auto', imageClassName)}
      />
    </Link>
  );
}
