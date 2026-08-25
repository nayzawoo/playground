import { useState } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import NoteIcon from "@mui/icons-material/Note";
import BookIcon from "@mui/icons-material/Book";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { tokens } from "../theme";

/* ── Styled Components ── */

const { violet, sky } = tokens.accent;

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  background: [
    `radial-gradient(circle at 18% 0%, ${alpha(violet, 0.2)}, transparent 42%)`,
    `radial-gradient(circle at 90% 12%, ${alpha(sky, 0.18)}, transparent 38%)`,
  ].join(", "),
  overflowY: "auto",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
    maxWidth: 520,
    margin: "0 auto",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: 4,
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const HeroCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 20,
  padding: theme.spacing(2),
  background: tokens.gradient.hero,
  border: `1px solid ${alpha(violet, 0.28)}`,
  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.3)",
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  borderRadius: 16,
  padding: theme.spacing(1.2),
  backgroundColor: alpha("#ffffff", 0.03),
  border: tokens.border.default,
}));

const QuickAction = styled(Box)(({ theme }) => ({
  borderRadius: 14,
  padding: theme.spacing(1.5),
  minHeight: 92,
  backgroundColor: alpha("#ffffff", 0.04),
  border: tokens.border.default,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition:
    "transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: alpha(violet, 0.45),
    backgroundColor: alpha(violet, 0.1),
  },
}));

const ScanPanel = styled(Box)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1.5),
  background: `linear-gradient(155deg, ${alpha(violet, 0.22)}, ${alpha(sky, 0.12)} 56%, ${alpha("#ffffff", 0.04)})`,
  border: `1px solid ${alpha(violet, 0.4)}`,
  display: "grid",
  gap: theme.spacing(1.5),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
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
      icon: <NoteIcon sx={{ fontSize: 20, color: "primary.light" }} />,
      hint: "Write quickly",
      path: "/notes",
    },
    {
      label: "Dhamma",
      icon: <BookIcon sx={{ fontSize: 20, color: "secondary.light" }} />,
      hint: "Read anytime",
      path: "/dhamma",
    },
    {
      label: "ZG-Uni",
      icon: <SwapHorizIcon sx={{ fontSize: 20, color: "success.main" }} />,
      hint: "Convert text",
      path: "/zawgyi-unicode-converter",
    },
    {
      label: "QR Code",
      icon: <QrCode2Icon sx={{ fontSize: 20, color: "warning.main" }} />,
      hint: "Generate code",
      path: "/qr",
    },
  ];

  return (
    <Root>
      <HeroCard elevation={0}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.2 }}>
          <Chip
            size="small"
            label="Mobile"
            sx={{ bgcolor: alpha("#ffffff", 0.1) }}
          />
          <Chip
            size="small"
            label="Offline Ready"
            sx={{ bgcolor: alpha(violet, 0.2), color: "primary.light" }}
          />
        </Stack>
        <Title variant="h5">Home</Title>
        <Subtitle variant="body2">
          App-style layout with large touch actions and compact sections.
        </Subtitle>
      </HeroCard>

      <SectionCard elevation={0}>
        <Typography sx={{ px: 1, pb: 1, color: "text.primary", fontWeight: 600 }}>
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
                  <Typography
                    sx={{ color: "text.primary", fontSize: 14, fontWeight: 600 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                    {item.hint}
                  </Typography>
                </Box>
              </QuickAction>
            </Box>
          ))}
          <QuickAction sx={{ gridColumn: "1 / -1" }}>
            <Typography
              sx={{ color: "text.primary", fontSize: 14, fontWeight: 600 }}
            >
              Continue where you left off
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
              Open Notes to keep writing without loading delays.
            </Typography>
          </QuickAction>
        </Box>
      </SectionCard>

      <SectionCard elevation={0}>
        <Typography sx={{ px: 1, pb: 1, color: "text.primary", fontWeight: 600 }}>
          Recent
        </Typography>
        <Box
          sx={{
            borderRadius: 3,
            px: 1.5,
            py: 1.25,
            bgcolor: alpha("#ffffff", 0.02),
            border: tokens.border.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{ color: "text.primary", fontSize: 14, fontWeight: 600 }}
            >
              Notes Workspace
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
              Ready for offline use
            </Typography>
          </Box>
          <ChevronRightIcon sx={{ color: "text.secondary" }} />
        </Box>
      </SectionCard>

      <SectionCard elevation={0}>
        <ScanPanel>
          <Box
            sx={{
              width: "fit-content",
              mx: "auto",
              borderRadius: "6px",
              bgcolor: "#ffffff",
              border: `2px solid ${alpha("#ffffff", 0.92)}`,
              overflow: "hidden",
              lineHeight: 0,
              padding: "6px",
              boxShadow: "0 16px 34px rgba(0,0,0,0.35)",
            }}
          >
            <QRCodeSVG
              value={qrUrl}
              size={120}
              fgColor="#111111"
              bgColor="#ffffff"
              level="Q"
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
              <QrCode2Icon sx={{ fontSize: 18, color: "primary.light" }} />
              <Typography
                sx={{ color: "text.primary", fontWeight: 700, fontSize: 15 }}
              >
                Scan to Access
              </Typography>
              <Chip
                size="small"
                label="Phone Ready"
                sx={{
                  height: 22,
                  bgcolor: alpha("#ffffff", 0.14),
                  color: "text.primary",
                  fontSize: 11,
                }}
              />
            </Stack>

            <Typography sx={{ color: "text.secondary", fontSize: 12, mb: 1.2 }}>
              Open this app on your mobile camera and continue instantly.
            </Typography>

            <Box
              sx={{
                px: 1.25,
                py: 1,
                borderRadius: 2.5,
                bgcolor: alpha("#000000", 0.22),
                border: tokens.border.strong,
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 11.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {qrUrl}
              </Typography>
            </Box>

            <Button
              fullWidth
              size="small"
              variant="contained"
              startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(qrUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                } catch {
                  setCopied(false);
                }
              }}
              color={copied ? "success" : "primary"}
              sx={{ borderRadius: 2.5, py: 0.7 }}
            >
              {copied ? "Link Copied" : "Copy Link"}
            </Button>
          </Box>
        </ScanPanel>
      </SectionCard>
    </Root>
  );
}
