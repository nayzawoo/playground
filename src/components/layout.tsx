import { Box, Paper } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const PageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  overflowY: "auto",
  minHeight: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

export const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
}));
