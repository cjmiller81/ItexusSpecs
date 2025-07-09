import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation("Support");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const faqs = [
    {
      questionKey: "WhatIsElanInsights",
      answerKey: "ElanInsightsIs",
    },
    {
      questionKey: "IsElanInsightsRegulatedFinancialEntity",
      answerKey: "ElanInsightsIsNonCustodialSaaS",
    },
    {
      questionKey: "HowDoesPlatformEnsure",
      answerKey: "NonCustodialElanInsights",
    },
    {
      questionKey: "WhatTheTradeAggregatorTool",
      answerKey: "ThisToolAnalyzesMarketData",
    },
    {
      questionKey: "WhatTokensExchangesAreSupported",
      answerKey: "AllTokensListedOnCoinGecko",
    },
    {
      questionKey: "HowIsMyDataProtected",
      answerKey: "MinimalDataIsColleted",
    },
    {
      questionKey: "WhatAreMyPrivacyRights",
      answerKey: "UsersCanAccess",
    },
    {
      questionKey: "HowDoesElanInsightsHandle",
      answerKey: "ItReliesOn",
    },
    {
      questionKey: "WhatRisks",
      answerKey: "CryptoInvestments",
    },
    {
      questionKey: "IsElanInsights",
      answerKey: "NoAccessIs",
    },
    {
      questionKey: "HowAreUpdatesTo",
      answerKey: "NotificationsAreSentVia",
    },
    {
      questionKey: "WhoCanIContact",
      answerKey: "Emails",
    },
  ];

  const renderAnswer = (text: string, textColor: string) => {
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);

    return (
      <Typography key={idx} sx={{ color: textColor }}>
        {emailMatch ? (
          <>
            {line.split(emailMatch[0])[0]}
            <a
              href={`mailto:${emailMatch[0]}`}
              style={{ color: "#70b3ff", textDecoration: "none" }}
            >
              {emailMatch[0]}
            </a>
          </>
        ) : urlMatch ? (
          <>
            {line.split(urlMatch[0])[0]}
            <a
              href={urlMatch[0]}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#70b3ff", textDecoration: "none" }}
            >
              {urlMatch[0]}
            </a>
          </>
        ) : (
          line
        )}
      </Typography>
    );
  });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {t("FrequentlyAskedQuestions")}
      </Typography>
      <Typography sx={{ color: "gray", mb: 2 }}>
        Updated June 2, 2025
      </Typography>

      {faqs.map((faq, idx) => (
        <Accordion
          key={idx}
          defaultExpanded
          disableGutters
          elevation={0}
          square
          sx={{
            mb: "15px",
            border: "1px solid gray",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{t(faq.questionKey)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderAnswer(t(faq.answerKey), isDark ? "lightgray" : "#4a4a4a")}

          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
