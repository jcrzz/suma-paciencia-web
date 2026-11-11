import { useEra } from '@/context/EraContext';
import { InsulatorBirds, PothosLeaf, SnailTrail } from '@/components/ui/EraIcons';

type Props = {
  tone?: 'default' | 'contrast';
  className?: string;
};

export default function SectionDivider({ tone = 'default', className = '' }: Props) {
  const { activeEra } = useEra();
  const color = tone === 'contrast' ? 'text-[var(--text-on-contrast)]' : 'text-[var(--text-primary)]';

  if (activeEra === 'homonimo-2016') {
    return (
      <div aria-hidden className={`flex items-center gap-4 px-5 sm:px-8 lg:px-12 ${color} ${className}`}>
        <span className="h-px flex-1 bg-current opacity-40" />
        <InsulatorBirds className="h-7 w-full max-w-[320px] opacity-90" />
        <span className="h-px flex-1 bg-current opacity-40" />
      </div>
    );
  }

  return (
    <div aria-hidden className={`flex items-center gap-3 px-5 sm:px-8 lg:px-12 ${color} ${className}`}>
      <svg viewBox="0 0 320 24" className="h-6 w-full max-w-[520px]" preserveAspectRatio="none">
        <path
          d="M2 15c38-9 62 4 97-1s54-10 88-2 47 10 80 2 34-5 51-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="era-sketch"
        />
      </svg>
      <PothosLeaf className="h-6 w-6 shrink-0 opacity-80" />
      <SnailTrail className="h-4 w-12 shrink-0 opacity-60" />
    </div>
  );
}
