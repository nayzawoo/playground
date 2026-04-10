import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

/* ── Styled Components ── */

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}));

const SuttaCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 16,
  marginTop: theme.spacing(3),
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
}));

const VerseNumber = styled("span")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginRight: theme.spacing(1),
}));

/* ── Content ── */

const SUTTAS = [
  {
    id: "mangala",
    title: "မင်္ဂလသုတ်",
    content: `၁။ ယံ မင်္ဂလံ ဒွါဒသဟိ၊ စိန္တယိံ သု သဒေဝကာ။ သောတ္ထာနံ နာဓိဂစ္ဆန္တိ၊ အဋ္ဌတ္တိံ သဉ္စမင်္ဂလံ။
၂။ ဒေသိတံ ဒေဝဒေဝေန၊ သဗ္ဗပါပဝိနာသနံ၊ သဗ္ဗလောက ဟိတတ္ထာယ၊ မင်္ဂလံ တံဘဏာမ ဟေ။
၃။ ဧဝံ မေသုတံ — ဧကံ သမယံ ဘဂဝါ သာဝတ္ထိယံ ဝိဟရတိ ဇေတဝနေ အနာထ ပိဏ္ဍိကဿ အာရာမေ။ အထ ခေါ အညတရာ ဒေဝတာ အဘိက္ကန္တာယ ရတ္တိယာ အဘိက္ကန္တ ဝဏ္ဏာ ကေဝလကပ္ပံ ဇေတဝနံ သြဘာသေတွာ ယေန ဘဂဝါ, တေနုပသင်္ကမိ။ ဥပသင်္ကမိတွာ ဘဂဝန္တံ အဘိဝါဒေတွာ ဧကမန္တံ အဋ္ဌာသိ။ ဧကမန္တံ ဌိတာ ခေါ သာ ဒေဝတာ ဘဂဝန္တံ ဂါထာယ အဇ္ဈဘာသိ။
၄။ ဗဟူ ဒေဝါ မနုဿာ စ၊ မင်္ဂလာနိ အစိန္တယုံ။ အာကင်္ခမာနာ သောတ္ထာနံ၊ ဗြူဟိ မင်္ဂလမုတ္တမံ။
၅။ အသေဝနာ စ ဗာလာနံ၊ ပဏ္ဍိတာနဉ္စ သေဝနာ။ ပူဇာစ ပူဇ နေယျာနံ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၆။ ပတိရူပ ဒေသဝါသော စ၊ ပုဗ္ဗေစ ကတပုညတာ။ အတ္တ သမာပဏိဓိ စ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၇။ ဗာဟုသစ္စဉ္စ သိပ္ပဉ္စ၊ ဝိနယော စ သုသိက္ခိတော။ သုဘာသိတာ စ ယာ ဝါစာ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၈။ မာတာပိတု ဥပဋ္ဌာနံ၊ ပုတ္တဒါရဿ သင်္ဂဟော။ အနာကုလာ စ ကမ္မန္တာ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၉။ ဒါနဉ္စ ဓမ္မစရိယာ စ၊ ဉာတကာနဉ္စ သင်္ဂဟော။ အနဝဇ္ဇာနိ ကမ္မာနိ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၀။ အာရတီ ဝိရတီ ပါပါ၊ မဇ္ဇပါနာ စ သံယမော။ အပ္ပမာဒေါ စ ဓမ္မေသု၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၁။ ဂါရဝေါ စ နိဝါတော စ၊ သန္တုဋ္ဌိ စ ကတညုတာ။ ကာလေန ဓမ္မဿဝနံ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၂။ ခန္တီစ သောဝစဿတာ၊ သမဏာနဉ္စ ဒဿနံ၊ ကာလေန ဓမ္မသာကစ္ဆာ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၃။ တပေါ စ ဗြဟ္မစရိယဉ္စ အရိယာသစ္စာန ဒဿနံ၊ နိဗ္ဗာန သစ္ဆိကိရိယာ စ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၄။ ဖုဋ္ဌဿ လောကဓမ္မေဟိ၊ စိတ္တံ ယဿ န ကမ္ပတိ၊ အသောကံ ဝိရဇံ ခေမံ၊ ဧတံ မင်္ဂလမုတ္တမံ။
၁၅။ ဧတာဒိသာနိ ကတွာန၊ သဗ္ဗတ္ထ မပရာဇိတာ။ သဗ္ဗတ္ထ သောတ္ထိံ ဂစ္ဆန္တိ၊ တံ တေသံ မင်္ဂလမုတ္တမံ။`,
  },
  {
    id: "metta",
    title: "မေတ္တာသုတ်",
    content: `၁။ ယဿာနုဘာဝတော ယက္ခာ၊ နေဝ ဒဿေန္တိ ဘီသနံ။ ယဉှိ စေဝါ နုယုဉ္ဇန္တော၊ ရတ္တိန္ဒိဝ မတန္ဒိတော။
၂။ သုခံ သုပတိ သုတ္တော စ၊ ပါပံ ကိဉ္စိ န ပဿတိ။ ဧဝမာဒိ ဂုဏူပေတံ။ ပရိတ္တံ တံ ဘဏာမ ဟေ။
၃။ ကရဏီယ မတ္ထ ကုသလေန၊ ယန္တ သန္တံ ပဒံ အဘိသမေစ္စ။ သက္ကော ဥဇူ စ သုဟုဇူ စ၊ သုဝစော စဿ မုဒု အနတိမာနီ။
၄။ သန္တုဿကော စ သုဘရော စ၊ အပ္ပကိစ္စော စ သလ္လ ဟုကဝုတ္တိ။ သန္တိန္ဒြိယော စ နိပကော စ၊ အပ္ပဂဗ္ဘော ကုလေသွ န နုဂိဒ္ဓေါ။
၅။ န စ ခုဒ္ဒ မာစရေ ကိဉ္စိ၊ ယေန ဝိညူ ပရေ ဥပ ဝဒေယျုံ။ သုခိနောဝ ခေမိနော ဟောန္တု၊ သဗ္ဗသတ္တာ ဘဝန္တု သုခိတတ္တာ။
၆။ ယေ ကေစိ ပါဏဘူတတ္ထိ၊ တသာ ဝါ ထာဝရာဝ နဝသေသာ။ ဒီဃာ ဝါ ယေဝ မဟန္တာ၊ မဇ္ဈိမာ ရဿကာ အဏုကထူလာ။
၇။ ဒိဋ္ဌာ ဝါ ယေဝ အဒိဋ္ဌာ၊ ယေဝ ဒူရေ ဝသန္တိ အဝိဒူရေ။ ဘူတာဝ သမ္ဘဝေသီဝ၊ သဗ္ဗသတ္တာ ဘဝန္တု သုခိတတ္တာ။
၈။ န ပရော ပရံ နိကုဗ္ေထ၊ နာတိမညထေ ကတ်ထ စိ န ကဉ္စိ။ ဗျာရောသနာ ပဋိဃသည၊ နာညမညဿ ဒုက္ခ မိစ္ဆေယျ။
၉။ မာတာ ယထာ နိယံပုတ္တ ၊ မာယုသာ ဧကပုတ္တ မနုရက္ခေ။ ဧဝမ္ပိ သဗ္ဗဘူတေသု၊ မာနသံ ဘာဝယေ အပရိမာဏံ။
၁၀။ မေတ္တ ဉ္စ သဗ္ဗလောကသ္မိံ၊ မာနသံ ဘာဝယေ အပရိမာဏံ။ ဥဒ္ဓံ အဓော စ တိရိယဉ္စ၊ အသမ္ဗာဓံ အဝေရ မသပတ္တံ။
၁၁။ တိဋ္ဌံ စရံ နိသိန္နော ဝ၊ သယာနော ယာဝတာဿ ဝိတမိဒ္ဓေါ။ ဧတံ သတိံ အဓိဋ္ဌေယျ၊ ဗြဟ္မ မေတံ ဝိဟာရ မိဓ မာဟု။
၁၂။ ဒိဋ္ဌိဉ္စ အနုပဂ္ဂမ္မ၊ သီလဝါ ဒဿနေန သမ္ပန္နော။ ကာမေသု ဝိနယ ဂေဓံ၊ န ဟိ ဇာတုဂ္ဂဗ္ဘသေယျ ပုန ရေတိ။`,
  },
  {
    id: "mora",
    title: "မောရသုတ်",
    content: `၁။ ပူရေန္တံ ဗောဓိသမ္ဘာရေ၊ နိဗ္ဗတ္တံ မောရယောနိယံ။ ယေန သံဝိဟိတာ ရက္ခံ၊ မဟာသတ္တံ ဝနေစရာ။
၂။ စိရဿံ ဝါယမန္တာပိ၊ နေဝ သက္ခိံသု ဂဏှိတုံ။ ဗြဟ္မမန္တန္တိ အက္ခာတံ၊ ပရိတ္တံ တံ ဘဏာမ ဟေ။
၃။ ဥဒေတယံ စက္ခုမာ ဧကရာဇာ၊ ဟရိဿဝဏ္ဏော ပထဝိပ္ပဘာသော။ တံ တံ နမဿာမိ ဟရိဿဝဏ္ဏံ ပထဝိပ္ပဘာသံ၊ တယာဇ္ဇ ဂုတ္တာ ဝိဟရေမု ဒိဝသံ။
၄။ ယေ ဗြာဟ္မဏာ ဝေဒဂူ သဗ္ဗဓမ္မေ၊ တေ မေ နမော တေ စ မံ ပါလယန္တု။ နမတ္ထု ဗုဒ္ဓါနံ နမတ္ထု ဗောဓိယာ၊ နမော ဝိမုတ္တာနံ နမော ဝိမုတ္တိယာ၊ ဣမံ သော ပရိတ္တံ ကတွာ၊ မောရော စရတိ ဧသနာ။
၅။ အပေတယံ စက္ခုမာ ဧကရာဇာ၊ ဟရိဿဝဏ္ဏော ပထဝိပ္ပဘာသော။ တံ တံ နမဿာမိ ဟရိဿဝဏ္ဏံ ပထဝိပ္ပဘာသံ၊ တယာဇ္ဇ ဂုတ္တာ ဝိဟရေမု ရတ္တိံ။
၆။ ယေ ဗြာဟ္မဏာ ဝေဒဂူ သဗ္ဗဓမ္မေ၊ တေ မေ နမော တေ စ မံ ပါလယန္တု။ နမတ္ထု ဗုဒ္ဓါနံ နမတ္ထု ဗောဓိယာ။ နမော ဝိမုတ္တာနံ နမော ဝိမုတ္တိယာ။ ဣမံ သော ပရိတ္တံ ကတွာ၊ မောရော ဝါသ မကပ္ပယိ။`,
  },
];

/* ── Component ── */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sutta-tabpanel-${index}`}
      aria-labelledby={`sutta-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export default function Dhamma() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Root>
      <Container maxWidth="md">
        <Box sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.1)" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="Dhamma suttas tabs"
          >
            {SUTTAS.map((sutta, index) => (
              <Tab
                key={sutta.id}
                label={sutta.title}
                id={`sutta-tab-${index}`}
                aria-controls={`sutta-tabpanel-${index}`}
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Tabs>
        </Box>

        {SUTTAS.map((sutta, index) => (
          <CustomTabPanel key={sutta.id} value={value} index={index}>
            <SuttaCard elevation={0}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  textAlign: "center",
                  color: "primary.light",
                }}
              >
                {sutta.title}ပါဠိတော်
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  fontFamily: "inherit",
                  fontSize: "1.1rem",
                  color: "#e0e0e0",
                }}
              >
                {sutta.content.split("\n").map((line, i) => {
                  const match = line.match(/^(\d+။)\s*(.*)/);
                  if (match) {
                    return (
                      <Box key={i} sx={{ mb: 2 }}>
                        <VerseNumber>{match[1]}</VerseNumber>
                        {match[2]}
                      </Box>
                    );
                  }
                  return (
                    <Box key={i} sx={{ mb: 2 }}>
                      {line}
                    </Box>
                  );
                })}
              </Typography>
            </SuttaCard>
          </CustomTabPanel>
        ))}
      </Container>
    </Root>
  );
}
