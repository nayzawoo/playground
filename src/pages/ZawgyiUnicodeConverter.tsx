import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import zawgyiFont from "../assets/fonts/zawgyi.ttf";
// @ts-ignore
import { zg2uni, uni2zg } from "/src/Libs/Rabbit";

/* ── Styled Components ── */

const Root = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(3),
  },
}));

const FieldsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const ZawgyiField = styled(TextField)({
  flex: 1,
  "@font-face": {
    fontFamily: "Zawgyi-One",
    src: `url(${zawgyiFont}) format('truetype')`,
  },
  "& .MuiInputBase-root": {
    height: "100%",
    alignItems: "flex-start",
  },
  "& .MuiInputBase-input": {
    fontFamily: "'Zawgyi-One' !important",
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Zawgyi-One' !important",
  },
});

const UnicodeField = styled(TextField)({
  flex: 1,
  "& .MuiInputBase-root": {
    height: "100%",
    alignItems: "flex-start",
  },
});

/* ── Constants ── */

// ျမန္မာစာသည္တို့စာ
const defaultZg =
  "\u103B\u1019\u1014\u1039\u1019\u102C\u1005\u102C\u101E\u100A\u1039\u1010\u102D\u102F\u1037\u1005\u102C";

/* ── Component ── */

export default function ZawgyiUnicodeConverter() {
  const [zawgyi, setZawgyi] = useState(defaultZg);
  const [unicode, setUnicode] = useState(() => zg2uni(defaultZg));

  const handleZawgyiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setZawgyi(e.target.value);
    setUnicode(zg2uni(e.target.value));
  };

  const handleUnicodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUnicode(e.target.value);
    setZawgyi(uni2zg(e.target.value));
  };

  const handleClear = () => {
    setZawgyi("");
    setUnicode("");
  };

  return (
    <Root>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={() => navigator.clipboard.writeText(zawgyi)}
        >
          Copy Zawgyi
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={() => navigator.clipboard.writeText(unicode)}
        >
          Copy Unicode
        </Button>
      </Stack>

      <FieldsRow>
        <ZawgyiField
          label="Zawgyi"
          multiline
          minRows={10}
          value={zawgyi}
          onChange={handleZawgyiChange}
          fullWidth
        />
        <UnicodeField
          label="Unicode"
          multiline
          minRows={10}
          value={unicode}
          onChange={handleUnicodeChange}
          fullWidth
        />
      </FieldsRow>
    </Root>
  );
}
