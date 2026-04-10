import { useState } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import NoteIcon from "@mui/icons-material/Note";
import BookIcon from "@mui/icons-material/Book";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

/* ── Styled Components ── */

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  background:
    "radial-gradient(circle at 18% 0%, rgba(124,77,255,0.2), transparent 42%), radial-gradient(circle at 90% 12%, rgba(68,138,255,0.2), transparent 38%)",
  overflowY: "auto",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
    maxWidth: 520,
    margin: "0 auto",
  },
}));

const Title = styled(Typography)({
  fontWeight: 700,
  color: "#e0e0e0",
  marginBottom: 4,
});

const Subtitle = styled(Typography)({
  color: "#9e9e9e",
});

const HeroCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 22,
  padding: theme.spacing(2),
  background: `linear-gradient(140deg, ${alpha("#7c4dff", 0.24)}, ${alpha("#448aff", 0.16)})`,
  border: `1px solid ${alpha("#7c4dff", 0.28)}`,
  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.3)",
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 18,
  padding: theme.spacing(1.2),
  backgroundColor: alpha("#ffffff", 0.03),
  border: `1px solid ${alpha("#ffffff", 0.08)}`,
}));

const QuickAction = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5),
  minHeight: 92,
  backgroundColor: alpha("#ffffff", 0.04),
  border: `1px solid ${alpha("#ffffff", 0.08)}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: alpha("#7c4dff", 0.45),
    backgroundColor: alpha("#7c4dff", 0.1),
  },
}));

/* ── Component ── */

export default function Dashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const qrUrl = `${window.location.origin}${window.location.pathname}#/`;

  const quickActions = [
    {
      label: "Notes",
      icon: <NoteIcon sx={{ fontSize: 20, color: "#b39ddb" }} />,
      hint: "Write quickly",
      path: "/notes",
    },
    {
      label: "Dhamma",
      icon: <BookIcon sx={{ fontSize: 20, color: "#90caf9" }} />,
      hint: "Read anytime",
      path: "/dhamma",
    },
    {
      label: "ZG-Uni",
      icon: <SwapHorizIcon sx={{ fontSize: 20, color: "#80cbc4" }} />,
      hint: "Convert text",
      path: "/zawgyi-unicode-converter",
    },
  ];

  return (
    <Root>
      <HeroCard elevation={0}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.2 }}>
          <Chip size="small" label="Mobile" sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
          <Chip
            size="small"
            label="Offline Ready"
            sx={{ bgcolor: "rgba(124,77,255,0.2)", color: "#e8def8" }}
          />
        </Stack>
        <Title variant="h5">Home</Title>
        <Subtitle variant="body2">
          App-style layout with large touch actions and compact sections.
        </Subtitle>
      </HeroCard>

      <SectionCard elevation={0}>
        <Typography sx={{ px: 1, pb: 1, color: "#cfcfcf", fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {quickActions.map((item) => (
            <Box
              key={item.label}
              component="button"
              onClick={() => navigate(item.path)}
              sx={{
                p: 0,
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <QuickAction>
                {item.icon}
                <Box>
                  <Typography sx={{ color: "#e8e8e8", fontSize: 14, fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ color: "#9e9e9e", fontSize: 12 }}>{item.hint}</Typography>
                </Box>
              </QuickAction>
            </Box>
          ))}
          <QuickAction sx={{ gridColumn: "1 / -1" }}>
            <Typography sx={{ color: "#f3f3f3", fontSize: 14, fontWeight: 600 }}>
              Continue where you left off
            </Typography>
            <Typography sx={{ color: "#9e9e9e", fontSize: 12 }}>
              Open Notes to keep writing without loading delays.
            </Typography>
          </QuickAction>
        </Box>
      </SectionCard>

      <SectionCard elevation={0}>
        <Typography sx={{ px: 1, pb: 1, color: "#cfcfcf", fontWeight: 600 }}>
          Recent
        </Typography>
        <Box
          sx={{
            borderRadius: 14,
            px: 1.5,
            py: 1.25,
            bgcolor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={{ color: "#ececec", fontSize: 14, fontWeight: 600 }}>
              Notes Workspace
            </Typography>
            <Typography sx={{ color: "#8a8a8a", fontSize: 12 }}>
              Ready for offline use
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ color: "#8f8f8f" }} />
        </Box>
      </SectionCard>

      <SectionCard elevation={0}>
        <Typography sx={{ px: 1, pb: 1, color: "#cfcfcf", fontWeight: 600 }}>
          Scan to Access
        </Typography>
        <Box
          sx={{
            borderRadius: 14,
            px: 2,
            py: 2,
            background:
              "linear-gradient(160deg, rgba(124,77,255,0.14), rgba(68,138,255,0.08))",
            border: "1px solid rgba(124,77,255,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 1.5,
          }}
        >
          <Typography sx={{ color: "#dbdbdb", fontSize: 12 }}>
            Scan this code from your phone to open Tools quickly.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                p: 1.25,
                borderRadius: 3,
                bgcolor: "#fff",
                display: "flex",
                border: "4px solid rgba(124,77,255,0.14)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.32)",
              }}
            >
              <QRCodeSVG
                value={qrUrl}
                size={170}
                fgColor="#111111"
                bgColor="#ffffff"
                level="M"
                includeMargin
              />
            </Box>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                color: "#b6b6b6",
                fontSize: 12,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {qrUrl}
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
              onClick={async () => {
                await navigator.clipboard.writeText(qrUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                minWidth: 92,
                bgcolor: copied ? "#2e7d32" : "#7c4dff",
                "&:hover": {
                  bgcolor: copied ? "#2e7d32" : "#6f3dff",
                },
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </Box>
        </Box>
      </SectionCard>
    </Root>
  );
}
