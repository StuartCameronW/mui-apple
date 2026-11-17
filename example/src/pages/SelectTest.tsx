import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "mui-apple";

/**
 * Page with only non-minimal Selects (no variant="minimal" on the page).
 * Use this to verify the dropdown chevron stays visible and doesn’t merge into the text.
 */
export default function SelectTest() {
  const [locale, setLocale] = useState("all");
  const [size, setSize] = useState("medium");

  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select test (no minimal)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This page has only standard/outlined Selects. The chevron should be
        clearly visible and not merged into the text.
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        All Locales (outlined, small)
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="locale-label">Locale</InputLabel>
          <Select
            labelId="locale-label"
            label="Locale"
            variant="outlined"
            size="small"
            value={locale}
            onChange={(e) => setLocale(String(e.target.value))}
          >
            <MenuItem value="all">All Locales</MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Size (outlined, default size)
      </Typography>
      <Box>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="size-label">Size</InputLabel>
          <Select
            labelId="size-label"
            label="Size"
            variant="outlined"
            value={size}
            onChange={(e) => setSize(String(e.target.value))}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
