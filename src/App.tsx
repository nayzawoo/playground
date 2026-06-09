import { useState, useCallback } from "react";
import PWABadge from "./PWABadge.tsx";
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
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
import BookIcon from "@mui/icons-material/Book";
import QrCodeIcon from "@mui/icons-material/QrCode";

import Dashboard from "./pages/Dashboard";
import ZawgyiUnicodeConverter from "./pages/ZawgyiUnicodeConverter";
import Notes from "./pages/Notes";
import Dhamma from "./pages/Dhamma";
import QRCodePage from "./pages/QRCode";
import SwipeSidebar from "./components/SwipeSidebar";
import { useBackButton } from "./hooks/useBackButton";

/* ── Constants ── */

const RAIL_WIDTH = 96;
const BOTTOM_NAV_HEIGHT = 74;
const BORDER = "1px solid rgba(255,255,255,0.06)";

/* ── Theme ── */

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c4dff", light: "#b39ddb", dark: "#5e35b1" },
    secondary: { main: "#448aff" },
    background: { default: "#0f1117", paper: "#161923" },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Roboto', 'Inter', sans-serif",
    button: { textTransform: "none" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { margin: 0 },
        "#root": {
          maxWidth: "none",
          margin: 0,
          padding: 0,
          textAlign: "left",
          minHeight: "100dvh",
          width: "100%",
        },
      },
    },
  },
});

/* ── Menu Config ── */

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Notes", icon: <NoteIcon />, path: "/notes" },
  { text: "Dhamma", icon: <BookIcon />, path: "/dhamma" },
  { text: "QR", icon: <QrCodeIcon />, path: "/qr" },
  {
    text: "ZG-Uni",
    icon: <SwapHorizIcon />,
    path: "/zawgyi-unicode-converter",
  },
];

/* ── Styled Components ── */

const LayoutRoot = styled(Box)({
  display: "flex",
  minHeight: "100dvh",
  background:
    "radial-gradient(circle at 5% 0%, rgba(124,77,255,0.12), transparent 34%), #0f1117",
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
  marginTop: 6,
  paddingLeft: 8,
  paddingRight: 8,
});

const drawerPaperBase = {
  bgcolor: "background.paper",
  borderRight: BORDER,
} as const;

const GlassAppBar = styled(AppBar)({
  backgroundColor: "rgba(15, 17, 23, 0.72)",
  backdropFilter: "blur(14px)",
  borderBottom: BORDER,
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: "100%",
  },
}));

const RouteViewport = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  paddingBottom: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
  [theme.breakpoints.up("md")]: {
    paddingBottom: 0,
  },
}));

const MobileBottomBar = styled(Paper)(({ theme }) => ({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: theme.zIndex.appBar,
  borderTop: BORDER,
  backgroundColor: "rgba(22, 25, 35, 0.95)",
  backdropFilter: "blur(12px)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
}));

const PageTitle = styled(Typography)({
  fontWeight: 600,
  letterSpacing: 0.2,
});

/* ── Layout ── */

function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentItem =
    menuItems.find((item) => item.path === currentPath) || menuItems[0];

  const handleNavClick = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate],
  );

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  // Android back button closes sidebar instead of exiting PWA
  useBackButton(open && isMobile, closeSidebar);

  const sidebarNavItems = (
    <NavList sx={{ p: 0, m: 0 }}>
      {menuItems.map((item) => {
        const isSelected = currentPath === item.path;
        return (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavClick(item.path)}
              sx={{
                borderRadius: 2,
                minHeight: 46,
                justifyContent: "initial",
                px: 2,
                bgcolor: isSelected ? "rgba(124,77,255,0.12)" : "transparent",
                color: isSelected ? "primary.main" : "grey.400",
                "&:hover": {
                  bgcolor: isSelected
                    ? "rgba(124,77,255,0.18)"
                    : "rgba(255,255,255,0.04)",
                },
                "&:active": { transform: "scale(0.96)" },
                transition: "all 0.2s cubic-bezier(0.32, 2, 0.55, 0.27)",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: "center",
                  color: isSelected ? "primary.main" : "grey.500",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: 14,
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </NavList>
  );

  return (
    <LayoutRoot>
      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: RAIL_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: RAIL_WIDTH,
              overflowX: "hidden",
              ...drawerPaperBase,
            },
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BrandTitle variant="subtitle1">Tools</BrandTitle>
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
                      minHeight: 56,
                      px: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      bgcolor: isSelected
                        ? "rgba(124,77,255,0.16)"
                        : "transparent",
                      color: isSelected ? "primary.main" : "grey.400",
                      "&:hover": {
                        bgcolor: isSelected
                          ? "rgba(124,77,255,0.24)"
                          : "rgba(255,255,255,0.04)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isSelected ? "primary.main" : "grey.500",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <Typography sx={{ fontSize: 11, lineHeight: 1.1 }}>
                      {item.text}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </NavList>
        </Drawer>
      )}

      {isMobile && (
        <SwipeSidebar
          open={open}
          onOpen={openSidebar}
          onClose={closeSidebar}
          enabled={isMobile}
        >
          {sidebarNavItems}
        </SwipeSidebar>
      )}

      <MainContent>
        <GlassAppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: 62 }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={openSidebar}
                sx={{ mr: 1, color: "grey.400" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <PageTitle variant="h6" sx={{ fontSize: isMobile ? 18 : 20 }}>
              {currentItem.text}
            </PageTitle>
          </Toolbar>
        </GlassAppBar>

        <RouteViewport>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/zawgyi-unicode-converter"
              element={<ZawgyiUnicodeConverter />}
            />
            <Route path="/notes" element={<Notes />} />
            <Route path="/dhamma" element={<Dhamma />} />
            <Route path="/qr" element={<QRCodePage />} />
          </Routes>
        </RouteViewport>

        {isMobile && (
          <MobileBottomBar square elevation={0}>
            <BottomNavigation
              showLabels
              value={currentItem.path}
              onChange={(_, value: string) => handleNavClick(value)}
              sx={{
                height: BOTTOM_NAV_HEIGHT,
                backgroundColor: "transparent",
              }}
            >
              {menuItems.map((item) => (
                <BottomNavigationAction
                  key={item.path}
                  value={item.path}
                  label={item.text}
                  icon={item.icon}
                  sx={{
                    minWidth: 62,
                    color: "#a8a8a8",
                    "&.Mui-selected": {
                      color: "#b39ddb",
                    },
                  }}
                />
              ))}
            </BottomNavigation>
          </MobileBottomBar>
        )}

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
