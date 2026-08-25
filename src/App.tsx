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
import { alpha, styled, ThemeProvider } from "@mui/material/styles";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router";
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
import theme, { tokens } from "./theme";

/* ── Constants ── */

const { railWidth: RAIL_WIDTH, bottomNavHeight: BOTTOM_NAV_HEIGHT } =
  tokens.layout;

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

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100dvh",
  backgroundColor: theme.palette.background.default,
  backgroundImage: tokens.gradient.shell,
}));

const BrandTitle = styled(Typography)({
  fontWeight: 700,
  letterSpacing: -0.3,
  background: tokens.gradient.brand,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const SidebarDivider = styled(Divider)({
  borderColor: alpha("#ffffff", 0.06),
});

const NavList = styled(List)({
  marginTop: 6,
  paddingLeft: 8,
  paddingRight: 8,
});

const drawerPaperBase = {
  bgcolor: "background.paper",
  borderRight: tokens.border.subtle,
} as const;

const GlassAppBar = styled(AppBar)({
  backgroundColor: tokens.glass.appBar,
  backdropFilter: tokens.glass.blur,
  WebkitBackdropFilter: tokens.glass.blur,
  borderBottom: tokens.border.subtle,
  backgroundImage: "none",
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
  borderTop: tokens.border.subtle,
  backgroundColor: tokens.glass.bottomBar,
  backdropFilter: tokens.glass.blur,
  WebkitBackdropFilter: tokens.glass.blur,
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
}));

const PageTitle = styled(Typography)({
  fontWeight: 600,
  letterSpacing: 0.2,
});

/** Shared appearance for nav entries in both the desktop rail and the drawer. */
const navItemSx = (isSelected: boolean) => ({
  borderRadius: 2,
  color: isSelected ? "primary.main" : "text.secondary",
  bgcolor: isSelected ? alpha(tokens.accent.violet, 0.14) : "transparent",
  "&:hover": {
    bgcolor: isSelected
      ? alpha(tokens.accent.violet, 0.2)
      : alpha("#ffffff", 0.04),
  },
  "&:active": { transform: "scale(0.97)" },
  transition: "background-color 0.18s ease, transform 0.18s ease",
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
                ...navItemSx(isSelected),
                minHeight: 46,
                justifyContent: "initial",
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: 14,
                    },
                  },
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
                      ...navItemSx(isSelected),
                      minHeight: 56,
                      px: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: "inherit",
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
                sx={{ mr: 1, color: "text.secondary" }}
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
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: "primary.light",
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
    <ThemeProvider theme={theme} defaultMode="dark" noSsr>
      <CssBaseline />
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </ThemeProvider>
  );
}
