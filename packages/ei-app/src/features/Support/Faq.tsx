// components/FaqSection.tsx

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation("Support");

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

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        {t("FrequentlyAskedQuestions")}
      </Typography>
      <Typography sx={{ color: "gray", mb: 2 }}>
        {t("UpdatedDate", { date: "June 2, 2025" })}
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
            <Typography sx={{ color: "lightgray", whiteSpace: "pre-line" }}>
                {t(faq.answerKey)}
            </Typography>

          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
