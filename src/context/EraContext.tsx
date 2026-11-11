import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_ERA, ERAS, getEraMeta, type EraId, type EraMeta } from '@/data/eras';

const STORAGE_KEY = 'sp_era_v1';

type EraContextValue = {
  activeEra: EraId;
  eraMeta: EraMeta;
  setEra: (era: EraId) => void;
  toggleNextEra: () => void;
  eras: EraMeta[];
};

const EraContext = createContext<EraContextValue | undefined>(undefined);

function isEraId(value: string | null): value is EraId {
  return ERAS.some((era) => era.id === value);
}

function readStoredEra(): EraId {
  if (typeof window === 'undefined') return DEFAULT_ERA;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isEraId(stored)) return stored;
  } catch {
    /* localStorage can be unavailable in private contexts */
  }
  return DEFAULT_ERA;
}

function syncDocumentEra(era: EraId) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.era = era;
  const themeColor = era === 'todo-queda-aca' ? '#F6EFE2' : '#4E9794';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', themeColor);
}

export function EraProvider({ children }: { children: ReactNode }) {
  const [activeEra, setActiveEra] = useState<EraId>(readStoredEra);

  useEffect(() => {
    syncDocumentEra(activeEra);
    try {
      window.localStorage.setItem(STORAGE_KEY, activeEra);
    } catch {
      /* keep the in-memory era if storage is unavailable */
    }
  }, [activeEra]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !isEraId(event.newValue)) return;
      setActiveEra(event.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setEra = useCallback((era: EraId) => {
    setActiveEra(era);
  }, []);

  const toggleNextEra = useCallback(() => {
    setActiveEra((current) => {
      const currentIndex = ERAS.findIndex((era) => era.id === current);
      const nextIndex = (currentIndex + 1) % ERAS.length;
      return ERAS[nextIndex]?.id ?? DEFAULT_ERA;
    });
  }, []);

  const value = useMemo<EraContextValue>(
    () => ({
      activeEra,
      eraMeta: getEraMeta(activeEra),
      setEra,
      toggleNextEra,
      eras: ERAS,
    }),
    [activeEra, setEra, toggleNextEra]
  );

  return <EraContext.Provider value={value}>{children}</EraContext.Provider>;
}

export function useEra(): EraContextValue {
  const context = useContext(EraContext);
  if (!context) throw new Error('useEra must be used within an EraProvider');
  return context;
}

export { EraContext };
