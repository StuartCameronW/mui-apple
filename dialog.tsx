import React from "react";

export function DialogHeader({
  children,
  style,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className="flex flex-col gap-1 p-4 border-b border-divider"
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
