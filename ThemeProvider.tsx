import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { colors } from "./colors";
import { ThemeContext, type ThemeContextType, type ThemeMode } from "./useTheme";
import { radius } from "./config";

type FlatPalette = Record<string, Record<string | number, string>>;
type ModeAwarePalette = { light: FlatPalette; dark: FlatPalette };
type PaletteOverride = FlatPalette | ModeAwarePalette;

interface CustomThemeProviderProps {
  children: ReactNode;
  paletteOverride?: PaletteOverride;
  storageKey?: string;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
  paletteOverride,
  storageKey = "theme",
}) => {
  // Initialize preference from localStorage
  const [preference, setPreferenceState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {
      // localStorage might not be available
    }
    return "light";
  });

  // Update localStorage whenever preference changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, preference);
    } catch {
      // localStorage might not be available (e.g., in private browsing)
    }
  }, [preference, storageKey]);

  // Wrapper to update state (localStorage is handled by useEffect)
  const setPreference = setPreferenceState;

  // Track system preference separately to trigger updates
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Get system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Resolve the actual theme mode (light or dark, never system)
  const mode: "light" | "dark" =
    preference === "system" ? systemTheme : preference;

  // Listen for system theme changes when preference is "system"
  useEffect(() => {
    if (preference !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(getSystemTheme());
    };

    // Update initial system theme
    setSystemTheme(getSystemTheme());

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

  // Theme debug flag
  const themeDebug =
    typeof window !== "undefined" &&
    ((window as any).__THEME_DEBUG === true ||
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("THEME_DEBUG") === "1"));

  const toggleTheme = () => {
    setPreference((prev) => {
      if (prev === "system") {
        // If system, toggle to the opposite of current system preference
        return getSystemTheme() === "light" ? "dark" : "light";
      }
      return prev === "light" ? "dark" : "light";
    });
  };

  const setMode = (newMode: ThemeMode) => {
    setPreference(newMode);
  };

  const resolveActiveOverride = React.useMemo<FlatPalette | undefined>(() => {
    const ov = paletteOverride as PaletteOverride | undefined;
    if (!ov) return undefined;
    const isModeAware =
      typeof (ov as ModeAwarePalette).light === "object" ||
      typeof (ov as ModeAwarePalette).dark === "object";
    if (isModeAware) {
      const byMode = ov as ModeAwarePalette;
      const resolved =
        (byMode as any)[mode] || (byMode.light as FlatPalette) || undefined;
      return resolved;
    }
    return ov as FlatPalette;
  }, [paletteOverride, mode]);

  // Helper to read override named shade if provided (no numeric fallback from override)
  const pickNamed = (key: string, slot: string, fallback: string) => {
    const group = (resolveActiveOverride as FlatPalette | undefined)?.[key];
    const v = group?.[slot as any];
    return typeof v === "string" ? v : fallback;
  };

  // DRY helper — builds a palette group from a color scale + override key
  const paletteGroup = (
    key: string,
    scale: Record<number, string>,
    lighter: number,
    light: number,
    main: number,
    dark: number,
    darker: number,
    contrastText: string = colors.neutral[50],
  ) => {
    const s = scale as Record<number, string | undefined>;
    return {
      lighter: pickNamed(key, "lighter", s[lighter] ?? ""),
      light: pickNamed(key, "light", s[light] ?? ""),
      main: pickNamed(key, "main", s[main] ?? ""),
      dark: pickNamed(key, "dark", s[dark] ?? ""),
      darker: pickNamed(key, "darker", s[darker] ?? ""),
      contrastText: pickNamed(key, "contrastText", contrastText),
    };
  };

  // SSOT for dropdown/popover paper shadow (Menu, Autocomplete, etc.)
  const dropdownPaperShadow = (t: { palette: { secondary: { darker?: string; dark: string } } }) => ({
    boxShadow: `1px 1px 10px ${alpha(t.palette.secondary.darker ?? t.palette.secondary.dark, 0.03)}`,
  });

  const theme = createTheme({
    palette: {
      mode,
      primary: paletteGroup("primary", colors.primary, 50, 100, 500, 600, 900),
      secondary: paletteGroup("secondary", colors.secondary, 100, 300, 500, 600, 800),
      error: paletteGroup("error", colors.error, 100, 300, 500, 600, 800),
      warning: paletteGroup("warning", colors.warning, 100, 300, 500, 600, 800),
      info: paletteGroup("info", colors.primary, 100, 400, 500, 600, 800),
      success: paletteGroup("success", colors.success, 100, 400, 500, 600, 800),
      neutral: mode === "light"
        ? paletteGroup("neutral", colors.neutral, 100, 400, 600, 700, 900)
        : paletteGroup("neutral", colors.neutral, 100, 300, 400, 600, 800),
      grey: {
        50: colors.neutral[50],
        100: colors.neutral[100],
        200: colors.neutral[200],
        300: colors.neutral[300],
        400: colors.neutral[400],
        500: colors.neutral[500],
        600: colors.neutral[600],
        700: colors.neutral[700],
        800: colors.neutral[800],
        900: colors.neutral[900],
      },
      background: {
        default: pickNamed(
          "background",
          "default",
          mode === "light" ? colors.background.default : colors.neutral[900]
        ),
        paper: pickNamed(
          "background",
          "paper",
          mode === "light" ? colors.background.paper : colors.neutral[800]
        ),
      },
      text: {
        primary:
          mode === "light" ? colors.neutral[800] : colors.neutral[50],
        secondary:
          mode === "light" ? colors.neutral[600] : colors.neutral[400],
      },
    },
    typography: {
      fontFamily:
        '-apple-system,"Geist Sans", "Open Sans", BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.2109375rem",
        lineHeight: 1.0,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontWeight: 600,
        fontSize: "1.921875rem",
        lineHeight: 1.1,
        letterSpacing: "-0.0175em",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.671875rem",
        lineHeight: 1.2,
        letterSpacing: "-0.015em",
      },
      h4: {
        fontWeight: 500,
        fontSize: "1.453125rem",
        lineHeight: 1.3,
        letterSpacing: "-0.0125em",
      },
      h5: {
        fontWeight: 400,
        fontSize: "1.265625rem",
        lineHeight: 1.4,
        letterSpacing: "-0.0075em",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.1rem",
        lineHeight: 1.4,
        letterSpacing: "-0.005em",
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.5,
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 300,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      "0px 1px 3px rgba(0, 0, 0, 0.12)",
      "0px 2px 6px rgba(0, 0, 0, 0.08)",
      "0px 3px 9px rgba(0, 0, 0, 0.06)",
      "0px 4px 12px rgba(0, 0, 0, 0.05)",
      "0px 5px 15px rgba(0, 0, 0, 0.04)",
      "0px 6px 18px rgba(0, 0, 0, 0.04)",
      "0px 7px 21px rgba(0, 0, 0, 0.03)",
      "0px 8px 24px rgba(0, 0, 0, 0.03)",
      "0px 9px 27px rgba(0, 0, 0, 0.03)",
      "0px 10px 30px rgba(0, 0, 0, 0.02)",
      "0px 11px 33px rgba(0, 0, 0, 0.02)",
      "0px 12px 36px rgba(0, 0, 0, 0.02)",
      "0px 13px 39px rgba(0, 0, 0, 0.02)",
      "0px 14px 42px rgba(0, 0, 0, 0.02)",
      "0px 15px 45px rgba(0, 0, 0, 0.02)",
      "0px 16px 48px rgba(0, 0, 0, 0.02)",
      "0px 17px 51px rgba(0, 0, 0, 0.02)",
      "0px 18px 54px rgba(0, 0, 0, 0.02)",
      "0px 19px 57px rgba(0, 0, 0, 0.02)",
      "0px 20px 60px rgba(0, 0, 0, 0.02)",
      "0px 21px 63px rgba(0, 0, 0, 0.02)",
      "0px 22px 66px rgba(0, 0, 0, 0.02)",
      "0px 23px 69px rgba(0, 0, 0, 0.02)",
      "0px 24px 72px rgba(0, 0, 0, 0.02)",
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 300,
            borderRadius: "2rem",
            boxShadow: "none",
            padding: "0.3rem 0.75rem",
            "&:hover": {
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
            "&:focus": {
              boxShadow: "none",
            },
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
          },
          outlined: ({ theme }) => ({
            "&:hover": {
              backgroundColor: alpha(
                theme.palette.primary.main,
                mode === "light" ? 0.06 : 0.12
              ),
            },
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              backgroundColor: "transparent",
              "& fieldset": {
                borderColor:
                  mode === "light"
                    ? colors.neutral[200]
                    : colors.neutral[700],
                borderWidth: 1.5,
              },
            },
            "& .MuiInputLabel-root": {
              fontWeight: 400,
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: radius,
            boxShadow: "none",
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: radius,
            boxShadow: "none",
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: "1rem",
            "&:last-child": {
              paddingBottom: "1rem",
            },
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: ({ theme }) => ({
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[800],
            fontWeight: 600,
            fontSize: "0.875rem",
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[700]
              }`,
          }),
          body: ({ theme }) => ({
            fontSize: "0.9375rem",
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[800]
              }`,
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                mode === "light"
                  ? colors.neutral[200]
                  : colors.neutral[700],
              borderWidth: 1.5,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor:
                mode === "light"
                  ? colors.neutral[300]
                  : colors.neutral[600],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
            // Minimal appearance via data attribute (used by our wrapper Select)
            '&[data-variant="minimal"]': {
              borderRadius: 4,
              width: "fit-content",
              "&.MuiInputBase-fullWidth": {
                width: "100%",
              },
              backgroundColor: alpha(
                theme.palette.primary.main,
                mode === "light" ? 0.08 : 0.16
              ),
              "& .MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
              "& .MuiSelect-select": {
                color: theme.palette.primary.main,
                padding: "0.25rem 0.5rem",
                paddingRight: "1.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              "& .MuiSelect-icon": {
                color: theme.palette.primary.main,
              },
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  mode === "light" ? 0.12 : 0.2
                ),
              },
              "&.Mui-focused": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  mode === "light" ? 0.14 : 0.24
                ),
              },
            },
          }),
        },
        variants: [
          {
            props: { variant: "minimal" as any },
            style: ({ theme }) => ({
              borderRadius: 4,
              width: "fit-content",
              "&.MuiInputBase-fullWidth": {
                width: "100%",
              },
              backgroundColor: alpha(
                theme.palette.primary.main,
                mode === "light" ? 0.08 : 0.16
              ),
              "& .MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
              "& .MuiSelect-select": {
                color: theme.palette.primary.main,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  mode === "light" ? 0.12 : 0.2
                ),
              },
              "&.Mui-focused": {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  mode === "light" ? 0.14 : 0.24
                ),
              },
            }),
          },
        ],
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => dropdownPaperShadow(theme),
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: ({ theme }) => dropdownPaperShadow(theme),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                mode === "light" ? colors.neutral[50] : colors.neutral[800],
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "light" ? colors.primary[50] : colors.primary[900],
              "&:hover": {
                backgroundColor:
                  mode === "light" ? colors.primary[100] : colors.primary[800],
              },
            },
            "&.Mui-focusVisible": {
              backgroundColor:
                mode === "light"
                  ? colors.neutral[100]
                  : colors.neutral[700],
            },
            "& .MuiTouchRipple-root": {
              color:
                mode === "light"
                  ? colors.neutral[400]
                  : colors.neutral[600],
            },
            "& .MuiTouchRipple-child": {
              backgroundColor:
                mode === "light"
                  ? colors.neutral[400]
                  : colors.neutral[600],
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: "2.4rem",
            height: "1.3rem",
            padding: 0,
            margin: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: "2px",
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: `translateX(calc(2.4rem - calc(1.3rem - 0.3rem) - 4px))`,
                color: colors.neutral[50],
                "& + .MuiSwitch-track": {
                  backgroundColor: "primary",
                  opacity: 1,
                  border: 0,
                },
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: `calc(1.3rem - 0.3rem)`,
              height: `calc(1.3rem - 0.3rem)`,
              borderRadius: "50%",
            },
            "& .MuiSwitch-track": {
              borderRadius: `calc(1.3rem / 2)`,
              backgroundColor:
                mode === "light"
                  ? colors.neutral[300]
                  : colors.neutral[700],
              opacity: 1,
            },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: 0,
            marginRight: 0,
          },
          label: {
            fontSize: "1rem",
            fontWeight: 500,
            color:
              mode === "light" ? colors.neutral[900] : colors.neutral[100],
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              backgroundColor: "transparent",
            },
            "&:active": {
              backgroundColor:
                mode === "light" ? colors.neutral[50] : colors.neutral[700],
            },
            "& .MuiTouchRipple-root": {
              color:
                mode === "light"
                  ? colors.neutral[200]
                  : colors.neutral[600],
            },
            "& .MuiTouchRipple-child": {
              backgroundColor:
                mode === "light"
                  ? colors.neutral[200]
                  : colors.neutral[600],
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: "0.5rem",
            borderRadius: "9999px",
          },
          bar: {
            borderRadius: "inherit",
          },
        },
      },
    },
  });

  // Convert hex color to HSL components string like "210 100% 50%"
  const hexToHslComponents = (hex: string): string => {
    const normalized = hex.replace("#", "");
    const bigint = parseInt(
      normalized.length === 3
        ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
        : normalized,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const rNorm = r / 255,
      gNorm = g / 255,
      bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm),
      min = Math.min(rNorm, gNorm, bNorm);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }
    const hh = Math.round(h * 360);
    const ss = Math.round(s * 100);
    const ll = Math.round(l * 100);
    return `${hh} ${ss}% ${ll}%`;
  };

  const cssVars = useMemo(() => {
    const p = theme.palette;
    const buildPaletteVars = (palette: typeof theme.palette) => {
      const vars: Record<string, string> = {};
      // Core background/text
      vars["--palette-background-default"] = hexToHslComponents(
        palette.background.default as string
      );
      vars["--palette-background-paper"] = hexToHslComponents(
        palette.background.paper as string
      );
      vars["--palette-text-primary"] = hexToHslComponents(
        palette.text.primary as string
      );
      vars["--palette-text-secondary"] = hexToHslComponents(
        palette.text.secondary as string
      );
      if (palette.divider) {
        vars["--palette-divider"] = hexToHslComponents(
          palette.divider as unknown as string
        );
      }
      // Helper to add a color group (primary/secondary/error/warning/info/success)
      const addGroup = (name: string, group: any) => {
        if (!group) return;
        if (group.main)
          vars[`--palette-${name}-main`] = hexToHslComponents(group.main);
        if (group.light)
          vars[`--palette-${name}-light`] = hexToHslComponents(group.light);
        if (group.dark)
          vars[`--palette-${name}-dark`] = hexToHslComponents(group.dark);
        if (group.lighter)
          vars[`--palette-${name}-lighter`] = hexToHslComponents(group.lighter);
        if (group.darker)
          vars[`--palette-${name}-darker`] = hexToHslComponents(group.darker);
        if (group.contrastText)
          vars[`--palette-${name}-contrastText`] = hexToHslComponents(
            group.contrastText
          );
      };
      addGroup("primary", palette.primary);
      addGroup("secondary", palette.secondary);
      addGroup("neutral", (palette as any).neutral);
      addGroup("error", palette.error);
      addGroup("warning", palette.warning);
      addGroup("info", palette.info);
      addGroup("success", palette.success);
      // Grey shades
      const greyShades = [
        50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
      ] as const;
      greyShades.forEach((s) => {
        const v = (palette.grey as any)?.[s];
        if (typeof v === "string") {
          vars[`--palette-grey-${s}`] = hexToHslComponents(v);
        }
      });

      // Backward-compatibility aliases (existing tokens used across the app)
      vars["--background"] = vars["--palette-background-default"];
      vars["--foreground"] = vars["--palette-text-primary"];
      if (vars["--palette-primary-main"]) {
        vars["--primary"] = vars["--palette-primary-main"];
        if (vars["--palette-primary-contrastText"]) {
          vars["--primary-foreground"] = vars["--palette-primary-contrastText"];
        }
        vars["--primary-light"] =
          vars["--palette-primary-light"] ?? vars["--palette-primary-main"];
        vars["--primary-dark"] =
          vars["--palette-primary-dark"] ?? vars["--palette-primary-main"];
        vars["--primary-lighter"] =
          vars["--palette-primary-lighter"] ??
          vars["--palette-primary-light"] ??
          vars["--palette-primary-main"];
        vars["--primary-darker"] =
          vars["--palette-primary-darker"] ??
          vars["--palette-primary-dark"] ??
          vars["--palette-primary-main"];
      }
      if (vars["--palette-secondary-main"]) {
        vars["--secondary"] = vars["--palette-secondary-main"];
        vars["--secondary-light"] =
          vars["--palette-secondary-light"] ?? vars["--palette-secondary-main"];
        vars["--secondary-dark"] =
          vars["--palette-secondary-dark"] ?? vars["--palette-secondary-main"];
        vars["--secondary-lighter"] =
          vars["--palette-secondary-lighter"] ??
          vars["--palette-secondary-light"] ??
          vars["--palette-secondary-main"];
        vars["--secondary-darker"] =
          vars["--palette-secondary-darker"] ??
          vars["--palette-secondary-dark"] ??
          vars["--palette-secondary-main"];
        if (vars["--palette-secondary-contrastText"]) {
          vars["--secondary-foreground"] =
            vars["--palette-secondary-contrastText"];
        }
      }
      // Other common tokens used in the app
      vars["--destructive"] = hexToHslComponents(palette.error.main);
      vars["--destructive-foreground"] = hexToHslComponents(
        (palette.error as any).contrastText ?? colors.neutral[50]
      );
      // Muted tokens
      vars["--muted"] = hexToHslComponents(
        palette.grey[mode === "light" ? 200 : 700]
      );
      vars["--muted-foreground"] = hexToHslComponents(
        palette.text.secondary as string
      );
      // Accent
      vars["--accent"] = hexToHslComponents(
        (palette.primary as any)[mode === "light" ? "light" : "dark"]
      );
      vars["--accent-foreground"] = hexToHslComponents(
        (palette.primary as any)[mode === "light" ? "dark" : "light"]
      );
      // Popover/Card
      vars["--popover"] = hexToHslComponents(
        palette.background.paper as string
      );
      vars["--popover-foreground"] = vars["--palette-text-primary"];
      vars["--card"] = hexToHslComponents(palette.background.paper as string);
      vars["--card-foreground"] = vars["--palette-text-primary"];
      // Border/Input/Ring
      vars["--border"] = hexToHslComponents(
        palette.grey[mode === "light" ? 200 : 700]
      );
      vars["--input"] = hexToHslComponents(
        palette.grey[mode === "light" ? 300 : 600]
      );
      vars["--ring"] =
        vars["--palette-primary-main"] ??
        hexToHslComponents(palette.primary.main);
      vars["--radius"] = `${theme.shape.borderRadius}px`;

      return vars;
    };

    const light = buildPaletteVars(p);
    const dark = buildPaletteVars(p);

    return { light, dark };
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  // Apply CSS variables directly via JS so Tailwind tokens (bg-background, etc.)
  // reflect the current server-provided palette immediately without relying on
  // stylesheet load order.
  useEffect(() => {
    try {
      const root = document.documentElement;
      const vars = mode === "dark" ? cssVars.dark : cssVars.light;
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, String(value));
      });
    } catch {
      // no-op
    }
  }, [cssVars, mode, themeDebug]);

  const contextValue: ThemeContextType = {
    mode: preference, // Expose the preference (light/dark/system), not the resolved mode
    toggleTheme,
    setMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            ":root": {
              ...cssVars.light,
              fontSize: "16px", // Base font size for rem calculations (1rem = 16px)
            },
            ".dark": cssVars.dark,
            'input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], textarea, [contenteditable="true"]':
            {
              caretColor: (theme as any).palette.primary.main,
            },
          })}
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
