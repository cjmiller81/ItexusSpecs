import type { Preview } from "@storybook/nextjs-vite";
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
initialize(
  { onUnhandledRequest: "bypass" },
  [...defaultBillingHandlers, ...transactionHistoryHandlers()],
);

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
    IndexModelingSection: {
      SelectService: "Select exchange",
      AddCentralizedExchangeConnection: "Add centralized exchange connection",
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
});

type StorybookRootState = ReturnType<typeof storybookReducer>;

// Each slice key is optional, but if provided must be the full slice shape
// because RTK preloadedState replaces (does not deep-merge) slice state.
export type StorybookPreloadedState = Partial<StorybookRootState>;

const makeStorybookStore = (preloadedState?: StorybookPreloadedState) =>
  configureStore({
    reducer: storybookReducer,
    preloadedState: preloadedState as StorybookRootState | undefined,
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
    // Default MSW handler set for the billing service endpoints
    // (`/api/billing/*`) and the API-usage tracker
    // (`/api/request-tracking/status`). Stories that want a different
    // response for a specific endpoint override it by re-declaring
    // `parameters.msw.handlers` with the matching path — MSW resolves the
    // last-registered handler first, so per-story overrides win.
    msw: {
      handlers: [...defaultBillingHandlers, ...transactionHistoryHandlers()],
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story, { parameters }) => {
      const store = makeStorybookStore(parameters.reduxState);
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
                  <Story />
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
