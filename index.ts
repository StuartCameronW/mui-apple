// Main exports for the Apple UI Theme package
export { colors, getColor, semanticColors } from "./colors";
export { CustomThemeProvider } from "./ThemeProvider";
export { useTheme as useAppleTheme, useToggleTheme, ThemeContext } from "./useTheme";
export type { ThemeContextType, ThemeMode } from "./useTheme";

// Re-export all MUI components
// The styling for these components is now handled by mui-theme.ts
export * from "@mui/material";

// CardTitle component with optional subtitle
export { CardTitle } from "./card-title";

// Custom Dialog components
export { DialogHeader } from "./dialog";

// Custom Tabs components
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

// Icon wrapper to support external icon sets (e.g., lucide-react)
export { Icon } from "./icons";

// Input Group components (Apple-style grouped form fields)
export { InputGroup, InputGroupRow, GroupedTextField } from "./input-group";

// Optional color input re-export (apps must install `mui-color-input` in the app)
export { MuiColorInput } from "mui-color-input";

// Custom TabSelector component (animated pill-style tabs)
export { TabSelector } from "./tab-selector";

// Type augmentation: extend PaletteColor with lighter/darker slots + neutral palette
declare module "@mui/material/styles" {
  interface PaletteColor {
    lighter?: string;
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
  interface Palette {
    neutral: PaletteColor;
  }
  interface PaletteOptions {
    neutral?: SimplePaletteColorOptions;
  }
}

// Type augmentation: allow custom Select variant "minimal"
declare module "@mui/material/Select" {
  interface SelectPropsVariantOverrides {
    minimal: true;
  }
}

// Wrapped Select that supports variant="minimal" without runtime PropTypes warning
export { Select, type SelectProps } from "./select";
