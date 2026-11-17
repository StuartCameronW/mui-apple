import * as React from "react";
import {
  Box,
  Collapse,
  Divider,
  Typography,
  TextField,
  TextFieldProps,
} from "@mui/material";

export interface InputGroupProps {
  children: React.ReactNode;
  dense?: boolean;
  elevation?: number;
  /**
   * Optional title rendered above the group (e.g., section label)
   */
  title?: React.ReactNode;
  sx?: any;
}

export function InputGroup({ children, dense, title, sx }: InputGroupProps) {
  const items = React.Children.toArray(children).filter(
    Boolean,
  ) as React.ReactElement<InputGroupRowProps>[];

  return (
    <div className="flex flex-col gap-1">
      {title ? (
        <Typography
          variant="caption"
          sx={{ color: (t) => t.palette.text.secondary, px: 0.5 }}
        >
          {title}
        </Typography>
      ) : null}
      <Box
        sx={{
          px: "1rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? t.palette.background.default
              : t.palette.grey[50],
          ...sx,
        }}
      >
        {items.map((child, idx) => {
          const isLast = idx === items.length - 1;
          const isFirst = idx === 0;
          return (
            <React.Fragment key={child.key ?? idx}>
              {React.cloneElement(child, { isFirst, isLast, dense })}
              {!isLast ? <Divider /> : null}
            </React.Fragment>
          );
        })}
      </Box>
    </div>
  );
}

export interface InputGroupRowProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  /** internal, set by InputGroup */
  isFirst?: boolean;
  /** internal, set by InputGroup */
  isLast?: boolean;
  /** forwarded from group */
  dense?: boolean;
  /** Show error styling (tints the label red) */
  error?: boolean;
  /** Helper / error message rendered below the row */
  helperText?: React.ReactNode;
}

export function InputGroupRow({
  label,
  children,
  dense,
  error,
  helperText,
}: InputGroupRowProps) {
  const showHelper = !!helperText;
  const displayedHelper = React.useRef<React.ReactNode>(helperText);
  if (helperText) {
    displayedHelper.current = helperText;
  }

  return (
    <Box sx={{ bgcolor: "transparent" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: dense ? 1 : 1.25,
          minHeight: dense ? 44 : 52,
        }}
      >
        <Typography
          sx={{
            flex: "0 0 auto",
            minWidth: 96,
            fontWeight: 400,
            color: (t) => (error ? t.palette.error.main : t.palette.grey[700]),
            transition: "color 200ms ease",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {children}
        </Box>
      </Box>
      <Collapse in={showHelper} timeout={200}>
        <Box sx={{ pb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: (t) =>
                error ? t.palette.error.main : t.palette.text.secondary,
            }}
          >
            {displayedHelper.current}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Convenience TextField with opinionated defaults for use inside an InputGroupRow.
 * - Standard variant
 * - Full width
 * - No underline
 * - Right-aligned input text (to mimic Apple settings style)
 */
export function GroupedTextField(
  props: Omit<TextFieldProps, "error" | "helperText">,
) {
  const { slotProps, variant, fullWidth, ...rest } = props as Omit<
    TextFieldProps,
    "error" | "helperText"
  > & {
    slotProps?: any;
  };

  const userInputSlot = (slotProps as any)?.input || {};
  const mergedSlotProps = {
    ...slotProps,
    input: {
      disableUnderline: true,
      sx: {
        "& input": { textAlign: "right" },
        ...(userInputSlot?.sx || {}),
      },
      ...userInputSlot,
    },
  };

  return (
    <TextField
      {...rest}
      variant={variant ?? "standard"}
      fullWidth={fullWidth ?? true}
      slotProps={mergedSlotProps}
    />
  );
}
