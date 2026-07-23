import { translations, type Language, type Translations } from '@/constants/languages';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

// Dynamically load AsyncStorage only for native platforms
let AsyncStorage: any = null;

async function getAsyncStorage() {
  if (AsyncStorage === null && Platform.OS !== 'web') {
    try {
      const mod = await import('@react-native-async-storage/async-storage');
      AsyncStorage = mod.default;
    } catch (e) {
      console.warn('AsyncStorage not available');
    }
  }
  return AsyncStorage;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@khmer_heritage_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  // Load saved language on mount
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      let savedLanguage: string | null = null;
      
      if (Platform.OS === 'web') {
        savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } else {
        const storage = await getAsyncStorage();
        if (storage) {
          savedLanguage = await storage.getItem(LANGUAGE_STORAGE_KEY);
        }
      }
      
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'km' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      } else {
        const storage = await getAsyncStorage();
        if (storage) {
          await storage.setItem(LANGUAGE_STORAGE_KEY, lang);
        }
      }
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
