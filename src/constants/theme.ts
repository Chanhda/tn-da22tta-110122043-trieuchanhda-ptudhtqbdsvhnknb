/**
 * Modern Heritage Design System
 * Dark luxury aesthetic inspired by Khmer architecture:
 * Deep charcoal backgrounds · Gold accents · Playfair Display + Inter
 */

import { Platform } from 'react-native';

// ─── Color Palette ─────────────────────────────────────────
export const Colors = {
  // Dynamic light/dark theme color palettes
  light: buildLightPalette(),
  dark: buildPalette(),
};

function buildLightPalette() {
  return {
    // ── Backgrounds ──────────────────────────
    background: '#F9F6F0',           // warm luxury parchment/sand
    backgroundSecondary: '#F3EDE2',  // slightly deeper warm cream/sand
    backgroundTertiary: '#E9DEC9',   // surface container
    surface: '#F9F6F0',
    surfaceHigh: '#F3EDE2',
    surfaceHighest: '#E9DEC9',
    surfaceBright: '#FFFFFF',

    // ── Text ────────────────────────────────
    text: '#1C1A17',                 // dark charcoal with warm gold tone
    textSecondary: '#62584C',        // medium warm grey/brown
    textTertiary: '#8E7D6A',         // outline warm grey
    textInverse: '#F9F6F0',

    // ── Primary — Gold ───────────────────────
    primary: '#B68B1E',              // rich warm gold (good contrast on light cream)
    primaryDark: '#8F6C13',          // darker rich gold
    primaryLight: '#E8CA74',         // softer gold
    primaryContainer: '#B68B1E',

    // ── Secondary — Deep Red ─────────────────
    secondary: '#A83B2D',            // rich brick red
    secondaryContainer: '#FCECEB',

    // ── Tertiary — Teal/Emerald ───────────────
    accent: '#007073',               // deep rich teal
    accentGreen: '#005759',
    accentPurple: '#564483',

    // ── Semantic ─────────────────────────────
    success: '#007073',
    warning: '#B68B1E',
    error: '#BA1A1A',
    info: '#007073',

    // ── Borders & Dividers ────────────────────
    border: '#D0C4B2',               // warm border
    borderLight: '#E2D8C9',
    divider: '#D0C4B2',

    // ── Cards & UI ────────────────────────────
    card: '#F3EDE2',
    cardHover: '#E9DEC9',

    // ── Tab Bar ───────────────────────────────
    tint: '#B68B1E',
    icon: '#8E7D6A',
    tabIconDefault: '#8E7D6A',
    tabIconSelected: '#B68B1E',
    tabBackground: '#F3EDE2',

    // ── Overlay ───────────────────────────────
    overlay: 'rgba(0,0,0,0.5)',
    shadow: 'rgba(182,139,30,0.1)',
    shadowDark: 'rgba(0,0,0,0.15)',
    glassBackground: 'rgba(249,246,240,0.7)',
    glassBorder: 'rgba(182,139,30,0.2)',
    goldGlow: 'rgba(182,139,30,0.12)',
  };
}

function buildPalette() {
  return {
    // ── Backgrounds ──────────────────────────
    background: '#131313',           // deep charcoal
    backgroundSecondary: '#1C1B1B',  // surface-container-low
    backgroundTertiary: '#201F1F',   // surface-container
    surface: '#131313',
    surfaceHigh: '#2A2A2A',          // surface-container-high
    surfaceHighest: '#353534',       // surface-container-highest
    surfaceBright: '#393939',

    // ── Text ────────────────────────────────
    text: '#E5E2E1',                 // on-surface
    textSecondary: '#D0C5AF',        // on-surface-variant
    textTertiary: '#99907C',         // outline
    textInverse: '#131313',

    // ── Primary — Gold ───────────────────────
    primary: '#F2CA50',              // gold bright
    primaryDark: '#D4AF37',          // gold rich
    primaryLight: '#FFE088',         // gold light
    primaryContainer: '#D4AF37',

    // ── Secondary — Deep Red ─────────────────
    secondary: '#FFB4A8',
    secondaryContainer: '#920703',

    // ── Tertiary — Teal/Emerald ───────────────
    accent: '#7FDEDD',               // tertiary teal
    accentGreen: '#62C2C2',
    accentPurple: '#9B88C6',         // kept for backward compat with older screens

    // ── Semantic ─────────────────────────────
    success: '#7FDEDD',              // teal as success
    warning: '#F2CA50',              // gold as warning
    error: '#FFB4AB',
    info: '#7FDEDD',

    // ── Borders & Dividers ────────────────────
    border: '#4D4635',               // outline-variant
    borderLight: '#4D4635',
    divider: '#4D4635',

    // ── Cards & UI ────────────────────────────
    card: '#1C1B1B',
    cardHover: '#201F1F',

    // ── Tab Bar ───────────────────────────────
    tint: '#F2CA50',
    icon: '#99907C',
    tabIconDefault: '#99907C',
    tabIconSelected: '#F2CA50',
    tabBackground: '#131313',

    // ── Overlay ───────────────────────────────
    overlay: 'rgba(0,0,0,0.7)',
    shadow: 'rgba(212,175,55,0.12)',
    shadowDark: 'rgba(0,0,0,0.5)',
    glassBackground: 'rgba(30,30,30,0.6)',
    glassBorder: 'rgba(212,175,55,0.2)',
    goldGlow: 'rgba(212,175,55,0.15)',
  };
}

// ─── Font Families ─────────────────────────────────────────
export const FontFamily = Platform.select({
  web: {
    playfair: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
    playfairBold: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
    playfairMedium: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
    inter: "'Inter', system-ui, -apple-system, sans-serif",
    interMedium: "'Inter', system-ui, -apple-system, sans-serif",
    interSemiBold: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "system-ui, -apple-system, sans-serif",
  },
  default: {
    playfair: 'Outfit_600SemiBold',
    playfairBold: 'Outfit_700Bold',
    playfairMedium: 'Outfit_500Medium',
    inter: 'Inter_400Regular',
    interMedium: 'Inter_500Medium',
    interSemiBold: 'Inter_600SemiBold',
    serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
    sans: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
})!;

// ─── Typography ─────────────────────────────────────────────
export const Typography = {
  // Display — Hero text
  displayLarge: {
    fontFamily: FontFamily.playfairBold,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -0.96,
    fontWeight: '700' as const,
  },
  displayMedium: {
    fontFamily: FontFamily.playfair,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.8,
    fontWeight: '600' as const,
  },
  displaySmall: {
    fontFamily: FontFamily.playfair,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as const,
  },

  // Headline
  headlineLarge: {
    fontFamily: FontFamily.playfair,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as const,
  },
  headlineMedium: {
    fontFamily: FontFamily.playfair,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '500' as const,
  },
  headlineSmall: {
    fontFamily: FontFamily.playfair,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500' as const,
  },

  // Title — UI sections
  titleLarge: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  titleMedium: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },

  // Body
  bodyLarge: {
    fontFamily: FontFamily.inter,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: FontFamily.inter,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: FontFamily.inter,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },

  // Label — category tags, nav labels
  labelLarge: {
    fontFamily: FontFamily.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.7,
    fontWeight: '600' as const,
  },
  labelMedium: {
    fontFamily: FontFamily.interMedium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontFamily: FontFamily.interMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontWeight: '500' as const,
  },
};

// ─── Spacing (4px base) ─────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 56,
  xxxl: 80,
  containerMargin: 20,
};

// ─── Border Radius ──────────────────────────────────────────
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// ─── Shadows ────────────────────────────────────────────────
const _shadowsNative = {
  /** Subtle elevation */
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  /** Card elevation */
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  /** Modal / hero elevation */
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  /** Gold glow for primary elements */
  goldGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
};

const _shadowsWeb = {
  small: { boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
  medium: { boxShadow: '0 4px 12px rgba(0,0,0,0.4)' },
  large: { boxShadow: '0 8px 20px rgba(0,0,0,0.5)' },
  goldGlow: { boxShadow: '0 0 20px rgba(212,175,55,0.15)' },
};

export const Shadows = Platform.select<any>({
  web: _shadowsWeb,
  default: _shadowsNative,
});

// ─── Animation ─────────────────────────────────────────────
export const Animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
};

// ─── Glass morphism helper ─────────────────────────────────
export const Glass = {
  /** Frosted glass overlay */
  overlay: {
    backgroundColor: 'rgba(30,30,30,0.6)',
    borderWidth: 0.5,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  /** Nav bar glass */
  navBar: {
    backgroundColor: 'rgba(19,19,19,0.85)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(77,70,53,0.4)',
  },
  /** Header glass */
  header: {
    backgroundColor: 'rgba(19,19,19,0.8)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(77,70,53,0.3)',
  },
};

// ─── Legacy Fonts (kept for compatibility) ─────────────────
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "Outfit, Inter, system-ui, -apple-system, sans-serif",
    serif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    rounded: 'normal',
    mono: 'monospace',
  },
});
