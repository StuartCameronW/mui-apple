import React from "react";
import { Tabs, Tab, Box, useTheme, alpha } from "@mui/material";

type TabItem = {
  key: string;
  label: string;
};

export interface TabSelectorProps {
  tabConfig: TabItem[];
  onTabChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  backdrop?: boolean;
  initialIndex?: number;
}

export function TabSelector({
  tabConfig,
  onTabChange,
  className,
  style,
  backdrop = false,
  initialIndex = 0,
}: TabSelectorProps) {
  const { palette } = useTheme();
  const tabsRef = React.useRef<HTMLDivElement | null>(null);
  const [indicatorLeft, setIndicatorLeft] = React.useState(0);
  const [indicatorWidth, setIndicatorWidth] = React.useState(0);

  const [tabValue, setTabValue] = React.useState<number>(initialIndex);
  React.useEffect(() => {
    setTabValue(initialIndex);
  }, [initialIndex]);

  // Update indicator position when tab changes
  React.useLayoutEffect(() => {
    const measure = () => {
      if (!tabsRef.current) return;
      const tabElements = tabsRef.current.querySelectorAll(".MuiTab-root");
      const activeTab = tabElements[tabValue] as HTMLElement | undefined;
      if (!activeTab) return;
      const left = activeTab.offsetLeft;
      const width = activeTab.offsetWidth;
      setIndicatorLeft(left);
      setIndicatorWidth(width);
    };
    // Measure after layout
    measure();
    // Also re-measure on next frame for safety in case of font/layout shifts
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [tabValue, tabConfig]);

  const handleTabChange = (_: unknown, newValue: number) => {
    setTabValue(newValue);
    const newTab = tabConfig?.[newValue];

    if (newTab) {
      // Parent callback
      if (onTabChange) {
        onTabChange(newValue);
      }
    }
  };

  const content = (
    <Box
      className={className}
      sx={{
        display: "flex",
        position: "relative",
        borderRadius: "3rem",
        ...style,
      }}
    >
      {/* Animated pill indicator */}
      <Box
        sx={{
          position: "absolute",
          top: "4px",
          height: "32px",
          backgroundColor: palette.primary.light,
          borderRadius: "20px",
          zIndex: 0,
          left: `${indicatorLeft}px`,
          width: `${indicatorWidth}px`,
          transition:
            "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "left, width",
        }}
      />

      <Tabs
        ref={tabsRef}
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tabs"
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "auto",
          "& .MuiTabs-flexContainer": {
            minHeight: "auto",
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTabs-scroller": {
            "& .MuiTabs-flexContainer": {
              gap: 0,
            },
          },
          "& .MuiTab-root": {
            transition: "0.2s color",
            textTransform: "none",
            fontWeight: 500,
            color: palette.text.primary,
            fontSize: "0.9rem",
            minHeight: "40px",
            height: "40px",
            padding: "8px 16px",
            borderRadius: "20px",
            backgroundColor: "transparent",
            margin: "0 4px",
            "& .MuiTouchRipple-root": {
              display: "none",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-selected": {
              fontWeight: 500,
              color: palette.primary.main,
              backgroundColor: "transparent",
            },
          },
        }}
      >
        {tabConfig?.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            id={`tab-${tab.key}`}
            aria-controls={`tabpanel-${tab.key}`}
          />
        ))}
      </Tabs>
    </Box>
  );

  if (backdrop) {
    return (
      <Box
        sx={{
          p: "0.1rem",
          borderRadius: "9999px",
          backgroundColor: alpha(palette.primary.light, 0.2),
          backdropFilter: "blur(4px)",
          width: "fit-content",
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

TabSelector.displayName = "TabSelector";
