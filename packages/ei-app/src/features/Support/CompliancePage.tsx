import {
  Box,
  Typography,
  Stack,
  Paper,
  useTheme
} from "@mui/material";

export default function ComplianceUserAgreement() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{
        fontWeight: "bold",
        color: isDark ? "#fff" : "#000",
        mb: 1,
      }}>
        Compliance and User Agreement
      </Typography>
      <Typography sx={{ color: "gray", mb: 3 }}>
        Last Updated: May 30, 2025
      </Typography>

      <Stack spacing={2}>
        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Introduction
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Welcome to Elan Insights, a platform for cryptocurrency analytics and insights. By using our services, you agree to these Terms of Service. Elan Insights is a non-custodial Software-as-a-Service (SaaS) platform providing analytics, data mining, and decision-modeling tools for cryptocurrency markets.
            {"\n\n"}
            The platform integrates with centralized exchanges (e.g., Kraken, Coinbase) listed on CoinGecko, 1inch, or DeFiLlama via view-only API keys to display user account data and offers a “Trade Aggregator” tool that generates links to exchange websites for user-initiated trades. We do not hold funds, private keys, initiate transactions, or provide investment advice.
            {"\n\n"}
            This Agreement outlines our compliance with regulations in the United States, European Union, United Kingdom, Singapore, Australia, Canada, United Arab Emirates, Saudi Arabia, Hong Kong, Switzerland, India, Brazil, Mexico, El Salvador, Panama, Chile, Argentina, Colombia, Nigeria, Turkey, Thailand, Malta, Estonia, Portugal, Liechtenstein, Georgia, and Cayman Islands. Elan Insights is not available to residents of Japan or South Korea, including those accessing the platform via VPNs or other anonymizing technologies. Users are responsible for ensuring they are not located in these jurisdictions.
            {"\n\n"}
            This Agreement applies to retail and institutional users.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Non-Custodial Functionality
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Elan Insights does not control user funds or assets. Elan Insights does not hold, manage, or control user funds, private keys, or cryptocurrency wallets. Users initiate and execute transactions on external exchange platforms. The Trade Aggregator provides links to exchange and / or Web3 wallet websites, requiring user login and authorization. For decentralized transactions, users construct and sign trades via Web3 wallets (e.g., MetaMask) with explicit confirmation prompts (e.g., “Review and sign transaction”). Centralized exchange integrations use view-only API keys to display account data (e.g., balances, trading history) without trading or withdrawal capabilities. We do not route orders, execute trades, or act as intermediaries.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            API Integration with Centralized Exchanges
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Elan Insights uses view-only API keys to connect to centralized exchanges. The Trade Aggregator identifies potential trades based on user-defined criteria and provides direct links to exchange websites, where users must log in to execute trades. Users are responsible for complying with exchange-specific API terms (e.g., rate limits, usage policies). We are not liable for exchange outages, API rate limits, deprecation, data delays, or trade execution errors on external platforms. Users bear responsibility for securing API keys and revoking access via exchange settings when discontinuing use. Service availability may be affected by exchange API changes, and we implement failover mechanisms and notify users of deprecations via email or in-app alerts.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Regulatory Status
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Elan Insights complies with applicable U.S. regulations and is not a financial institution. Elan Insights is not a regulated financial entity under the following frameworks:
            {"\n"}
            United States (SEC, FINRA, CFTC, FinCEN): No securities (per Howey Test), broker-dealer, derivatives, or money transmitter activities. European Union (MiFID II, AMLD5): No investment services or custodial AML/KYC requirements. United Kingdom (FCA): Non-custodial, no investment advice; compliant with UK AML and UK-GDPR. Singapore (MAS): No Digital Payment Token services; compliant with PDPA. Australia (ASIC): No financial services; compliant with Privacy Act 1988. Canada (CSA): No custodial activities; compliant with PIPEDA. United Arab Emirates (FSRA, VARA): No licensing required; compliant with UAE Data Protection Law. Saudi Arabia (CMA): No licensing required; compliant with PDPL. Hong Kong (SFC): No licensing required; compliant with PDPO. Switzerland (FINMA): No licensing required; compliant with FADP. India (RBI): No licensing required; compliant with IT Act. Brazil (CVM): No licensing required; compliant with LGPD. Mexico (CNBV): No VASP registration; compliant with LFPDPPP. El Salvador (BCR): No licensing required. Panama: No licensing required; compliant with Law 81. Chile (CMF): No licensing required; compliant with Law 19.628. Argentina (BCRA): No licensing required; compliant with Law 25.326. Colombia (SFC): No licensing required; compliant with Law 1581. Nigeria (SEC Nigeria): No licensing required; compliant with NDPR. Turkey (SPK): No licensing required; compliant with KVKK. Thailand (SEC Thailand): No licensing required; compliant with PDPA. Malta (MFSA): No licensing required; compliant with Data Protection Act. Estonia (FIU): No licensing required; compliant with Personal Data Protection Act. Portugal (Banco de Portugal): No licensing required; compliant with GDPR. Liechtenstein (FMA): No licensing required; compliant with GDPR. Georgia (National Bank of Georgia): No licensing required; compliant with civil code. Cayman Islands (CIMA): No licensing required; compliant with civil code. We display all tokens listed on CoinGecko for viewing and analysis, without facilitating trades or recommendations. Stablecoins (e.g., USDT, USDC) are supported, subject to regulatory classifications (e.g., CFTC for commodities).
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Risk Disclosures
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Elan Insights provides analytical tools for evaluating cryptocurrency markets, including price performance, volatility metrics, and scenario modeling based on historical data. All analytics, simulations, and scenario tools provided by Elan Insights are for informational and educational purposes only. Outputs are based on historical data and user-defined inputs and are not intended to predict or guarantee future performance. Elan Insights does not offer investment advice.
            {"\n\n"}
            Users should understand that cryptocurrencies are highly volatile and carry significant financial risk. These risks include, but are not limited to:
            {"\n"}- Sudden price fluctuations or flash crashes
            {"\n"}- Smart contract vulnerabilities and protocol failures
            {"\n"}- API outages, latency, or deprecation from exchanges
            {"\n"}- Regulatory changes that affect the legality or availability of tokens
            {"\n"}- Third-party data inaccuracies or delays
            {"\n\n"}
            Elan Insights is a non-custodial platform. It does not hold or manage user funds, private keys, or execute trades. All analytics are based on data derived from user-connected wallets or view-only API connections to third-party services.
            {"\n\n"}
            You are solely responsible for performing your own due diligence, securing your accounts, and ensuring compliance with the applicable laws in your jurisdiction.
            {"\n\n"}
            Investing in cryptocurrencies may result in partial or total loss of capital. You should consult a licensed financial advisor before making investment decisions.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Market Data Disclaimer
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Cryptocurrency prices, trading volume, and analytics displayed on the Elan Insights platform are based on third-party data feeds and may not reflect the most current market conditions. Prices may be delayed, inaccurate, or incomplete due to exchange API limitations or market volatility. Users should verify real-time prices independently before making trading decisions.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            No Investment Advice
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            We do not provide financial advice. Elan Insights provides educational tools, including predictive modeling and portfolio analysis (e.g., Sharpe ratio, volatility metrics), based on user-provided or wallet data (via MetaMask or view-only APIs). No personalized recommendations are offered. Analytics are for educational purposes only; see external resources (e.g., Investopedia: https://www.investopedia.com/terms/s/sharperatio.asp) for definitions.
            {"\n\n"}
            Users must opt-in to wallet analysis via consent prompts. We comply with SEC’s Investment Advisers Act, MiFID II, FCA, and other regulations by not acting as an adviser.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Subscription and Payment
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Users pay fees for access. Subscription fees grant access to analytical tools on a flat-fee basis, not tied to trading performance or asset management. Payments are processed by Stripe, which securely stores billing data (email, partial card details). We do not store full credit card numbers. Exchange fees are separate and governed by exchange terms.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Privacy and API Security
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            We collect user data per our Privacy Policy. Elan Insights collects minimal data:
            {"\n"}● Public wallet addresses (via MetaMask).
            {"\n"}● View-only API keys for exchange and web3 Wallet data.
            {"\n"}● Anonymized usage data (e.g., pages visited, error logs).
            {"\n"}● Subscription data (email, billing details via Stripe).
            {"\n\n"}
            We do not collect private keys, seed phrases, or sensitive PII beyond email/billing metadata. Data is used for platform maintenance, analytics, support, and legal compliance.
            {"\n\n"}
            Security measures include:
            {"\n"}● AES-256 encryption for API keys and billing data at rest and in transit.
            {"\n"}● HTTPS for all data transmission.
            {"\n"}● Multi-factor authentication for API connections.
            {"\n"}● API key lifecycle: User-controlled creation/revocation via exchange settings; no long-term storage.
            {"\n"}● Third-party services (Stripe, Cloudflare/Vercel, Sentry/LogRocket) operate under their own privacy policies.
            {"\n"}● Data retention: Billing data: 7 years per tax laws.
            {"\n"}● Usage logs: 90 days unless required for legal purposes.
            {"\n"}● API keys: Deleted upon revocation or account termination.
            {"\n"}● Data breach notifications occur within 72 hours (GDPR/CPRA).
            {"\n"}● Cross-border transfers comply with GDPR, CPRA, UK-GDPR, PDPA, PIPA, UAE Data Protection Law, PDPL, PDPO, FADP, LGPD, IT Act, LFPDPPP, Law 81, Law 19.628, Law 25.326, Law 1581, NDPR, KVKK, PDPA.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            User Rights
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Users have rights under applicable laws. Users have rights under GDPR, CPRA, UK-GDPR, PDPA, PIPA, UAE Data Protection Law, PDPL, PDPO, FADP, LGPD, IT Act, LFPDPPP, Law 81, Law 19.628, Law 25.326, Law 1581, NDPR, KVKK, PDPA, including access, correction, deletion, restriction, or data portability. Users can opt-out of data sharing (not applicable; no data sales), revoke API keys via exchange settings, and access audit logs of API activities. Contact privacy@elaninsights.io to exercise rights.
            {"\n\n"}
            Users consent to data collection and transfers upon platform use or API connection.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            AML/CFT Commitment
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            As a non-custodial platform, Elan Insights has minimal AML/KYC requirements. We rely on centralized exchanges’ AML/KYC compliance for user accounts. Backend tools monitor for suspicious activity (e.g., connections from sanctioned jurisdictions) to comply with AMLD5, FinCEN, and other laws. We reserve the right to restrict access if illicit activity is detected.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Jurisdictional Considerations
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Users must comply with local laws. Elan Insights complies with laws in the Argentina, Australia, Brazil, Canada, Cayman Islands, Chile, Colombia, El Salvador, Estonia, EU, Georgia, Hong Kong, India, Liechtenstein, Malta, Mexico, Nigeria, Panama, Portugal, Saudi Arabia, Singapore, Switzerland, Thailand, Turkey, UAE, UK, and USA. Users must comply with their jurisdiction’s regulations, including tax and investment laws. Use of Elan Insights by residents of Japan or South Korea is prohibited, regardless of access method (e.g., VPN, Tor). We employ geo-fencing and monitoring to detect and restrict such use, and users found in violation may have their access terminated.
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: "6px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: isDark ? "#fff" : "#000", mb: 1 }}>
            Dispute Resolution
          </Typography>
          <Typography sx={{ color: isDark ? "lightgray" : "#4a4a4a", whiteSpace: "pre-line" }}>
            Disputes are governed by the laws of the Cayman Islands. Any dispute arising out of or relating to this Agreement or the use of Elan Insights will be resolved by binding arbitration in the Cayman Islands, in English, under the rules of the International Chamber of Commerce (ICC). Users waive rights to class actions or jury trials. This section does not limit users’ rights to seek injunctive relief.
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
