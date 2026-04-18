import { useCallback, useRef, useState } from "react";
import { Box, Typography, Paper, Container, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/* ── Load Padauk font only for this page ── */
const padaukLink = document.createElement("link");
padaukLink.rel = "stylesheet";
padaukLink.href = "https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap";
if (!document.querySelector('link[href*="Padauk"]')) {
  document.head.appendChild(padaukLink);
}

/* ── Styled Components ── */

const Root = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
  },
}));

const MYANMAR_FONT = '"Padauk", "Pyidaungsu", "Myanmar Text", sans-serif';

const SuttaCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 16,
  marginTop: theme.spacing(3),
  lineHeight: 2.2,
  whiteSpace: "pre-wrap",
  fontFamily: MYANMAR_FONT,
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
    audio: "/dhamma/01MinGaLa-Thoat.mp3",
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
    audio: "/dhamma/03Mitta-Thoat.mp3",
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
    audio: "/dhamma/05MawRa-Thoat.mp3",
    content: `၁။ ပူရေန္တံ ဗောဓိသမ္ဘာရေ၊ နိဗ္ဗတ္တံ မောရယောနိယံ။ ယေန သံဝိဟိတာ ရက္ခံ၊ မဟာသတ္တံ ဝနေစရာ။
၂။ စိရဿံ ဝါယမန္တာပိ၊ နေဝ သက္ခိံသု ဂဏှိတုံ။ ဗြဟ္မမန္တန္တိ အက္ခာတံ၊ ပရိတ္တံ တံ ဘဏာမ ဟေ။
၃။ ဥဒေတယံ စက္ခုမာ ဧကရာဇာ၊ ဟရိဿဝဏ္ဏော ပထဝိပ္ပဘာသော။ တံ တံ နမဿာမိ ဟရိဿဝဏ္ဏံ ပထဝိပ္ပဘာသံ၊ တယာဇ္ဇ ဂုတ္တာ ဝိဟရေမု ဒိဝသံ။
၄။ ယေ ဗြာဟ္မဏာ ဝေဒဂူ သဗ္ဗဓမ္မေ၊ တေ မေ နမော တေ စ မံ ပါလယန္တု။ နမတ္ထု ဗုဒ္ဓါနံ နမတ္ထု ဗောဓိယာ၊ နမော ဝိမုတ္တာနံ နမော ဝိမုတ္တိယာ၊ ဣမံ သော ပရိတ္တံ ကတွာ၊ မောရော စရတိ ဧသနာ။
၅။ အပေတယံ စက္ခုမာ ဧကရာဇာ၊ ဟရိဿဝဏ္ဏော ပထဝိပ္ပဘာသော။ တံ တံ နမဿာမိ ဟရိဿဝဏ္ဏံ ပထဝိပ္ပဘာသံ၊ တယာဇ္ဇ ဂုတ္တာ ဝိဟရေမု ရတ္တိံ။
၆။ ယေ ဗြာဟ္မဏာ ဝေဒဂူ သဗ္ဗဓမ္မေ၊ တေ မေ နမော တေ စ မံ ပါလယန္တု။ နမတ္ထု ဗုဒ္ဓါနံ နမတ္ထု ဗောဓိယာ။ နမော ဝိမုတ္တာနံ နမော ဝိမုတ္တိယာ။ ဣမံ သော ပရိတ္တံ ကတွာ၊ မောရော ဝါသ မကပ္ပယိ။`,
  },
];

/* ── Component ── */

export default function Dhamma() {
  const [fontSize, setFontSize] = useState(1.6);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlay = useCallback((index: number) => {
    audioRefs.current.forEach((el, i) => {
      if (i !== index && el && !el.paused) {
        el.pause();
      }
    });
  }, []);

  const increase = () => setFontSize((s) => Math.min(s + 0.1, 2.0));
  const decrease = () => setFontSize((s) => Math.max(s - 0.1, 0.7));

  return (
    <Root>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1,
            mb: 1,
          }}
        >
          <IconButton
            onClick={decrease}
            sx={{
              color: "grey.300",
              width: 56,
              height: 56,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              fontSize: 28,
            }}
          >
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h6" sx={{ color: "grey.400", minWidth: 56, textAlign: "center", fontWeight: 700 }}>
            {Math.round(fontSize * 100)}%
          </Typography>
          <IconButton
            onClick={increase}
            sx={{
              color: "grey.300",
              width: 56,
              height: 56,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              fontSize: 28,
            }}
          >
            <AddIcon fontSize="inherit" />
          </IconButton>
        </Box>

        {SUTTAS.map((sutta, index) => (
          <Box key={sutta.id} sx={{ mb: 4 }}>
            <Box
              component="audio"
              ref={(el: HTMLAudioElement | null) => { audioRefs.current[index] = el; }}
              onPlay={() => handlePlay(index)}
              controls
              src={sutta.audio}
              preload="none"
              sx={{
                width: "100%",
                mb: 1,
                borderRadius: 2,
                outline: "none",
                "&::-webkit-media-controls-panel": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                },
              }}
            />
            <SuttaCard elevation={0}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  textAlign: "center",
                  color: "primary.light",
                  fontFamily: MYANMAR_FONT,
                }}
              >
                {sutta.title}ပါဠိတော်
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  fontFamily: MYANMAR_FONT,
                  fontSize: `${fontSize}rem`,
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
          </Box>
        ))}
      </Container>
    </Root>
  );
}
