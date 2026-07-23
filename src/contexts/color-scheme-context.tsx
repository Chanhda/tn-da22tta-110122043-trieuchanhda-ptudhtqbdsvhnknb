import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

import { readProfileStorage, writeProfileStorage } from '@/lib/profile-storage';

export type PreferredColorScheme = 'light' | 'dark' | 'system';

type ColorSchemeContextValue = {
  preferredColorScheme: PreferredColorScheme;
  resolvedColorScheme: 'light' | 'dark';
  setPreferredColorScheme: (scheme: PreferredColorScheme) => void;
};

const STORAGE_KEY = 'khmerapp.color-scheme.preference';

const ColorSchemeContext = createContext<ColorSchemeContextValue | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useNativeColorScheme() ?? 'light';
  const [preferredColorScheme, setPreferredColorSchemeState] = useState<PreferredColorScheme>('system');

  useEffect(() => {
    let isMounted = true;

    async function loadPreference() {
      const savedPreference = await readProfileStorage<PreferredColorScheme>(STORAGE_KEY, 'system');

      if (isMounted) {
        setPreferredColorSchemeState(savedPreference);
      }
    }

    loadPreference();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    writeProfileStorage(STORAGE_KEY, preferredColorScheme);
  }, [preferredColorScheme]);

  const resolvedColorScheme = preferredColorScheme === 'system' ? systemColorScheme : preferredColorScheme;

  const value = useMemo<ColorSchemeContextValue>(() => ({
    preferredColorScheme,
    resolvedColorScheme,
    setPreferredColorScheme: setPreferredColorSchemeState,
  }), [preferredColorScheme, resolvedColorScheme]);

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
}

export function useColorSchemePreference() {
  const context = useContext(ColorSchemeContext);

  if (!context) {
    throw new Error('useColorSchemePreference must be used within ColorSchemeProvider');
  }

  return context;
}
