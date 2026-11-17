import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Box, Typography } from "mui-apple";
import Home from "./pages/Home";
import SelectTest from "./pages/SelectTest";
import Inputs from "./pages/Inputs";

function App() {
  const location = useLocation();

  return (
    <Box>
      <Box
        component="nav"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 4,
          py: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography
          component={Link}
          to="/"
          variant="body2"
          sx={{
            color: location.pathname === "/" ? "primary.main" : "text.secondary",
            textDecoration: "none",
            fontWeight: location.pathname === "/" ? 600 : 400,
            "&:hover": { color: "primary.main" },
          }}
        >
          Home
        </Typography>
        <Typography
          component={Link}
          to="/select-test"
          variant="body2"
          sx={{
            color: location.pathname === "/select-test" ? "primary.main" : "text.secondary",
            textDecoration: "none",
            fontWeight: location.pathname === "/select-test" ? 600 : 400,
            "&:hover": { color: "primary.main" },
          }}
        >
          Select test
        </Typography>
        <Typography
          component={Link}
          to="/inputs"
          variant="body2"
          sx={{
            color: location.pathname === "/inputs" ? "primary.main" : "text.secondary",
            textDecoration: "none",
            fontWeight: location.pathname === "/inputs" ? 600 : 400,
            "&:hover": { color: "primary.main" },
          }}
        >
          Inputs
        </Typography>
      </Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-test" element={<SelectTest />} />
        <Route path="/inputs" element={<Inputs />} />
      </Routes>
    </Box>
  );
}

export default App;
