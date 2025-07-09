import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Box,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function PrivacyNoticeSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  const notices = [
    {
      title: "1. Data We Collect",
      content: `We collect the following data to provide our services:\n\n• Public wallet addresses: Obtained via Web3 wallets (e.g., MetaMask) for analytics.\n• View-only API keys: Used to display exchange account data (e.g., balances, trading history) from centralized exchanges.\n• Anonymized usage data: Includes pages visited, error logs, and platform interactions to improve services.\n• Subscription data: Email and billing details (via Stripe) for account management and payments.\n\nWe do not collect private keys, seed phrases, or sensitive personal information beyond email and billing metadata.`,
    },
    {
      title: "2. How We Use Your Data",
      content: `Your data is used for:\n\n• Providing analytics, data mining, and decision-modeling tools.\n• Maintaining and improving the platform (e.g., error tracking, usage analysis).\n• Processing subscriptions and payments via Stripe.\n• Ensuring compliance with legal and regulatory obligations, including AML/CFT monitoring.\n• Responding to support inquiries and privacy rights requests.`,
    },
    {
      title: "3. Data Security",
      content: `We implement robust security measures:\n\n• Encryption: AES-256 encryption for API keys and billing data at rest and in transit.\n• Secure Transmission: HTTPS for all data transfers.\n• Authentication: Multi-factor authentication for API connections.\n• API Key Management: Keys are user-controlled, created/revoked via exchange settings, and not stored long-term.`,
    },
    {
      title: "4. Data Sharing",
      content: `We do not sell or share your data for marketing purposes. Data is shared only with:\n\n• Third-party services: Stripe (payments), Cloudflare/Vercel (hosting), Sentry/LogRocket (error tracking), each governed by their own privacy policies.\n• Legal authorities: When required to comply with laws or prevent illicit activity (e.g., AML/CFT).`,
    },
    {
      title: "5. Data Retention",
      content: `We retain data only as long as necessary:\n\n• Billing data: 7 years, per tax laws.\n• Usage logs: 90 days, unless required for legal purposes.\n• API keys: Deleted upon revocation or account termination.`,
    },
    {
      title: "6. Data Breach Notifications",
      content: `In the event of a data breach, we will notify affected users within 72 hours, as required by GDPR, CPRA, and other applicable laws.`,
    },
    {
      title: "7. Cross-Border Data Transfers",
      content: `Your data may be transferred to servers outside your jurisdiction (e.g., U.S., EU). We ensure compliance with GDPR, CPRA, UK-GDPR, PDPA, PIPA, UAE Data Protection Law, PDPL, PDPO, FADP, LGPD, IT Act, LFPDPPP, Law 81, Law 19.628, Law 25.326, Law 1581, NDPR, KVKK, and PDPA through user consent and security measures. By using our platform or connecting APIs, you consent to these transfers.`,
    },
    {
      title: "8. Your Privacy Rights",
      content: `You have the following rights, subject to applicable laws:\n\n• Access: View the data we hold about you.\n• Correction: Update inaccurate data.\n• Deletion: Request data removal.\n• Restriction: Limit data processing.\n• Portability: Receive your data in a structured format.\n• Opt-Out: We do not sell data, so opt-out rights are not applicable.\n• API Key Revocation: Revoke keys via exchange settings.\n• Audit Logs: Access logs of API activities.\n\nTo exercise these rights, contact privacy@elaninsights.io. We comply with GDPR, CPRA, UK-GDPR, PDPA, PIPA, UAE Data Protection Law, PDPL, PDPO, FADP, LGPD, IT Act, LFPDPPP, Law 81, Law 19.628, Law 25.326, Law 1581, NDPR, KVKK, and PDPA.`,
    },
    {
      title: "9. Contact Us",
      content: `For questions or to exercise your rights, reach out to:\n\n• Email: privacy@elaninsights.io\n• Website: https://elaninsights.io\n\nBy using Elan Insights, you acknowledge and agree to this Privacy Notice.`,
    },
  ];

  const renderContent = (text: string) => {
  const lines = text.split("\n");

  return lines.map((line, idx) => {
    const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);

    return (
      <Typography key={idx} sx={{ color: isDark ? "lightgray" : "#4a4a4a", }}>
        {emailMatch ? (
          <>
            {line.split(emailMatch[0])[0]}
            <a
              href={`mailto:${emailMatch[0]}`}
              style={{ color: "#70b3ff", textDecoration: "none" }}
            >
              {emailMatch[0]}
            </a>
            {line.split(emailMatch[0])[1]}
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
            {line.split(urlMatch[0])[1]}
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
        Privacy Notice
      </Typography>
      <Typography sx={{ color: "gray", mb: 2 }}>
        Updated June 2, 2025
      </Typography>
      <Typography paragraph>
        Elan Insights is committed to protecting your privacy. This Privacy Notice explains how data is collected, used, secured, shared, and what rights you have under applicable privacy laws. Elan Insights is a non-custodial SaaS platform for cryptocurrency analytics, and its data practices follow a minimal collection approach.
      </Typography>

      {notices.map((notice, idx) => (
        <Accordion
          key={idx}
          defaultExpanded
          disableGutters
          elevation={0}
          square
          sx={{ mb: "15px", border: "1px solid gray", borderRadius: "8px", overflow: "hidden" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{notice.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ whiteSpace: "pre-line", color: "lightgray" }}>{renderContent(notice.content)}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}