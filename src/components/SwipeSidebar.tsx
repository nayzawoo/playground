import { type ReactNode } from "react";
import { Box, Button, Typography, Divider, SwipeableDrawer } from "@mui/material";
import {
  alpha,
  styled,
  keyframes,
  useTheme,
  type Theme,
} from "@mui/material/styles";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import SyncIcon from "@mui/icons-material/Sync";
import SaveIcon from "@mui/icons-material/Save";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNotesStore, type SyncStatus } from "../stores/useNotesStore";
import { tokens } from "../theme";

/* ── Constants ── */

const SIDEBAR_WIDTH = tokens.layout.sidebarWidth;

/* ── Keyframes ── */

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

/* ── Styled ── */

const SidebarHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 18px 12px",
});

const BrandText = styled(Typography)({
  fontWeight: 700,
  fontSize: 20,
  letterSpacing: -0.5,
  background: tokens.gradient.brand,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const GlassDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.divider,
  marginLeft: 16,
  marginRight: 16,
}));

const SidebarSection = styled(Box)({
  padding: "12px 16px",
});

const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  color: theme.palette.text.disabled,
  marginBottom: 8,
}));

const SidebarButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  gap: 10,
  height: 46,
  paddingLeft: 14,
  paddingRight: 14,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  backgroundColor: alpha("#ffffff", 0.04),
  "&:active": { transform: "scale(0.98)" },
}));

const StatusRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 12,
  backgroundColor: alpha("#ffffff", 0.03),
  border: tokens.border.subtle,
});

const StatusDot = styled("span")<{ color: string }>(({ color }) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  boxShadow: `0 0 6px ${color}`,
  flexShrink: 0,
}));

/* ── Helpers ── */

type SyncPalette = Theme["palette"];

function syncInfo(
  status: SyncStatus,
  error: string | null,
  palette: SyncPalette,
) {
  switch (status) {
    case "synced":
      return { label: "Synced to Cloud", color: palette.success.main, Icon: CloudDoneIcon };
    case "syncing":
      return { label: "Syncing…", color: palette.primary.main, Icon: SyncIcon, pulse: true };
    case "saved-locally":
      return { label: "Saved Locally", color: palette.warning.main, Icon: SaveIcon };
    case "offline":
      return { label: "Offline Mode", color: palette.text.disabled, Icon: CloudOffIcon };
    case "error":
      return { label: error || "Sync Error", color: palette.error.main, Icon: ErrorOutlinedIcon };
    default:
      return { label: "Ready", color: palette.text.disabled, Icon: CloudDoneIcon };
  }
}

/* ── Props ── */

interface SwipeSidebarProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode; // navigation items passed from App
  enabled?: boolean;
}

/* ── Component ── */

export default function SwipeSidebar({
  open,
  onOpen,
  onClose,
  children,
  enabled = true,
}: SwipeSidebarProps) {
  const { addTab, syncStatus, syncError } = useNotesStore();
  const { palette } = useTheme();
  const sInfo = syncInfo(syncStatus, syncError, palette);

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableDiscovery={false}
      disableSwipeToOpen={!enabled}
      slotProps={{
        paper: {
          sx: {
            width: SIDEBAR_WIDTH,
            backgroundColor: tokens.glass.sidebar,
            backdropFilter: tokens.glass.blur,
            WebkitBackdropFilter: tokens.glass.blur,
            borderRight: tokens.border.default,
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            boxSizing: "border-box",
          },
        },
      }}
    >
      <SidebarHeader>
        <BrandText>Tools</BrandText>
      </SidebarHeader>

      <GlassDivider />

      {/* Sync Status */}
      <SidebarSection>
        <SectionLabel>Sync Status</SectionLabel>
        <StatusRow>
          <sInfo.Icon
            sx={{
              fontSize: 16,
              color: sInfo.color,
              ...(sInfo.pulse && {
                animation: `${pulseGlow} 1.2s ease-in-out infinite`,
              }),
            }}
          />
          <StatusDot color={sInfo.color} />
          <Typography sx={{ fontSize: 13, color: "text.secondary", flex: 1 }}>
            {sInfo.label}
          </Typography>
        </StatusRow>
      </SidebarSection>

      <GlassDivider />

      {/* Quick Actions */}
      <SidebarSection>
        <SectionLabel>Quick Actions</SectionLabel>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <SidebarButton
            fullWidth
            variant="outlined"
            onClick={() => {
              addTab();
              onClose();
            }}
            startIcon={
              <NoteAddIcon sx={{ fontSize: 18, color: "primary.light" }} />
            }
          >
            New Note
          </SidebarButton>
        </Box>
      </SidebarSection>

      <GlassDivider />

      {/* Navigation (passed from App) */}
      <SidebarSection>
        <SectionLabel>Navigation</SectionLabel>
        {children}
      </SidebarSection>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      <GlassDivider />

      {/* Settings at bottom */}
      <SidebarSection sx={{ pb: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
        <SidebarButton
          fullWidth
          variant="outlined"
          onClick={() => { /* placeholder for settings */ }}
          startIcon={
            <SettingsIcon sx={{ fontSize: 18, color: "text.disabled" }} />
          }
        >
          Settings
        </SidebarButton>
      </SidebarSection>
    </SwipeableDrawer>
  );
}

export { SIDEBAR_WIDTH };
