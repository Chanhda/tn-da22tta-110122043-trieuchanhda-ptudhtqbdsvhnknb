import React from 'react';
import { ThemedText } from './themed-text';
import { useTranslateMultiLang } from '@/lib/translation-helper';

interface TranslatedTextProps {
  field: any;
  style?: any;
  numberOfLines?: number;
}

/**
 * Reusable UI component that automatically handles dynamic translations
 * for both plain strings and MultiLangText objects.
 */
export function TranslatedText({ field, style, numberOfLines }: TranslatedTextProps) {
  const translated = useTranslateMultiLang(field);
  return (
    <ThemedText style={style} numberOfLines={numberOfLines}>
      {translated}
    </ThemedText>
  );
}
