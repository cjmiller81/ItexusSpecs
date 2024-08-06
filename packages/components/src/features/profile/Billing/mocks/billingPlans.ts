import { getTranslator } from "../../../../lib";
import { BillingPlan, PermissionItem } from "../components/BillingPlan";

const T = getTranslator("BillingPlans");
const getDefaultPlans = (wallets: string, chains: string, priceUpdates: string, apiCalls: string): PermissionItem[] => {
  return [
    {
      permission: T("WalletConnections"),
      permissionValue: wallets,
      isEnabled: true,
    },
    {
      permission: T("WalletChainsSupported"),
      permissionValue: chains.toString(),
      isEnabled: true,
    },
    {
      permission: T("PriceUpdates"),
      permissionValue: priceUpdates,
      isEnabled: true,
    },
    {
      permission: T("ApiCalls"),
      permissionValue: apiCalls,
      isEnabled: true,
    },
  ];
};

export const billingPlans: BillingPlan[] = [
  {
    planName: T("Basic"),
    price: 19,
    plans: getDefaultPlans("1", "2", T("PerDay"), T("TotalApiCalls", {calls: "100,000"})),
  },
  {
    planName: T("Standart"),
    price: 49,
    plans: getDefaultPlans(T("UpTo", { times: 5 }), "4", T("PerHour"), T("TotalApiCalls", {calls: "200,000"})),
  },
  {
    planName: T("Premium"),
    price: 99,
    plans: getDefaultPlans(T("UpTo", { times: 10 }), "10", T("EveryMinutes", { minutes: 10 }), T("TotalApiCalls", {calls: "500,000"})),
  },
  {
    planName: T("Enterprise"),
    isCustomPricing: true,
    plans: getDefaultPlans(T("Unlimited"), T("Unlimited"), T("RealTimeData", { minutes: 10 }), T("Unlimited")),
  },
];
