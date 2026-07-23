import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useColorSchemePreference } from '@/contexts/color-scheme-context';

export function useColorScheme() {
	try {
		return useColorSchemePreference().resolvedColorScheme;
	} catch {
		return useNativeColorScheme();
	}
}

