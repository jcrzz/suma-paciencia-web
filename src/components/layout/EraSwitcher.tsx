import { useEra } from '@/context/EraContext';
import { FelixSnailIcon, PoleSunIcon } from '@/components/ui/EraIcons';

type Props = {
  compact?: boolean;
  className?: string;
};

export default function EraSwitcher({ compact = false, className = '' }: Props) {
  const { activeEra, eraMeta, eras, toggleNextEra } = useEra();
  const index = eras.findIndex((era) => era.id === activeEra);
  const side = index === 0 ? 'Lado A' : 'Lado B';
  const isNewEra = activeEra === 'todo-queda-aca';

  return (
    <button
      type="button"
      onClick={toggleNextEra}
      title="Cambiar estética de disco"
      aria-label={`${eraMeta.shortLabel}. Cambiar estética de disco: ${eraMeta.actionLabel}`}
      className={`era-body-transition group inline-flex items-center gap-2.5 border-[length:var(--border-width)] border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)] px-2.5 py-1.5 shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:bg-[var(--bg-surface-alt)] ${className}`}
    >
      <span className="shrink-0 transition-transform duration-300 group-hover:-rotate-3">
        {isNewEra ? <FelixSnailIcon className="h-8 w-10" /> : <PoleSunIcon className="h-8 w-10" />}
      </span>

      <span className={`text-left leading-tight ${compact ? 'hidden sm:block' : 'block'}`}>
        <span className="mono block text-[0.54rem] uppercase tracking-[0.16em] text-[var(--text-on-surface-secondary)]">
          Disco {index + 1}/{eras.length} · {side}
        </span>
        <span className={`block text-[0.72rem] font-bold ${isNewEra ? 'era-hand text-[0.92rem]' : 'era-stencil-type'}`}>
          {isNewEra ? "Era: Todo Queda Acá ('26)" : "Era: Homónimo ('16)"}
        </span>
        <span className="mono hidden text-[0.5rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)] sm:block">
          {eraMeta.actionLabel}
        </span>
      </span>

      {compact && (
        <span className="mono text-[0.56rem] uppercase tracking-[0.12em] text-[var(--text-on-surface-secondary)] sm:hidden">
          {index + 1}/{eras.length}
        </span>
      )}
    </button>
  );
}
