import { useState } from 'react';
import { Copy, Check, Landmark } from 'lucide-react';
import { env } from '@/lib/config';

type Props = {
  alias?: string | null;
  cbu?: string | null;
  holder?: string | null;
  bank?: string | null;
};

export function BankSheet({ alias, cbu, holder, bank }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const aliasValue = alias || env.ALIAS_TRANSFERENCIA;

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section className="border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-on-surface)]">
      <header className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        <Landmark className="h-4 w-4" />
        <h3 className="display font-bold text-sm">Datos para transferir</h3>
      </header>

      <dl className="divide-y divide-[var(--border-subtle)]">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <dt className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">Alias</dt>
          <dd className="flex items-center gap-2">
            <span className="mono text-sm font-bold break-all text-right">{aliasValue}</span>
            <button
              type="button"
              onClick={() => copy(aliasValue, 'alias')}
              className="p-1.5 border border-[var(--border-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
              aria-label="Copiar alias"
            >
              {copied === 'alias' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </dd>
        </div>

        {cbu && (
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">CBU</dt>
            <dd className="flex items-center gap-2">
              <span className="mono text-xs break-all text-right">{cbu}</span>
              <button
                type="button"
                onClick={() => copy(cbu, 'cbu')}
                className="p-1.5 border border-[var(--border-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] transition-colors"
                aria-label="Copiar CBU"
              >
                {copied === 'cbu' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </dd>
          </div>
        )}

        {bank && (
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">Banco</dt>
            <dd className="mono text-xs">{bank}</dd>
          </div>
        )}

        {holder && (
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            <dt className="mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-on-surface-secondary)]">Titular</dt>
            <dd className="mono text-xs text-right">{holder}</dd>
          </div>
        )}
      </dl>

      <p className="px-4 py-3 text-xs text-[var(--text-on-surface-secondary)] border-t border-[var(--border-subtle)] leading-relaxed">
        Transferí el total y mandanos el comprobante por WhatsApp con el número de pedido. Lo confirmamos a la brevedad.
      </p>
    </section>
  );
}

export default BankSheet;
