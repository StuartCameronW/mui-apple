// Single Source of Truth for Color Palettes - Apple Design System
export const colors = {
  // Apple Primary Blue
  primary: {
    50: "#E8F4FD",
    100: "#D1E9FB",
    200: "#A3D2F7",
    300: "#75BCF3",
    400: "#5AC8FA",
    500: "#007AFF",
    600: "#0051D0",
    700: "#004BA0",
    800: "#003D80",
    900: "#002E5F",
  },

  // Apple Indigo — secondary brand color
  secondary: {
    50: "#F0F0FF",
    100: "#E1E0FF",
    200: "#C3C2FF",
    300: "#A5A3FF",
    400: "#7E7CE8",
    500: "#5856D6",
    600: "#4543AB",
    700: "#343283",
    800: "#25245E",
    900: "#17163D",
  },

  // Neutral greys (Apple system grays)
  neutral: {
    50: "#F9F9F9",
    100: "#F2F2F7",
    200: "#E5E5EA",
    300: "#D1D1D6",
    400: "#C7C7CC",
    500: "#AEAEB2",
    600: "#8E8E93",
    700: "#636366",
    800: "#48484A",
    900: "#1C1C1E",
  },

  // Apple Green
  success: {
    50: "#E8F7EC",
    100: "#D1EFDA",
    200: "#A3DFB5",
    300: "#75CF90",
    400: "#67D775",
    500: "#34C759",
    600: "#28A745",
    700: "#20803A",
    800: "#18592E",
    900: "#0F3D1F",
  },

  // Apple Orange
  warning: {
    50: "#FFF4E6",
    100: "#FFE9CC",
    200: "#FFD399",
    300: "#FFAD33",
    400: "#FFB84D",
    500: "#FF9500",
    600: "#CC7700",
    700: "#B36600",
    800: "#994D00",
    900: "#663300",
  },

  // Apple Red
  error: {
    50: "#FFF0EF",
    100: "#FFE0DE",
    200: "#FFC1BD",
    300: "#FF6961",
    400: "#FF524C",
    500: "#FF3B30",
    600: "#D70015",
    700: "#B8000F",
    800: "#99000C",
    900: "#660008",
  },

  // Apple Background Colors
  background: {
    default: "#F3F7FF",
    paper: "#FFFFFF",
  },
} as const;

// Helper function to get color with shade
export function getColor<
  T extends keyof typeof colors,
  S extends keyof (typeof colors)[T],
>(colorName: T, shade?: S): (typeof colors)[T][S] {
  const defaultShade = 500 as S;
  return colors[colorName][shade ?? defaultShade];
}

// Semantic color mappings
export const semanticColors = {
  background: colors.neutral[50],
  surface: "#ffffff",
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[500],
  },
  border: colors.neutral[200],
} as const;
