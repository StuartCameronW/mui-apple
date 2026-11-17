import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Menu,
  MenuItem,
  LinearProgress,
  Select,
  Switch,
  Typography,
  useAppleTheme,
  Chip,
  TabSelector,
  FormControl,
  InputLabel,
  Autocomplete,
} from "mui-apple";

export default function Home() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [minimalValue, setMinimalValue] = useState("a");
  const [outlinedValue, setOutlinedValue] = useState("one");
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState<string | null>(null);
  const open = Boolean(anchor);
  const fruitOptions = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
  const { mode, setMode } = useAppleTheme();
  const isDark = mode === "dark";

  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        mui-apple example
      </Typography>

      {/* Theme toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Typography variant="body2">Dark</Typography>
        <Switch
          checked={isDark}
          onChange={() => setMode(isDark ? "light" : "dark")}
        />
      </Box>

      {/* Select minimal */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Select (minimal)
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3, alignItems: "center" }}>

          <Select
            labelId="minimal-label"
            variant="minimal"
            size="small"
            value={minimalValue}
            onChange={(e) => setMinimalValue(String(e.target.value))}
          >
            <MenuItem value="a">Option A</MenuItem>
            <MenuItem value="b">Option B</MenuItem>
            <MenuItem value="c">Option C</MenuItem>
          </Select>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="outlined-label">Outlined</InputLabel>
          <Select
            labelId="outlined-label"
            label="Outlined"
            variant="outlined"
            size="small"
            value={outlinedValue}
            onChange={(e) => setOutlinedValue(String(e.target.value))}
          >
            <MenuItem value="one">One</MenuItem>
            <MenuItem value="two">Two</MenuItem>
            <MenuItem value="three">Three</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Select minimal full-width */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Select (minimal, full width)
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Select
          variant="minimal"
          fullWidth
          value={minimalValue}
          onChange={(e) => setMinimalValue(String(e.target.value))}
        >
          <MenuItem value="a">Option A</MenuItem>
          <MenuItem value="b">Option B</MenuItem>
          <MenuItem value="c">Option C</MenuItem>
        </Select>
      </Box>

      {/* Buttons + Menu */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Buttons & Menu
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button variant="contained" onClick={(e) => setAnchor(e.currentTarget)}>
          Open menu
        </Button>
        <Menu
          open={open}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={() => setAnchor(null)}>Item one</MenuItem>
          <MenuItem onClick={() => setAnchor(null)}>Item two</MenuItem>
          <MenuItem onClick={() => setAnchor(null)}>Item three</MenuItem>
        </Menu>
        <Chip size="small" label="Chip" />
      </Box>

      {/* TabSelector */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        TabSelector
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TabSelector
          tabConfig={[
            { key: "tab1", label: "Tab one" },
            { key: "tab2", label: "Tab two" },
            { key: "tab3", label: "Tab three" },
          ]}
          initialIndex={tabIndex}
          onTabChange={setTabIndex}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected index: {tabIndex}
        </Typography>
      </Box>

      {/* Autocomplete (dropdown uses same subtle shadow as Menu) */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Autocomplete
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          size="small"
          options={fruitOptions}
          value={autocompleteValue}
          onChange={(_, v) => setAutocompleteValue(v)}
          renderInput={(params) => (
            <TextField {...params} label="Fruit" placeholder="Choose a fruit" />
          )}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {/* TextField */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        TextField
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField label="Label" placeholder="Placeholder" fullWidth size="small" />
      </Box>

      {/* LinearProgress */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        LinearProgress
      </Typography>
      <Box sx={{ mb: 3 }}>
        <LinearProgress variant="determinate" value={60} sx={{ mb: 1 }} />
        <LinearProgress variant="indeterminate" />
      </Box>

      {/* Card */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Card
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <CardTitle title="Card title" subtitle="Optional subtitle" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Card content with CardTitle. Menu has a 1px divider border.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => setDialogOpen(true)}
          >
            Open dialog
          </Button>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Example dialog</DialogTitle>
        <DialogContent>
          <Typography>Dialog content for testing.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
