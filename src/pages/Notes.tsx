import React, { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import SaveIcon from "@mui/icons-material/Save";
import ErrorIcon from "@mui/icons-material/Error";
import SyncIcon from "@mui/icons-material/Sync";
import { useNotesStore, type SyncStatus } from "../stores/useNotesStore";

/* ── Styled Components ── */

const Root = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  minHeight: 0,
});

const TabBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.common.white, 0.02),
}));

const StyledTabs = styled(Tabs)({
  minHeight: 40,
  flex: 1,
  "& .MuiTab-root": {
    minHeight: 40,
    textTransform: "none",
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 0,
    paddingBottom: 0,
  },
  "& .MuiTabs-indicator": {
    height: 2,
  },
});

const TabLabel = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 4,
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: 2,
  fontSize: 14,
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.text.primary },
}));

const NewTabButton = styled(IconButton)(({ theme }) => ({
  marginLeft: 8,
  marginRight: 8,
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.primary.main },
}));

const SyncBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.common.white, 0.02),
  flexWrap: "wrap",
}));

function syncChipProps(status: SyncStatus, error: string | null) {
  switch (status) {
    case "synced":
      return { label: "Synced to Cloud", color: "success" as const, icon: <CloudDoneIcon /> };
    case "syncing":
      return { label: "Syncing…", color: "info" as const, icon: <SyncIcon /> };
    case "saved-locally":
      return { label: "Saved Locally", color: "warning" as const, icon: <SaveIcon /> };
    case "offline":
      return { label: "Offline Mode", color: "default" as const, icon: <CloudOffIcon /> };
    case "error":
      return { label: error || "Sync Error", color: "error" as const, icon: <ErrorIcon /> };
    default:
      return { label: "Ready", color: "default" as const, icon: <CloudUploadIcon /> };
  }
}

const EditorWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  display: "flex",
  overflow: "hidden",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
  },
}));

const EditorContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  width: "100%",
}));

const LineNumbers = styled(Box)(({ theme }) => ({
  padding: "16.5px 12px",
  backgroundColor: alpha(theme.palette.common.white, 0.02),
  borderRight: `1px solid ${theme.palette.divider}`,
  fontFamily: "'Menlo', 'Consolas', 'Monaco', monospace",
  fontSize: 14,
  lineHeight: 1.6,
  color: theme.palette.text.disabled,
  textAlign: "right",
  userSelect: "none",
  overflow: "hidden",
  minWidth: 48,
}));

const Textarea = styled("textarea")(({ theme }) => ({
  flex: 1,
  background: "transparent",
  color: theme.palette.text.primary,
  border: "none",
  outline: "none",
  resize: "none",
  padding: "16.5px 14px",
  fontFamily: "'Menlo', 'Consolas', 'Monaco', monospace",
  fontSize: 14,
  lineHeight: 1.6,
  minHeight: 400,
  width: "100%",
}));

/* ── Component ── */

export default function Notes() {
  const {
    tabs,
    activeId,
    addTab,
    closeTab,
    setActiveTab,
    updateContent,
    renameTab,
    password,
    setPassword,
    syncStatus,
    syncError,
    syncToCloud,
    forceFetchFromCloud,
    fetchFromCloud,
  } = useNotesStore();

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  const [closeTabId, setCloseTabId] = useState<string | null>(null);
  const [renameTabId, setRenameTabId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  // Fetch from cloud on initial mount (only overwrite if remote is newer)
  useEffect(() => {
    fetchFromCloud();
  }, [fetchFromCloud]);

  // Listen for online/offline events
  useEffect(() => {
    const setOnline = () => useNotesStore.getState().setSyncStatus("saved-locally");
    const setOffline = () => useNotesStore.getState().setSyncStatus("offline");
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  const lineNumbers = useMemo(() => {
    const content = activeTab?.content || "";
    const count = Math.max(content.split("\n").length, 15);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [activeTab?.content]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    setCloseTabId(tabId);
  };

  const confirmCloseTab = () => {
    if (closeTabId) closeTab(closeTabId);
    setCloseTabId(null);
  };

  const handleTitleDoubleClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;
    setRenameTabId(tabId);
    setRenameValue(tab.title);
  };

  const confirmRenameTab = () => {
    if (renameTabId && renameValue.trim()) {
      renameTab(renameTabId, renameValue.trim());
    }
    setRenameTabId(null);
    setRenameValue("");
  };

  return (
    <Root>
      <TabBar>
        <StyledTabs
          value={activeId}
          onChange={(_: React.SyntheticEvent, v: string) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab) => (
            <Tab
              component="div"
              key={tab.id}
              value={tab.id}
              onDoubleClick={() => handleTitleDoubleClick(tab.id)}
              label={
                <TabLabel>
                  <span>{tab.title}</span>
                  <CloseButton
                    size="small"
                    onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
                      handleCloseTab(e, tab.id)
                    }
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </CloseButton>
                </TabLabel>
              }
            />
          ))}
        </StyledTabs>
        <Tooltip title="New tab">
          <NewTabButton size="small" onClick={addTab}>
            <AddIcon fontSize="small" />
          </NewTabButton>
        </Tooltip>
      </TabBar>

      <SyncBar>
        <TextField
          size="small"
          type="password"
          placeholder="Sync password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            width: 150,
            "& .MuiInputBase-root": { height: 32, fontSize: 13 },
          }}
        />
        <Button
          size="small"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={syncToCloud}
          disabled={syncStatus === "syncing" || !password}
          sx={{ textTransform: "none", height: 32, fontSize: 13 }}
        >
          Push
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CloudDownloadIcon />}
          onClick={forceFetchFromCloud}
          disabled={syncStatus === "syncing"}
          sx={{ textTransform: "none", height: 32, fontSize: 13 }}
        >
          Pull
        </Button>
        <Chip
          size="small"
          {...syncChipProps(syncStatus, syncError)}
          sx={{ fontSize: 12 }}
        />
      </SyncBar>

      <EditorWrapper>
        <EditorContainer>
          <LineNumbers ref={lineNumRef}>
            {lineNumbers.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </LineNumbers>
          <Textarea
            ref={textareaRef}
            value={activeTab?.content || ""}
            onChange={(e: { target: { value: string } }) =>
              updateContent(activeId, e.target.value)
            }
            onScroll={handleScroll}
            placeholder="Start typing..."
          />
        </EditorContainer>
      </EditorWrapper>

      <Dialog open={closeTabId !== null} onClose={() => setCloseTabId(null)}>
        <DialogTitle>Close tab?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unsaved changes in this tab will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseTabId(null)}>Cancel</Button>
          <Button onClick={confirmCloseTab} color="error" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={renameTabId !== null}
        onClose={() => setRenameTabId(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename tab</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Tab name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmRenameTab();
            }}
            size="medium"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameTabId(null)}>Cancel</Button>
          <Button
            onClick={confirmRenameTab}
            variant="contained"
            disabled={!renameValue.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
}
