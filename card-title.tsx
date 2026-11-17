import React from "react";
import { Typography, type TypographyProps } from "@mui/material";

export interface CardTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  color?: TypographyProps["color"]; // e.g., 'primary' | 'secondary' | 'error' | ...
  className?: string;
}

export function CardTitle({
  title,
  subtitle,
  color = "inherit",
  className,
}: CardTitleProps) {
  return (
    <div className={className}>
      <Typography variant="h6" color={color}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" className="text-muted-foreground">
          {subtitle}
        </Typography>
      ) : null}
    </div>
  );
}
