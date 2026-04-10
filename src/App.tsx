import { useState } from "react";
import PWABadge from "./PWABadge.tsx";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import NoteIcon from "@mui/icons-material/Note";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import BookIcon from "@mui/icons-material/Book";

import Dashboard from "./pages/Dashboard";
import ZawgyiUnicodeConverter from "./pages/ZawgyiUnicodeConverter";
import Notes from "./pages/Notes";
import Dhamma from "./pages/Dhamma";

/* ── Constants ── */

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;
const BORDER = "1px solid rgba(255,255,255,0.06)";

/* ── Theme ── */

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c4dff" },
    background: { default: "#0f1117", paper: "#161923" },
  },
  typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
  shape: { borderRadius: 12 },
});

/* ── Menu Config ── */

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Notes", icon: <NoteIcon />, path: "/notes" },
  { text: "Dhamma", icon: <BookIcon />, path: "/dhamma" },
  {
    text: "ZG-Uni",
    icon: <SwapHorizIcon />,
    path: "/zawgyi-unicode-converter",
  },
];

/* ── Styled Components ── */

const LayoutRoot = styled(Box)({
  display: "flex",
  minHeight: "100vh",
});

const BrandTitle = styled(Typography)({
  fontWeight: 700,
  background: "linear-gradient(90deg, #7c4dff, #448aff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const SidebarDivider = styled(Divider)({
  borderColor: "rgba(255,255,255,0.06)",
});

const NavList = styled(List)({
  marginTop: 8,
  paddingLeft: 8,
  paddingRight: 8,
});

const drawerPaperBase = {
  bgcolor: "background.paper",
  borderRight: BORDER,
} as const;

const GlassAppBar = styled(AppBar)({
  backgroundColor: "rgba(15, 17, 23, 0.8)",
  backdropFilter: "blur(12px)",
  borderBottom: BORDER,
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: { width: "100%" },
}));

const PageTitle = styled(Typography)({
  fontWeight: 600,
});

/* ── Layout ── */

function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentItem =
    menuItems.find((item) => item.path === currentPath) || menuItems[0];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) setOpen(false);
  };

  const showLabel = open || isMobile;

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: open ? 2 : 1,
        }}
      >
        {open && (
          <BrandTitle variant="h6" noWrap>
            Tools
          </BrandTitle>
        )}
        <IconButton onClick={() => setOpen(!open)} sx={{ color: "grey.400" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <SidebarDivider />

      <NavList>
        {menuItems.map((item) => {
          const isSelected = currentPath === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: showLabel ? "initial" : "center",
                  px: 2,
                  bgcolor: isSelected ? "rgba(124,77,255,0.12)" : "transparent",
                  color: isSelected ? "primary.main" : "grey.400",
                  "&:hover": {
                    bgcolor: isSelected
                      ? "rgba(124,77,255,0.18)"
                      : "rgba(255,255,255,0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: showLabel ? 2 : "auto",
                    justifyContent: "center",
                    color: isSelected ? "primary.main" : "grey.500",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {showLabel && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: 14,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </NavList>
    </>
  );

  return (
    <LayoutRoot>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, ...drawerPaperBase },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            flexShrink: 0,
            transition: "width 0.3s",
            "& .MuiDrawer-paper": {
              width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
              overflowX: "hidden",
              transition: "width 0.3s",
              ...drawerPaperBase,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <MainContent>
        <GlassAppBar position="sticky" elevation={0}>
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setOpen(true)}
                sx={{ mr: 1, color: "grey.400" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <PageTitle variant="h6">{currentItem.text}</PageTitle>
          </Toolbar>
        </GlassAppBar>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/zawgyi-unicode-converter"
            element={<ZawgyiUnicodeConverter />}
          />
          <Route path="/notes" element={<Notes />} />
          <Route path="/dhamma" element={<Dhamma />} />
        </Routes>
        <PWABadge />
      </MainContent>
    </LayoutRoot>
  );
}

/* ── App Entry ── */

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </ThemeProvider>
  );
}
