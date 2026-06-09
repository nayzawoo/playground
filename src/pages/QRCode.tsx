import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { QRCodeSVG } from "qrcode.react";
import { PageContainer, SectionCard } from "../components/layout";

export default function QRCodePage() {
  const [text, setText] = useState<string>("");

  const handleClear = () => {
    setText("");
  };

  return (
    <PageContainer>
      <Typography variant="body2" color="text.secondary">
        Enter text or a URL to generate a QR code.
      </Typography>

      <SectionCard>
        <TextField
          label="Text / URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          size="medium"
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "background.default",
            border: 1,
            borderColor: "divider",
          }}
        >
          <QRCodeSVG value={text || " "} size={192} />
        </Box>
      </SectionCard>
    </PageContainer>
  );
}
