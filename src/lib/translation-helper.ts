import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

const translationCache: Record<string, string> = {};

/**
 * Translates a given text from Vietnamese (vi) to English (en) or Khmer (km)
 * using the free Google Translate API with in-memory caching.
 */
export async function translateText(text: string, targetLang: 'vi' | 'km' | 'en'): Promise<string> {
  const cleanText = (text || '').trim();
  if (!cleanText || targetLang === 'vi') {
    return text;
  }

  const cacheKey = `${targetLang}:${cleanText}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data[0]) {
      const translated = data[0].map((item: any) => item[0]).join('');
      if (translated) {
        translationCache[cacheKey] = translated;
        return translated;
      }
    }
  } catch (error) {
    console.warn(`Translation failed for target language "${targetLang}":`, error);
  }

  // Fallback to original text if translation fails or offline
  return text;
}

/**
 * React Hook to dynamically translate text from Vietnamese to the current app language.
 */
export function useTranslate(text: string): string {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    let isMounted = true;
    if (!text || !text.trim() || language === 'vi') {
      setTranslatedText(text);
      return;
    }

    translateText(text, language as any).then((res) => {
      if (isMounted) {
        setTranslatedText(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, language]);

  return translatedText;
}

/**
 * React Hook to dynamically translate either a plain string or a MultiLangText object
 * from Vietnamese to the current active app language.
 */
export function useTranslateMultiLang(field: any): string {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!field) {
      setTranslatedText('');
      return;
    }

    // Case 1: field is a plain string
    if (typeof field === 'string') {
      if (language === 'vi') {
        setTranslatedText(field);
        return;
      }
      translateText(field, language as any).then((res) => {
        if (isMounted) setTranslatedText(res);
      });
      return;
    }

    // Case 2: field is a MultiLangText object
    const viVal = field.vi || field.en || '';
    if (language === 'vi') {
      setTranslatedText(viVal);
      return;
    }

    const targetVal = field[language] || '';
    const isFallback = !targetVal || targetVal.trim() === viVal.trim();

    if (!isFallback) {
      setTranslatedText(targetVal);
      return;
    }

    translateText(viVal, language as any).then((res) => {
      if (isMounted) setTranslatedText(res);
    });

    return () => {
      isMounted = false;
    };
  }, [field, language]);

  return translatedText;
}

/**
 * React Hook to dynamically translate an array of strings from Vietnamese to the active app language.
 */
export function useTranslateArray(list: string[] | undefined): string[] {
  const { language } = useLanguage();
  const [translatedList, setTranslatedList] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!list || list.length === 0) {
      setTranslatedList([]);
      return;
    }
    if (language === 'vi') {
      setTranslatedList(list);
      return;
    }

    Promise.all(list.map((item) => translateText(item, language as any))).then((res) => {
      if (isMounted) {
        setTranslatedList(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [list, language]);

  return translatedList;
}
