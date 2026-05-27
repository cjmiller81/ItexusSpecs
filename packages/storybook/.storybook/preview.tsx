// Side-effect import: must happen BEFORE any individual ei-app *Api module is
// imported below. The app's Store.ts is the entry point that the ei-app
// dependency graph is wired around — it imports `defisApi`, `dexsApi`,
// `vaultsApi`, `cexApi`, all of which call `axiosBaseQuery()` at module-init
// time, while `axios.ts` (which defines `axiosBaseQuery`) imports Store.ts
// for its response interceptor. The cycle (axios.ts ↔ Store.ts ↔ *Api.ts)
// only resolves cleanly when Store.ts is the first module evaluated, because
// that order lets axios.ts finish (defining `axiosBaseQuery`) before
// DefiApi.ts line 18 calls it. Importing any *Api directly from preview.tsx
// without first triggering Store.ts surfaces this as a TDZ error:
// "Cannot access 'axiosBaseQuery' before initialization".
import "../../ei-app/src/libs/redux/Store";

import type { Preview } from "@storybook/nextjs-vite";
import type { RequestHandler } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider as ReduxProvider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { billingSlice, dexSlice, krakenSlice, reactourSlice, uiSlice, walletsSlice } from "../../components/src/slices";
import type { SettingsFlow } from "@ory/client";
import { OryGatewayContext, type OryContextType } from "../../components/src/features/auth/layouts/OryAuthGateway";
import { defaultBillingHandlers } from "./mocks/billingHandlers";
import { transactionHistoryHandlers } from "../../components/src/storybookMocks/transactionHistoryHandlers";
import { entitledBillingState } from "../../components/src/storybookMocks/subscriptionStoryStates";
import { backendApiServiceHandlers } from "../../ei-app/src/mocks/backendApiServiceHandlers";
import { yieldsHandlers } from "../../ei-app/src/mocks/yieldsHandlers";
import { cryptoNewsHandlers } from "../../ei-app/src/mocks/cryptoNewsHandlers";
import { calendarHandlers } from "../../ei-app/src/mocks/calendarHandlers";
import { tablesHandlers } from "../../ei-app/src/mocks/tablesHandlers";
import { cryptoNewsSlice } from "../../ei-app/src/slices/cryptoNewsSlice";
import { allTokensTableSlice } from "../../ei-app/src/libs/redux/Slices/AllTokensTableSlice";
import {
  calendarEventsApi,
  categoriesEventsApi,
} from "../../ei-app/src/features/Dashboard/CryptoCalendar/calendarApi";
import { dexsApi } from "../../ei-app/src/features/Income/DexApi";
import { vaultsApi } from "../../ei-app/src/features/Income/VaultsApi";
import { chainsApi } from "../../ei-app/src/features/Investing/chainsApi";
import { categoriesApi } from "../../ei-app/src/features/Investing/categoriesApi";
import { exchangesApi } from "../../ei-app/src/features/Investing/exchangesApi";
import { cexApi } from "../../ei-app/src/features/tradeAggregator/TradeTableApi";
import { LifiChainProvider } from "../../ei-app/src/common/lifiChainContext";

/**
 * Storybook-only MUI theme. Mostly needed because some components use
 * `@mui/system`'s `styled` directly (e.g. the NumberInput slot components),
 * and `@mui/system` does NOT fall back to a default theme when no
 * ThemeProvider is present — it passes an empty `{}` theme and any
 * `theme.palette.*` access crashes at render time.
 *
 * `@mui/material/styles`'s `styled` (which the rest of the components use)
 * does fall back to a default theme, so this provider mostly affects the
 * `@mui/system` users — but having it explicit is cleaner.
 *
 * Mode `"dark"` matches the apps' default (uiSlice.initialState.mode).
 */
const storybookTheme = createTheme({
  palette: { mode: "dark" },
});

// Seed handlers in the worker so `resetHandlers()` leaves /api/wallet/* + billing mocks
// active even when a story omits `parameters.msw` (see msw-storybook-addon `applyRequestHandlers`).
//
// `ei-app`-specific handlers (backend API service + DeFi yields) are added so any story
// that mounts an ei-app component can hit those endpoints without bespoke wiring.
// Cast through `RequestHandler[]` because `components` / `ei-app` resolve
// `msw` from the repo-root install while this workspace has its own nested
// copy under `packages/storybook/node_modules/msw`. Both are msw@2.2.x but
// TypeScript treats the two `RequestHandler` classes as nominally distinct,
// producing a "Property 'resolver' is protected …" error at the merge site.
const defaultMswHandlers: RequestHandler[] = [
  ...defaultBillingHandlers,
  ...transactionHistoryHandlers(),
  ...backendApiServiceHandlers,
  ...yieldsHandlers,
  ...cryptoNewsHandlers,
  ...calendarHandlers,
  ...tablesHandlers,
] as RequestHandler[];

initialize({ onUnhandledRequest: "bypass" }, defaultMswHandlers);

/**
 * Storybook-only i18next instance with minimal mock translations.
 * Add to this `resources` object whenever a new storied component uses a
 * `t()` namespace that isn't already covered.
 */
const resources = {
  en: {
    Common: {
      Yes: "Yes",
      No: "No",
      Cancel: "Cancel",
      Save: "Save",
      Delete: "Delete",
      Edit: "Edit",
      Submit: "Submit",
      Selected: "selected",
      ToggleView: "Toggle view",
      Position: "Position",
      Type: "Type",
    },
    MyWalletsSection: {
      AddWalletWeb3: "Add Web3 wallet",
      WalletsWeb3: "Web3 wallets",
      Required: "Required",
      ChainNameRequired: "Account name is required",
      ExchangeNameExists: "That name is already in use",
      NetworkRequired: "Network is required",
      InvalidURL: "Enter a valid URL",
      CustomRPCRequired: "Custom RPC URL is required",
    },
    ColumnsDefs: {
      Token: "Token",
      Chain: "Chain",
      TokenName: "Token name",
      USDValue: "USD value",
      Network: "Network",
      Balance: "Balance",
      Price: "Price",
      Value: "Value",
      ProcentOfPotfolio: "% of portfolio",
      ExchangeAccountName: "Account name",
      Asset: "Asset",
      Amount: "Amount",
      WalletAddress: "Address",
      WalletName: "Label",
      PersonalPublic: "Personal / public",
    },
    WalletDeFiOverview: {
      Supplied: "Supplied",
      Claimable: "Claimable",
    },
    MyWalletsPage: {
      TotalValue: "Total value",
      NFT: "NFT",
      Network: "Network",
      EstimatedValue: "Estimated value",
      OfPortfolio: "% of portfolio",
      Export: "Export",
      HideDust: "Hide dust",
      ShowDust: "Show dust",
      WalletTokens: "Token holdings",
      DeFiPositions: "DeFi positions",
      NFTHoldings: "NFT holdings",
      Positions: "Positions",
      TransactionHistory: "Transaction history",
      ExpandView: "Expand view",
      CollapseView: "Collapse view",
      WalletsHoldingsOverview: "Wallets holdings overview",
      Tokens: "Tokens",
      DeFi: "DeFi",
      NFTs: "NFTs",
    },
    SymbolLookup: {
      Search: "Search",
    },
    CoinsLookup: {
      Search: "Search",
      Coins: "Coins",
      "Top 100 Coins": "Top 100 Coins",
      "Top 300 Coins": "Top 300 Coins",
      "Top 500 Coins": "Top 500 Coins",
      Top100Coins: "Top 100 Coins",
      Top300Coins: "Top 300 Coins",
      Top500Coins: "Top 500 Coins",
    },
    YesNoDialog: {},
    WelcomeModal: {
      Title: "Welcome to Elan Insights",
      IntroText:
        "Thank you for joining the beta. This release lets you explore the analytics platforms, run the trade aggregator against CEX and DEX venues, and try out portfolio tooling end-to-end.",
      AboutBetaTest: "About the beta test",
      UseWebApp: "Use the web app",
      Profile: "Profile",
      AnalyticsPlatforms: "Analytics platforms",
      InvestingDesc: "Browse investing dashboards and saved strategies.",
      IncomeDesc: "Track income flows across CEX and DEX wallets.",
      TradingDesc: "Run trade ideas with full historical context.",
      Tools: "Tools",
      DEXTradeAggregatorDesc: "Quote and execute DEX swaps across LI.FI bridges.",
      CEXTradeAggregatorDesc: "Aggregate CEX order books to find best fills.",
      GiveUsFeedback: "Give us feedback",
      FeedbackDesc1: "Use the in-app survey link to report bugs and friction.",
      FeedbackDesc2: "Reply to founder check-in emails — we read every one.",
      FeedbackDesc3: "Join the beta Discord channel for live discussion.",
      RewardsForYourTime: "Rewards for your time",
      LifetimeDiscount: "Lifetime discount",
      LifetimeDiscountDesc: "Beta participants get a permanent discount on the Pro plan.",
      BetaTesterBadge: "Beta tester badge",
      BetaTesterBadgeDesc: "A visible badge on your profile that signals early support.",
      FreeTrial: "Extended free trial",
      FreeTrialDesc: "An extra month of Pro tier on us at the end of the beta.",
      ThankYouMessage: "Thank you for helping shape Elan Insights.",
      FounderSignature: "— The Elan team",
      CloseButton: "Got it",
    },
    UserMenu: {
      Profile: "Profile",
      Logout: "Log out",
    },
    SessionWatcher: {
      SessionExpiringSoon: "Session expiring soon",
      YourSessionWillAutomaticallyExpireIn: "Your session will automatically expire in",
      UseRENEWButtonInTheTop: "Use the RENEW button in the top bar to extend your session.",
    },
    SecurityContainer: {
      ChangePassword: "Change password",
      NewPassword: "New password",
      EnterPassword: "Enter a new password",
      ChangePasswordWarning: "Please change your password before continuing.",
      VerificationCode: "Verification code",
      UnlinkTotp: "Unlink authenticator",
      NewPasswordMessage: "Your password has been updated.",
      ApplicationLinked: "Authenticator app linked.",
      ApplicationUnlinked: "Authenticator app unlinked.",
      ElanInsightsRequires: "Elan Insights supports password managers like",
      AndGoogleApp: "and authenticator apps such as Google Authenticator",
      AddAuthenticatorApp: "Add authenticator app",
    },
    ProfileContainer: {
      FirstName: "First name",
      LastName: "Last name",
      Email: "Email",
      ChangeDetails: "Save changes",
    },
    PaymentTabs: {
      Card: "Card",
      ApplePay: "Apple Pay",
      GooglePay: "Google Pay",
      Crypto: "Crypto",
    },
    BillingContainer: {
      CardEnding: "Card ending in {{number}}",
      Default: "Default",
      MakeDefault: "Make default",
      NoPaymentMethods: "No payment methods on file",
      PaymentMethods: "Payment methods",
      AddPayment: "Add payment",
      Plans: "Plans",
      DeleteCardDialogTitle: "Delete card?",
      DeleteCardDialogContent: "This card will be detached from your account.",
      CancelPlanTitle: "Cancel subscription",
      CancelPlanConfirmText: "Are you sure you want to cancel your current subscription plan?",
      NoDefaultCardError: "You need a default card on file to subscribe.",
      PaymentError: "Payment failed — please try again.",
      PaymentSuccess: "Payment succeeded.",
      PaymentRequiresAction: "Additional verification required.",
      PaymentPending: "Payment pending — we'll email when it clears.",
      PlanUpgraded: "Plan upgraded.",
      PlanDowngraded: "Plan downgraded.",
      PlanAlreadyActive: "That plan is already active.",
      PlanChangeError: "We couldn't change your plan — please try again.",
      DefaultCardUpdated: "Default card updated.",
      DefaultCardUpdateError: "We couldn't update your default card.",
      CardAddedMessage: "Card added.",
      CardDeletedMessage: "Card removed.",
      CardDeleteErrorMessage: "We couldn't remove that card.",
      CardEditedMessage: "Card updated.",
      PlanCancelled: "Subscription canceled.",
      PlanCancelError: "We couldn't cancel your subscription — please try again.",
      No: "No",
      Yes: "Yes, cancel plan",
    },
    BillingPlan: {
      SelectThisPlan: "Select this plan",
      CurrentPlan: "Current plan",
      Upgrade: "Upgrade",
      SwitchToPlan: "Switch to this plan",
      BilledYearly: "Billed yearly",
      BilledMonthly: "Billed monthly",
      ContactUs: "Contact us",
      SwitchPlanConfirmText: "Are you sure you want to switch to this subscription plan?",
      CancelPlan: "Cancel plan",
      Yes: "Yes, switch plan",
      No: "No",
    },
    PaymentMethodSelector: {
      Title: "Add a payment method",
      ComingSoon: "This payment method is coming soon.",
    },
    TotalWalletsWorthCard: {
      TotalWalletWorth: "Total wallets worth",
    },
    BrokerageConnectionContainer: {
      ConnectToSchwab: "Connect to Schwab",
      ConnectedToSchwab: "Connected to Schwab",
      Disconnect: "Disconnect",
      AuthorizedForTrading: "Authorized for trading",
      AuthorizationExpires: "Authorization expires",
      Reauthorize: "Re-authorize",
      AccountNumber: "Account number",
      Status: "Status",
    },
    ory: {
      expiredForm: {
        text: {
          loginFormExpired: "This login form has expired!",
        },
        button: {
          refresh: "Refresh page to login again",
        },
      },
    },
    Tooltips: {
      Password: "Use at least 8 characters, mixing letters, numbers, and symbols.",
      Required: "Required",
      PublicEye: "Public — visible to followers",
    },
    ErrorMessages: {
      mandatoryField: "This field is required",
      invalidFormat: "Must be a valid 0x-prefixed address (42 characters).",
      incorectPassword: "Password must be at least 8 characters",
      MaxFieldLengthError: "Maximum {{symbols}} characters",
    },
    ProfilePicture: {
      UploadChangeImage: "Upload or change your profile image",
      ImageFormat: "JPG or PNG, square aspect ratio works best",
      FileSizeLimit: "Up to 2 MB",
      UploadAvatar: "Upload avatar",
    },
    HistoricalWalletsWorth: {
      FromDate: "From",
      ToDate: "To",
      Period: "Period",
      Daily: "Daily",
      Weekly: "Weekly",
      Monthly: "Monthly",
      CompareToSymbol: "Compare to symbol",
      Sumbit: "Submit",
      Growth: "Growth",
      Value: "Value",
    },
    WalletInputModal: {
      AddNewWallet: "Add new wallet",
      CreateWalletName: "Wallet name",
      EnterWalletName: "e.g. Main trading",
      InputWalletAddress: "Wallet address",
      ExampleWallet: "0x0000000000000000000000000000000000000001",
      WalletAddressAlreadyInTheList: "This address is already in your list.",
      WalletType: "Wallet type",
      Personal: "Personal",
      YourWallet: "Your wallet",
      Model: "Model / watchlist",
      Following: "Following",
      AddingYourOwnWallet: "You control this wallet.",
      FollowingWallet: "Track someone else's address.",
    },
    Support: {
      FrequentlyAskedQuestions: "Frequently asked questions",
      WhatIsElanInsights: "What is Elan Insights?",
      ElanInsightsIs:
        "Elan Insights is a non-custodial SaaS platform for cryptocurrency analytics and decision modelling.",
      IsElanInsightsRegulatedFinancialEntity: "Is Elan Insights a regulated financial entity?",
      ElanInsightsIsNonCustodialSaaS:
        "No — Elan Insights is a non-custodial SaaS provider. We don't custody funds and we don't act as a broker, dealer, or adviser.",
      HowDoesPlatformEnsure: "How does the platform ensure my assets are safe?",
      NonCustodialElanInsights:
        "We never have custody of your assets. Web3 wallet connections are read-only via the in-browser provider; CEX integrations only use view-only API keys.",
      WhatTheTradeAggregatorTool: "What does the trade aggregator do?",
      ThisToolAnalyzesMarketData:
        "It analyses market data across DEXes and CEXes to surface candidate routes; you initiate and sign every trade in your own wallet/exchange.",
      WhatTokensExchangesAreSupported: "Which tokens and exchanges are supported?",
      AllTokensListedOnCoinGecko:
        "All tokens listed on CoinGecko plus the exchanges integrated via 1inch, LI.FI, and the major CEX APIs.",
      HowIsMyDataProtected: "How is my data protected?",
      MinimalDataIsColleted:
        "We collect the minimum data needed: anonymised usage telemetry, wallet addresses you connect, and your subscription metadata. Everything is encrypted at rest and in transit.",
      WhatAreMyPrivacyRights: "What are my privacy rights?",
      UsersCanAccess: "You can access, correct, delete, and port your data; see the Privacy notice for the full list.",
      HowDoesElanInsightsHandle: "How does Elan Insights handle market data?",
      ItReliesOn: "It relies on third-party feeds (CoinGecko, exchange APIs, LI.FI) and reports them as-is.",
      WhatRisks: "What risks should I be aware of?",
      CryptoInvestments:
        "Crypto investments carry significant volatility risk; analytics and simulations are informational only and don't predict future returns.",
      IsElanInsights: "Is Elan Insights able to move my funds?",
      NoAccessIs:
        "No — there is no path for the platform to move or sign on your behalf. All transactions are signed in your own wallet / on the exchange.",
      HowAreUpdatesTo: "How are updates communicated?",
      NotificationsAreSentVia: "Notifications are sent via email and in-app alerts.",
      WhoCanIContact: "Who can I contact for help?",
      Emails: "Email support@elaninsights.io for support, privacy@elaninsights.io for privacy.",
    },
    CalendarEventTile: {},
    CryptoCalendar: {
      Coins: "Coins",
      Category: "Category",
      "NoMoreСurrentEventsForThisDate": "No upcoming events for this date range.",
    },
    WalletWorthTile: {
      WalletsPerformance: "Wallets performance",
      GoToFullPage: "Go to full page",
      Growth: "Growth",
      Value: "Value",
    },
    CustomDateSelector: {
      From: "From",
      To: "To",
      SelectDateRange: "Select date range",
      Next7days: "Next 7 days",
      Next30days: "Next 30 days",
    },
    NewPositionSection: {
      GetBestRoutes: "Get best routes",
      DEXChooser: "DEX chooser",
      BestRoutes: "Best routes",
      AutomaticallyDiscovers: "Automatically discovers optimal swap paths across every supported DEX.",
      ConsidersPriceImpact: "Considers price impact and slippage on each candidate hop.",
      RealTimeMarketOptimization: "Re-optimises in real time as on-chain liquidity moves.",
      DEXChooserWithIcon: "DEX chooser (manual)",
      SelectUpToSpecificDEXs: "Pick up to a handful of DEXes you want to compare side by side.",
      ChosenExchangesRankedByPerformance: " Chosen exchanges are ranked by recent fill quality.",
      TargetedDEXComparison: "Useful for venue-specific allowlists and bench-marking.",
      SideBySidePerformanceAnalysis: "Surfaces price + slippage for every selected venue at once.",
    },
    LiquidityPoolsPage: {
      PageTitleLiquidityPools: "Liquidity pools",
      PrefilterLiquidityPools: "Prefilter liquidity pools",
      Export: "Export",
    },
    Vaults: {
      VaultsPageTitle: "Yield vaults",
      VaultsTitle: "Yield vaults",
      Export: "Export",
    },
    PrefilterTokensSection: {
      MarketCapTokens: "Market-cap tokens",
      EqualWeightTokens: "Equal-weight tokens",
      Export: "Export",
    },
    Header: {
      ElanInsights: "Elan Insights",
    },
    CustomFilterBuilder: {
      DeleteDialogTitle: "Delete filter",
      ApplyFilter: "Apply filter",
      BuildStrategyFilter: "Build a Strategy Filter",
      ClearFilter: "Clear Filter",
      SelectFilter: "Select pre-built filter:",
      SaveFilterAs: "Save filter as:",
      FilterTokens: "Filter Tokens",
      DeleteDialogContent:
        "This will fully delete your pre-built filter, are you sure you want to proceed?",
      FilterBuilderTrainingVideos: "Filter Builder Training Videos",
      IntroductionVideo: "Introduction Video",
      HowBuildFilter: "How to Build a Filter",
      HowBuildLogicGate: "About Each Logic Gate",
      FilterBuilderIntroGuide: "Filter Builder Intro",
      BuildingNORGate: "Building the NOR Gate",
      BuildingNANDGate: "Building the NAND Gate",
      BuildingORGate: "Building the OR Gate",
      BuildingANDGate: "Building the AND Gate",
      LogicGateDiagramAND: "About the AND Gate",
      LogicGateDiagramNOTAND: "About the NOT And (NAND) Gate",
      LogicGateDiagramNORGate: "About the OR Gate",
      LogicGateDiagramOR: "About the Not Or (NOR)",
      ClickTheButtonToAddYourFirstFilterCondition:
        "Click the + button to add your first filter condition. See videos below for more guidance.",
    },
    IndexModelingSection: {
      SelectService: "Select exchange",
      AddCentralizedExchangeConnection: "Add centralized exchange connection",
      Connections: "Connections",
      ActiveConnections: "Active connections",
      SelectConnection: "Select a connection",
      AddNewConnection: "Add a new connection",
      AddConnection: "Add connection",
      AddExchange: "Add exchange",
      AddWallet: "Add wallet",
      AddDefiProtocol: "Add DeFi protocol",
      ConnectExchange: "Connect exchange",
      ConnectWallet: "Connect wallet",
      DefiProtocol: "DeFi protocol",
      Required: "Required",
      InvalidURL: "Enter a valid URL",
      NetworkRequired: "Network is required",
      CustomRPCRequired: "Custom RPC URL is required",
      Network: "Network",
      CustomRPCURL: "Custom RPC URL",
      "SelectService*": "Select service*",
      "APIKey*": "API key*",
      "APISecret*": "API secret*",
      APIPassphrase: "API passphrase",
      APISecret: "API secret",
      PleaseEnsureYouHaveTheNecessary:
        "Ensure your wallet network details are correct before connecting.",
      WalletCapital: "Wallet capital",
      DeploymentCapital: "Deployment capital",
      SelectSavedWallet: "Pick a saved wallet from the list before switching to wallet capital.",
      ConnectNewWalletAddress: "Connect a wallet address to get started",
      YouHaveNotSavedWalletAddress:
        "You haven't saved a wallet address yet. Add one to load DeFi positions, balances, and tracked tokens.",
      AddYourFirstWallet: "Add your first wallet",
      AddSavedWalletFromYourWalletList: "Pick a saved wallet from your list",
      ToViewYourWalletPositionsSelectSavedWallet:
        "Select one of your saved wallets above to load its positions into this table.",
      Kraken: "Kraken",
      Coinbase: "Coinbase",
      ConnectCoinbaseExchange: "Connect Coinbase",
      ConnectKrakenExchange: "Connect Kraken",
      AddCustomExchangeAccountName: "Account label",
      ExchangeAccountName: "e.g. My Kraken",
      PleaseEnsureYouHaveTheNecessaryCoinbase:
        "Ensure Coinbase API access is enabled for your account before connecting.",
      PleaseEnsureYouHaveTheNecessaryKraken:
        "Ensure Kraken API keys are created with the correct permissions before connecting.",
      APIKey: "API key",
      PrivateAPIKey: "Private API key",
      Cancel: "Cancel",
      Connect: "Connect",
      Save: "Save",
      ExchangeNameAlreadyExists: "That account name is already in use.",
      KrakenAPIInstructions: "Kraken API setup",
      OnceLoggedIntoKraken: "After you log in to Kraken, open your account settings.",
      ThenClickSetting: "Create a new API key with query and trading permissions.",
      NextFillInTheForm: "Copy the public and private keys into the form below.",
      BeSureToCopyPasteEachAPIKeys: "Paste each key exactly — no extra spaces.",
      IMPORTANTBeSure: "Important: restrict the key to this app only if your workflow allows.",
    },
    AccessControl: {
      "Loading subscription details...": "Loading subscription details…",
      "Upgrade Plan": "Upgrade plan",
      "This feature is not available in your current plan": "This feature is not available in your current plan",
      "Table export is not available in {{plan}} plan": "Table export is not available in the {{plan}} plan",
      "DEX quote requests are not available in {{plan}} plan":
        "DEX quote requests are not available in the {{plan}} plan",
      "You have reached the limit of {{limit}} saved strategies for {{plan}} plan":
        "You have reached the limit of {{limit}} saved strategies for the {{plan}} plan",
      "You have reached the limit of {{limit}} saved {{filterType}} strategies for {{plan}} plan":
        "You have reached the limit of {{limit}} saved {{filterType}} strategies for the {{plan}} plan",
      "You have reached the limit of {{limit}} {{type}} wallet connections for {{plan}} plan":
        "You have reached the limit of {{limit}} {{type}} wallet connections for the {{plan}} plan",
    },
  },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    resources,
  });
}

/**
 * Storybook-only Redux store. Combines every slice the apps use so that any
 * component pulling state via useAppSelector resolves to a real reducer.
 *
 * A fresh store is created per story render so state doesn't leak between
 * stories. Stories can preload slice state via `parameters.reduxState`:
 *
 *   parameters: { reduxState: { ui: { accordions: { foo: true }, ... } } }
 *
 * Note that preloadedState replaces an entire slice (not deep-merged), so
 * stories must provide the full slice shape they want to set.
 */
const storybookReducer = combineReducers({
  ui: uiSlice.reducer,
  wallets: walletsSlice.reducer,
  kraken: krakenSlice.reducer,
  billing: billingSlice.reducer,
  dex: dexSlice.reducer,
  reactour: reactourSlice.reducer,
  // ei-app-only slices/APIs needed by Dashboard tile + calendar stories.
  cryptoNews: cryptoNewsSlice.reducer,
  [calendarEventsApi.reducerPath]: calendarEventsApi.reducer,
  [categoriesEventsApi.reducerPath]: categoriesEventsApi.reducer,
  // Income / Investing tables read saved CustomFilterBuilder filters from
  // this slice. Storybook seeds it empty by default — stories that need
  // pre-populated filters override via parameters.reduxState.allTokensTable.
  allTokensTable: allTokensTableSlice.reducer,
  [dexsApi.reducerPath]: dexsApi.reducer,
  [vaultsApi.reducerPath]: vaultsApi.reducer,
  [chainsApi.reducerPath]: chainsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
  [exchangesApi.reducerPath]: exchangesApi.reducer,
  // Trade-aggregator (CEX / TradeTable / ArbitrageMatrix) endpoints —
  // /exchanges, /api/countries, /trading-pairs, etc.
  [cexApi.reducerPath]: cexApi.reducer,
});

type StorybookRootState = ReturnType<typeof storybookReducer>;

// Each slice key is optional, but if provided must be the full slice shape
// because RTK preloadedState replaces (does not deep-merge) slice state.
export type StorybookPreloadedState = Partial<StorybookRootState>;

const makeStorybookStore = (preloadedState?: StorybookPreloadedState) =>
  configureStore({
    reducer: storybookReducer,
    preloadedState: preloadedState as StorybookRootState | undefined,
    // RTK Query needs its middleware registered to drive lifecycle/caching.
    // `serializableCheck: false` because the ei-app slices store Date objects
    // and other non-serializable values that the default middleware flags.
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        calendarEventsApi.middleware,
        categoriesEventsApi.middleware,
        dexsApi.middleware,
        vaultsApi.middleware,
        chainsApi.middleware,
        categoriesApi.middleware,
        exchangesApi.middleware,
        cexApi.middleware,
      ),
  });

/**
 * Storybook-only Ory context. Real production callers go through
 * `OryAuthGateway`, but stories don't want to spin up a real Ory SDK.
 * The default below gives every story a logged-in session that expires
 * 1 hour from render time, plus async no-op stubs for every callback
 * so components that fire-and-forget calls (e.g. SessionWatcher
 * triggering logOut) don't crash.
 *
 * Stories can override individual fields via `parameters.oryContext`:
 *
 *   parameters: {
 *     oryContext: {
 *       session: { expires_at: new Date(Date.now() + 60_000).toISOString() },
 *     },
 *   }
 *
 * Overrides shallow-merge into the default — provide only what you need.
 */
const makeDefaultOryContext = (): OryContextType => ({
  // `as unknown as Session` keeps the mock skinny — components only read
  // `expires_at` and `identity.traits.*`, so we don't need the full @ory/client
  // type surface to satisfy the consumers we story.
  session: {
    id: "storybook-session",
    active: true,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    identity: {
      id: "storybook-identity",
      traits: {
        email: "demo@example.com",
        name: { first: "Demo", last: "User" },
        avatarUrl: "",
        newsletter: false,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  settingsFlow: undefined,
  logOut: async () => {},
  renewSession: async () => {},
  refreshSession: async () => {},
  onUpdateProfile: async () => {},
  // Minimal stub so consumers that call createSettingsFlow() in an effect
  // (e.g. PasswordResetModal opening) resolve cleanly. Stories that need a
  // populated UI flow (e.g. CSRF tokens) should override this via
  // parameters.oryContext.
  // Deliberately partial object — same idea as the `session` mock above.
  createSettingsFlow: async (): Promise<SettingsFlow> =>
    ({ id: "storybook-settings-flow", ui: { nodes: [] } }) as unknown as SettingsFlow,
  onChangePassword: async () => {},
  onUpdateAvatar: async () => {},
  onTotpSubmit: async () => {},
  onTotpUnlink: async () => {},
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    // Default MSW handler set. Covers the billing service endpoints
    // (`/api/billing/*`), the API-usage tracker
    // (`/api/request-tracking/status`), and the ei-app backend service
    // + DeFi yields endpoints. Stories that want a different response
    // for a specific endpoint override it by re-declaring
    // `parameters.msw.handlers` with the matching path — MSW resolves
    // the last-registered handler first, so per-story overrides win.
    msw: {
      handlers: defaultMswHandlers,
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story, { parameters }) => {
      // Default `billing` to a fully-entitled subscription so any story
      // using `useSubscription` / `FeatureAccessGuard` / `PageAccessGuard`
      // renders the happy path. Stories that want the gated branch
      // (e.g. the conventional `Restricted` variant) override with
      // `parameters.reduxState.billing = unentitledBillingState`.
      const preloadedState = {
        ...(parameters.reduxState ?? {}),
        billing: parameters.reduxState?.billing ?? entitledBillingState,
      };
      const store = makeStorybookStore(preloadedState);
      const oryContext: OryContextType = {
        ...makeDefaultOryContext(),
        ...(parameters.oryContext ?? {}),
      };
      return (
        <ReduxProvider store={store}>
          <ThemeProvider theme={storybookTheme}>
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <OryGatewayContext.Provider value={oryContext}>
                  {/*
                   * LiFi chain provider so any trade-aggregator story can
                   * read `useLifiChainMap()` without wiring its own provider.
                   * Hits `/api/lifi/chains` once on mount — already mocked
                   * by `tablesHandlers`. Components handle the brief null
                   * window before the request resolves.
                   */}
                  <LifiChainProvider>
                    <Story />
                  </LifiChainProvider>
                </OryGatewayContext.Provider>
              </LocalizationProvider>
            </I18nextProvider>
          </ThemeProvider>
        </ReduxProvider>
      );
    },
  ],
};

export default preview;
