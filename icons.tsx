import React from "react";
import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

export type IconSize = "xs" | "sm" | "md" | "lg";

export interface IconProps
  extends Omit<SvgIconProps, "component" | "children" | "fontSize" | "color"> {
  as: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: IconSize;
  /**
   * Icon color — works just like any MUI component's `color` prop.
   *
   * Accepts:
   * - A palette name: `"primary"`, `"error"`, `"neutral"`, `"success"`, `"warning"`, `"info"`
   *   → resolves to `theme.palette[name].main`
   * - Dot-notation: `"primary.light"`, `"neutral.darker"`, `"error.contrastText"`
   *   → resolves to `theme.palette[group][shade]`
   * - `"inherit"` (default) — inherits the parent text color
   * - Any raw CSS color: `"#FF0000"`, `"rgb(0,0,0)"`, `"red"`
   *
   * @default "inherit"
   *
   * @example
   * <Icon as={Lucide.Trash2} color="error" />
   * <Icon as={Lucide.Star} color="warning.main" />
   * <Icon as={Lucide.User} color="neutral.darker" />
   * <Icon as={Lucide.Check} color="success" />
   */
  color?: string;
  /**
   * SVG stroke width passed through to the underlying icon.
   * Lucide icons default to `2`. Use `1.5` for a lighter feel or `2.5` for bolder.
   *
   * @default undefined (uses the icon library's default)
   *
   * @example
   * <Icon as={Lucide.Search} strokeWidth={1.5} />
   */
  strokeWidth?: number;
}

const sizeToPx: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * Resolve a color string against the MUI theme palette.
 *
 * - `"primary"` → `theme.palette.primary.main`
 * - `"primary.light"` → `theme.palette.primary.light`
 * - `"inherit"` → `"inherit"`
 * - anything else (hex, rgb, css name) → returned as-is
 */
function resolveColor(
  colorProp: string,
  palette: Record<string, any>,
): string {
  if (colorProp === "inherit") return "inherit";

  // Dot-notation: "primary.light", "neutral.darker", etc.
  const dotIdx = colorProp.indexOf(".");
  if (dotIdx !== -1) {
    const group = colorProp.slice(0, dotIdx);
    const shade = colorProp.slice(dotIdx + 1);
    const resolved = palette[group]?.[shade];
    if (typeof resolved === "string") return resolved;
  }

  // Plain palette name: "primary", "error", "neutral", etc.
  const main = palette[colorProp]?.main;
  if (typeof main === "string") return main;

  // Fallback — treat as a raw CSS value
  return colorProp;
}

/**
 * A flexible icon wrapper that renders any SVG icon with consistent sizing
 * and MUI-style color support.
 *
 * ## Color
 * Pass `color` exactly like you would on any MUI component:
 * ```tsx
 * <Icon as={Lucide.Trash2} color="error" />
 * <Icon as={Lucide.Star}   color="warning.main" />
 * <Icon as={Lucide.User}   color="neutral.darker" />
 * ```
 *
 * ## Stroke width
 * Lucide icons are stroke-based. Control thickness via `strokeWidth`:
 * ```tsx
 * <Icon as={Lucide.Search} strokeWidth={1.5} />   // lighter
 * <Icon as={Lucide.Search} strokeWidth={2.5} />   // bolder
 * ```
 *
 * You can also pass any SVG attribute that the underlying icon accepts
 * (e.g. `strokeLinecap`, `strokeLinejoin`) through the spread props.
 *
 * ## Sizing
 * Use the `size` prop for preset sizes or `sx={{ fontSize: N }}` for custom:
 * ```tsx
 * <Icon as={Lucide.Heart} size="sm" />              // 16px
 * <Icon as={Lucide.Heart} sx={{ fontSize: 32 }} />   // 32px
 * ```
 *
 * | size | px |
 * |------|----|
 * | xs   | 14 |
 * | sm   | 16 |
 * | md   | 20 |
 * | lg   | 24 |
 */
export function Icon({
  as,
  size = "md",
  color = "inherit",
  strokeWidth,
  sx,
  ...rest
}: IconProps) {
  const theme = useTheme();
  const resolved = resolveColor(color, theme.palette as any);

  return (
    <SvgIcon
      component={as as any}
      inheritViewBox
      sx={{
        fontSize: sizeToPx[size],
        color: resolved,
        // Ensure stroke-based icon sets (e.g. Lucide) don't get filled by MUI defaults
        fill: "none",
        ...(strokeWidth != null ? { "& *": { strokeWidth } } : {}),
        ...(sx as object),
      }}
      fontSize="inherit"
      {...(strokeWidth != null ? { strokeWidth } : {})}
      {...rest}
    />
  );
}
