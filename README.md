# Apple UI Theme

A comprehensive Apple-inspired theme for Material-UI React applications, featuring authentic Apple design system colors, typography, and component styling.

## Features

- 🎨 Complete Apple Design System color palette
- 🔧 Pre-configured Material-UI theme with Apple styling
- 🌓 Built-in dark/light mode support
- 📱 Apple-style component overrides (buttons, inputs, cards, etc.)
- 🎯 TypeScript support with full type definitions
- 🧩 Modular exports for flexible usage

## Installation

```bash
npm install @stuartwisskirchen/apple-ui-theme
# or
yarn add @stuartwisskirchen/apple-ui-theme
# or
pnpm add @stuartwisskirchen/apple-ui-theme
```

## Quick Start

```tsx
import React from 'react';
import { CustomThemeProvider, Button } from '@stuartwisskirchen/apple-ui-theme';

function App() {
  return (
    <CustomThemeProvider>
      <Button variant="contained">
        Hello Apple UI!
      </Button>
    </CustomThemeProvider>
  );
}

export default App;
```

## Usage

### Theme Provider

Wrap your app with the `CustomThemeProvider` to enable Apple styling and theme switching:

```tsx
import { CustomThemeProvider, useTheme } from '@stuartwisskirchen/apple-ui-theme';

function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <ThemeToggle />
      {/* Your app content */}
    </CustomThemeProvider>
  );
}
```

### Using Colors Directly

```tsx
import { colors, getColor } from '@stuartwisskirchen/apple-ui-theme';

// Direct color access
const blueColor = colors.primary[500]; // Apple Blue #007AFF

// Helper function
const greenColor = getColor('success', 400); // Light Apple Green
const defaultGreen = getColor('success'); // Default (500) Apple Green
```

### Custom Material-UI Theme

```tsx
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '@stuartwisskirchen/apple-ui-theme';

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Importing Components

Instead of importing from `@mui/material`, import all components directly from the apple-ui-theme package:

```tsx
// ❌ Don't import from MUI directly
import { Button, TextField, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ✅ Import everything from apple-ui-theme
import { Button, TextField, Box, useMuiTheme } from '@stuartwisskirchen/apple-ui-theme';

function MyComponent() {
  const theme = useMuiTheme();
  
  return (
    <Box sx={{ p: 2 }}>
      <TextField label="Name" />
      <Button variant="contained">Submit</Button>
    </Box>
  );
}
```

### Available Exports

All Material-UI components and utilities are re-exported:
- All MUI components (`Button`, `TextField`, `Box`, `Typography`, etc.)
- All MUI icons via `Icons` namespace: `import { Icons } from '@stuartwisskirchen/apple-ui-theme'`
- Theme utilities: `useMuiTheme`, `alpha`, `styled`
- Custom theme components: `useTheme`, `CustomThemeProvider`

### Workspace Setup

For monorepos, add to your `pnpm-workspace.yaml`:

```yaml
packages:
  - 'your-app'
  - 'apple-ui-theme'
```

Then reference in package.json:
```json
{
  "dependencies": {
    "@stuartwisskirchen/apple-ui-theme": "workspace:*"
  }
}
```

## API Reference

### Colors

The theme includes the complete Apple Design System color palette:

- `primary` - Apple Blue variants (50-900)
- `secondary` - Apple Gray variants (50-900) 
- `success` - Apple Green variants (50-900)
- `warning` - Apple Orange variants (50-900)
- `error` - Apple Red variants (50-900)
- `gray` - Neutral gray variants (50-900)
- `background` - Default background colors

### Components

All Material-UI components are styled with Apple design principles:

- **Buttons**: Flat design, no shadows, subtle hover effects
- **Text Fields**: Rounded corners, clean borders, focused states
- **Cards/Papers**: Subtle shadows, rounded corners
- **Tables**: Clean borders, alternating row colors
- **Switches**: Apple-style toggle switches
- **Typography**: SF Pro font family with Apple spacing

### Theme Context

- `useTheme()` - Hook to access theme mode and toggle function
- `ThemeContextType` - TypeScript interface for theme context

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Stuart Wisskirchen