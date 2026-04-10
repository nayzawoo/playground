import React, { useRef, useMemo, useCallback } from "react";
import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useNotesStore } from "../stores/useNotesStore";

/* ── Styled Components ── */

const Root = styled(Box)({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  minHeight: 0,
});

const TabBar = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  backgroundColor: "rgba(255,255,255,0.02)",
});

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

const CloseButton = styled(IconButton)({
  padding: 2,
  fontSize: 14,
  color: "#9e9e9e",
  "&:hover": { color: "#e0e0e0" },
});

const NewTabButton = styled(IconButton)({
  marginLeft: 8,
  marginRight: 8,
  color: "#9e9e9e",
  "&:hover": { color: "#7c4dff" },
});

const EditorWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  display: "flex",
  overflow: "hidden",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
  },
}));

const EditorContainer = styled(Box)({
  display: "flex",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 4,
  overflow: "hidden",
  width: "100%",
});

const LineNumbers = styled(Box)({
  padding: "16.5px 12px",
  backgroundColor: "rgba(255,255,255,0.02)",
  borderRight: "1px solid rgba(255,255,255,0.06)",
  fontFamily: "'Menlo', 'Consolas', 'Monaco', monospace",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#757575",
  textAlign: "right",
  userSelect: "none",
  overflow: "hidden",
  minWidth: 48,
});

const Textarea = styled("textarea")({
  flex: 1,
  background: "transparent",
  color: "#e0e0e0",
  border: "none",
  outline: "none",
  resize: "none",
  padding: "16.5px 14px",
  fontFamily: "'Menlo', 'Consolas', 'Monaco', monospace",
  fontSize: 14,
  lineHeight: 1.6,
  minHeight: 400,
  width: "100%",
});

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
  } = useNotesStore();

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

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
    closeTab(tabId);
  };

  const handleTitleDoubleClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;
    const newTitle = prompt("Rename tab", tab.title);
    if (newTitle && newTitle.trim()) {
      renameTab(tabId, newTitle.trim());
    }
  };

  return (
    <Root>
      <TabBar>
        <StyledTabs
          value={activeId}
          onChange={(_: any, v: string) => setActiveTab(v)}
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
    </Root>
  );
}
