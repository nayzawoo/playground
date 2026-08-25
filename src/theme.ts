import { createTheme, alpha } from "@mui/material/styles";

/**
 * Shared design tokens for values that aren't palette concepts (gradients,
 * glass surfaces, layout metrics). Palette colors live in the theme itself and
 * should be read through `theme.palette.*` / `theme.vars.palette.*`.
 */
export const tokens = {
  accent: {
    violet: "#8b5cf6",
    sky: "#38bdf8",
  },
  layout: {
    railWidth: 96,
    bottomNavHeight: 74,
    sidebarWidth: 288,
  },
  border: {
    subtle: `1px solid ${alpha("#ffffff", 0.06)}`,
    default: `1px solid ${alpha("#ffffff", 0.1)}`,
    strong: `1px solid ${alpha("#ffffff", 0.16)}`,
  },
  glass: {
    appBar: alpha("#0a0c12", 0.72),
    bottomBar: alpha("#11141d", 0.92),
    sidebar: alpha("#0d1017", 0.88),
    blur: "blur(20px)",
  },
  gradient: {
    brand: "linear-gradient(90deg, #a78bfa, #38bdf8)",
    /** Ambient glow behind the app shell. */
    shell:
      "radial-gradient(1200px 600px at 0% -10%, rgba(139,92,246,0.14), transparent 60%)",
    /** Richer glow for the dashboard hero area. */
    hero: "linear-gradient(140deg, rgba(139,92,246,0.24), rgba(56,189,248,0.14))",
  },
} as const;

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: tokens.accent.violet,
      light: "#a78bfa",
      dark: "#6d28d9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: tokens.accent.sky,
      light: "#7dd3fc",
      dark: "#0284c7",
      contrastText: "#04121c",
    },
    success: { main: "#34d399" },
    warning: { main: "#fbbf24" },
    error: { main: "#f87171" },
    info: { main: "#60a5fa" },
    background: {
      default: "#0a0c12",
      paper: "#11141d",
    },
    text: {
      primary: "#e8eaf2",
      secondary: "#a1a7ba",
      disabled: "#6b7280",
    },
    divider: alpha("#ffffff", 0.08),
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      "'Inter Variable', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif",
    h5: { fontWeight: 700, letterSpacing: -0.4 },
    h6: { fontWeight: 600, letterSpacing: -0.2 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          // Removes the blue flash when tapping controls in the installed PWA.
          WebkitTapHighlightColor: "transparent",
        },
        "#root": {
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100dvh",
          textAlign: "left",
        },
        "*::-webkit-scrollbar": { width: 8, height: 8 },
        "*::-webkit-scrollbar-thumb": {
          borderRadius: 8,
          backgroundColor: alpha("#ffffff", 0.12),
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        // MUI's dark-mode elevation overlay fights the custom surface colors.
        root: { backgroundImage: "none" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default theme;
