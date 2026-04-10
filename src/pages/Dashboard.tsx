import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

/* ── Styled Components ── */

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const Title = styled(Typography)({
  fontWeight: 700,
  color: "#e0e0e0",
  marginBottom: 8,
});

const Subtitle = styled(Typography)({
  color: "#757575",
});

/* ── Component ── */

export default function Dashboard() {
  return (
    <Root>
      <Box sx={{ textAlign: "center" }}>
        <Title variant="h4">Dashboard</Title>
        <Subtitle variant="body1">
          This section is empty. Start building here.
        </Subtitle>
      </Box>
    </Root>
  );
}
