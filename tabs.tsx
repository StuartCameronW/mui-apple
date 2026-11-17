// Custom Tabs implementation that matches the expected API
import * as React from "react";
import { Tabs as MuiTabs, Tab } from "@mui/material";

// Context for managing tabs state
const TabsContext = React.createContext<
  | {
      value: string;
      setValue: (value: string) => void;
    }
  | undefined
>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    { defaultValue, value, onValueChange, className, children, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      value ?? defaultValue
    );
    const currentValue = value ?? internalValue;

    const setValue = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, setValue }}>
        <div ref={ref} className={className} {...(props as any)}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsList must be used within Tabs");

    // Extract tab values from children
    const tabValues: string[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value) {
        tabValues.push(child.props.value);
      }
    });

    const currentValue =
      tabValues.includes(context.value) && context.value
        ? context.value
        : (tabValues[0] ?? "");

    return (
      <MuiTabs
        ref={ref}
        value={currentValue}
        onChange={(_, newValue) => {
          if (typeof newValue === "number") {
            const mapped = tabValues[newValue];
            if (mapped) {
              context.setValue(mapped);
            }
          } else {
            context.setValue(String(newValue));
          }
        }}
        className={className}
        {...props}
      >
        {children}
      </MuiTabs>
    );
  }
);

export const TabsTrigger = React.forwardRef<HTMLDivElement, TabsTriggerProps>(
  ({ value, className, children, ...props }, ref) => {
    return (
      <Tab
        ref={ref}
        label={children}
        value={value}
        className={className}
        {...props}
      />
    );
  }
);

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
      <div
        ref={ref}
        className={className}
        style={{ marginTop: 8 }}
        {...(props as any)}
      >
        {children}
      </div>
    );
  }
);

// Set display names
Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
