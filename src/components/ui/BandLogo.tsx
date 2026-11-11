import { useEra } from '@/context/EraContext';
import { ShellIcon, StencilSumaBlocks } from '@/components/ui/EraIcons';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'default' | 'contrast';
  showTagline?: boolean;
  fitContainer?: boolean;
  className?: string;
};

const handSizes = {
  sm: 'text-[1.55rem] sm:text-[1.8rem]',
  md: 'text-[2.4rem] sm:text-[3rem]',
  lg: 'text-[clamp(3rem,7vw,5.2rem)]',
  xl: 'text-[clamp(3.6rem,10vw,7.6rem)]',
};

const stencilSizes = {
  sm: 'text-[1.35rem] sm:text-[1.55rem]',
  md: 'text-[2rem] sm:text-[2.6rem]',
  lg: 'text-[clamp(2.5rem,6vw,4.4rem)]',
  xl: 'text-[clamp(3rem,9vw,6.4rem)]',
};

const sumaBlockSizes = {
  sm: 'h-[1rem] sm:h-[1.15rem]',
  md: 'h-[1.5rem] sm:h-[1.9rem]',
  lg: 'h-[clamp(1.8rem,4.3vw,3.2rem)]',
  xl: 'h-[clamp(2.2rem,6.5vw,4.6rem)]',
};

const fitHandSizes = {
  sm: 'text-[clamp(1.5rem,6cqw,1.8rem)]',
  md: 'text-[clamp(1.8rem,8cqw,3rem)]',
  lg: 'text-[clamp(2.2rem,10cqw,4.8rem)]',
  xl: 'text-[clamp(2.6rem,12cqw,6.2rem)]',
};

const fitStencilSizes = {
  sm: 'text-[clamp(1.35rem,5cqw,1.55rem)]',
  md: 'text-[clamp(1.6rem,6.5cqw,2.6rem)]',
  lg: 'text-[clamp(1.9rem,7.5cqw,4.4rem)]',
  xl: 'text-[clamp(2.2rem,9cqw,6.4rem)]',
};

const fitSumaBlockSizes = {
  sm: 'h-[clamp(1rem,3.5cqw,1.15rem)]',
  md: 'h-[clamp(1.2rem,4.5cqw,1.9rem)]',
  lg: 'h-[clamp(1.4rem,5.2cqw,3.2rem)]',
  xl: 'h-[clamp(1.6rem,6.5cqw,4.6rem)]',
};

const tapeSizes = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2.5 py-1',
  lg: 'px-4 py-1.5',
  xl: 'px-5 py-2.5',
};

export default function BandLogo({
  size = 'md',
  tone = 'default',
  showTagline = true,
  fitContainer = false,
  className = '',
}: Props) {
  const { activeEra } = useEra();
  const isNewEra = activeEra === 'todo-queda-aca';
  const mainColor = tone === 'contrast' ? 'text-[var(--text-on-contrast)]' : 'text-[var(--text-primary)]';
  const secondaryColor = tone === 'contrast' ? 'text-[var(--text-on-contrast)]' : 'text-[var(--text-secondary)]';
  const handClass = fitContainer ? fitHandSizes[size] : handSizes[size];
  const stencilClass = fitContainer ? fitStencilSizes[size] : stencilSizes[size];
  const sumaClass = fitContainer ? fitSumaBlockSizes[size] : sumaBlockSizes[size];
  const taglineClass = fitContainer
    ? 'text-[clamp(1.05rem,3cqw,1.5rem)]'
    : size === 'sm'
      ? 'text-base'
      : 'text-xl sm:text-2xl';

  if (isNewEra) {
    return (
      <span className={`inline-flex max-w-full flex-col items-start leading-none ${className}`}>
        <span className={`era-hand ${handClass} ${mainColor} whitespace-nowrap`}>Suma Paciencia</span>
        {showTagline && (
          <span className="mt-1 inline-flex max-w-full items-center gap-1.5 self-center">
            <span className={`era-hand ${taglineClass} text-[var(--accent-primary)]`}>todo queda acá</span>
            <ShellIcon className={fitContainer || size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'} />
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex max-w-full flex-col items-center leading-none ${className}`}>
      <StencilSumaBlocks
        title="SUMA"
        className={`block w-auto ${sumaClass} ${mainColor}`}
      />
      <span
        className={`relative -mt-1 -rotate-2 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-[3px_3px_0_rgba(20,24,23,0.3)] ${tapeSizes[size]}`}
      >
        <span
          className={`era-stencil-type era-stencil-cut ${stencilClass} uppercase ${
            tone === 'contrast' ? '[--cut-color:var(--bg-contrast)]' : '[--cut-color:var(--bg-primary)]'
          }`}
        >
          PACIENCIA
        </span>
      </span>
      {showTagline && (
        <span className={`mono mt-1.5 text-[0.55rem] uppercase tracking-[0.2em] ${secondaryColor}`}>
          Reggae litoraleño · 2016
        </span>
      )}
    </span>
  );
}
