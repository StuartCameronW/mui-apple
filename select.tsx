import React from "react";
import { Select as MuiSelect } from "@mui/material";
import type { SelectProps as MuiSelectProps } from "@mui/material";
import { ChevronDown } from "lucide-react";

// Type augmentation: custom Select variant
declare module "@mui/material/Select" {
  interface SelectPropsVariantOverrides {
    minimal: true;
  }
}

export type SelectProps<Value = unknown> = Omit<
  MuiSelectProps<Value>,
  "variant"
> & {
  variant?: MuiSelectProps<Value>["variant"] | "minimal";
};

export const Select = React.forwardRef<any, SelectProps>(
  function Select(props, ref) {
    const { variant, sx, IconComponent, ...rest } =
      props as SelectProps as SelectProps & {
        sx?: any;
      };
    const isMinimal = variant === "minimal";
    const isSmall = (props as any).size === "small";
    // Minimal select: replace dropdown icon with ChevronDown and animate rotation
    const MinimalSelectIcon = React.useMemo(() => {
      return React.forwardRef<SVGSVGElement, any>(
        function MinimalSelectIcon(iconProps, iconRef) {
          const className: string = iconProps?.className || "";
          const isOpen = className.includes("MuiSelect-iconOpen");
          return React.createElement(ChevronDown as any, {
            ref: iconRef,
            ...iconProps,
            className,
            style: {
              transition: "transform 150ms ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              width: isSmall ? "0.95rem" : "1.1rem",
              height: isSmall ? "0.95rem" : "1.1rem",
              ...(iconProps?.style || {}),
            },
          });
        }
      );
    }, [isSmall]);

    const smallMinimalSx =
      isMinimal && isSmall
        ? {
            // Also catch MUI's inputSizeSmall class on the select div
            "& .MuiSelect-select.MuiInputBase-inputSizeSmall": {
              fontSize: "0.9rem",
              lineHeight: 1.3,
              minHeight: 0,
              height: "auto",
            },
          }
        : undefined;

    return React.createElement(MuiSelect as any, {
      ref,
      variant: isMinimal ? "outlined" : (variant as any),
      "data-variant": isMinimal ? "minimal" : undefined,
      IconComponent: isMinimal
        ? IconComponent || (MinimalSelectIcon as any)
        : IconComponent,
      ...(rest as any),
      sx: { ...(smallMinimalSx as any), ...(sx as any) } as any,
    });
  }
);
