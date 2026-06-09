import { type ReactNode } from "react";
import { Box, Button, Typography, Divider, SwipeableDrawer } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import SyncIcon from "@mui/icons-material/Sync";
import SaveIcon from "@mui/icons-material/Save";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNotesStore, type SyncStatus } from "../stores/useNotesStore";

/* ── Constants ── */

const SIDEBAR_WIDTH = 280;
const GLASS_BORDER = "1px solid rgba(255,255,255,0.12)";
const GLASS_BLUR = "blur(30px)";

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
  background: "linear-gradient(135deg, #b388ff, #7c4dff, #448aff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const GlassDivider = styled(Divider)({
  borderColor: "rgba(255,255,255,0.08)",
  marginLeft: 16,
  marginRight: 16,
});

const SidebarSection = styled(Box)({
  padding: "12px 16px",
});

const SectionLabel = styled(Typography)({
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  color: "rgba(255,255,255,0.3)",
  marginBottom: 8,
});

const SidebarButton = styled(Button)({
  justifyContent: "flex-start",
  gap: 10,
  height: 46,
  paddingLeft: 14,
  paddingRight: 14,
  color: "rgba(255,255,255,0.8)",
  borderColor: "rgba(255,255,255,0.08)",
  backgroundColor: "rgba(255,255,255,0.04)",
  "&:active": { transform: "scale(0.98)" },
});

const StatusRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
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

function syncInfo(status: SyncStatus, error: string | null) {
  switch (status) {
    case "synced":
      return { label: "Synced to Cloud", color: "#4caf50", icon: <CloudDoneIcon sx={{ fontSize: 16, color: "#4caf50" }} /> };
    case "syncing":
      return { label: "Syncing…", color: "#7c4dff", icon: <SyncIcon sx={{ fontSize: 16, color: "#7c4dff", animation: `${pulseGlow} 1.2s ease-in-out infinite` }} /> };
    case "saved-locally":
      return { label: "Saved Locally", color: "#ff9800", icon: <SaveIcon sx={{ fontSize: 16, color: "#ff9800" }} /> };
    case "offline":
      return { label: "Offline Mode", color: "#78909c", icon: <CloudOffIcon sx={{ fontSize: 16, color: "#78909c" }} /> };
    case "error":
      return { label: error || "Sync Error", color: "#ef5350", icon: <ErrorOutlineIcon sx={{ fontSize: 16, color: "#ef5350" }} /> };
    default:
      return { label: "Ready", color: "#78909c", icon: <CloudDoneIcon sx={{ fontSize: 16, color: "#78909c" }} /> };
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
  const sInfo = syncInfo(syncStatus, syncError);

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableDiscovery={false}
      disableSwipeToOpen={!enabled}
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          backgroundColor: "rgba(18, 18, 28, 0.88)",
          backdropFilter: GLASS_BLUR,
          WebkitBackdropFilter: GLASS_BLUR,
          borderRight: GLASS_BORDER,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          boxSizing: "border-box",
        }
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
          {sInfo.icon}
          <StatusDot color={sInfo.color} />
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              flex: 1,
            }}
          >
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
            startIcon={<NoteAddIcon sx={{ fontSize: 18, color: "#b388ff" }} />}
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
            <SettingsIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.45)" }} />
          }
        >
          Settings
        </SidebarButton>
      </SidebarSection>
    </SwipeableDrawer>
  );
}

export { SIDEBAR_WIDTH };
