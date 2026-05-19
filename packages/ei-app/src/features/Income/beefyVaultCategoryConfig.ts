export const LENDING_PLATFORM_SET = [
  "morpho",
  "aave",
  "euler",
  "curvance",
  "gearbox",
  "sky",
  "neverland",
  "curve-lend",
] as const;

export type LendingPlatform = (typeof LENDING_PLATFORM_SET)[number];

// Build flat OR-chain: [field = v1, "or", field = v2, ...]
function orEquals(field: string, values: readonly string[]): any[] {
  if (values.length === 1) return [field, "=", values[0]];
  const result: any[] = [];
  values.forEach((v, i) => {
    if (i > 0) result.push("or");
    result.push([field, "=", v]);
  });
  return result;
}

// Build flat AND-not-in chain: [field <> v1, "and", field <> v2, ...]
function andNotEquals(field: string, values: readonly string[]): any[] {
  if (values.length === 1) return [field, "<>", values[0]];
  const result: any[] = [];
  values.forEach((v, i) => {
    if (i > 0) result.push("and");
    result.push([field, "<>", v]);
  });
  return result;
}

const lendingFilter = orEquals("platformId", LENDING_PLATFORM_SET);
const notLendingFilter = andNotEquals("platformId", LENDING_PLATFORM_SET);
const oracleTokenFilter = orEquals("oracle", ["tokens", "token"]);

export interface SubCategory {
  label: string;
  filter: any[];
}

export interface MajorCategory {
  label: string;
  filter: any[];
  subCategories: SubCategory[];
}

export const BEEFY_MAJOR_CATEGORIES: MajorCategory[] = [
  {
    label: "Concentrated Liquidity",
    filter: orEquals("strategyTypeId", ["pool", "ichi-solidly"]),
    subCategories: [
      { label: "CLM Pools",     filter: ["strategyTypeId", "=", "pool"] },
      { label: "Managed Range", filter: ["strategyTypeId", "=", "ichi-solidly"] },
    ],
  },
  {
    label: "Liquidity Pools",
    filter: orEquals("strategyTypeId", ["lp", "multi-lp", "compounds"]),
    subCategories: [
      { label: "LP",             filter: ["strategyTypeId", "=", "lp"] },
      { label: "Multi-LP",       filter: [["strategyTypeId", "=", "multi-lp"], "and", ["oracle", "=", "lps"]] },
      { label: "Compounding LP", filter: ["strategyTypeId", "=", "compounds"] },
    ],
  },
  {
    label: "Lending Vaults",
    filter: lendingFilter,
    subCategories: [
      { label: "Curated Lending",   filter: ["platformId", "=", "morpho"] },
      { label: "Money Market",      filter: orEquals("platformId", ["aave", "euler", "curvance", "neverland"]) },
      { label: "Leveraged Lending", filter: orEquals("platformId", ["gearbox", "curve-lend"]) },
      { label: "Stable Savings",    filter: ["platformId", "=", "sky"] },
    ],
  },
  {
    label: "Single-Asset Staking",
    filter: [oracleTokenFilter, "and", notLendingFilter],
    subCategories: [
      {
        label: "Native Staking",
        filter: [[oracleTokenFilter, "and", notLendingFilter], "and", ["strategyTypeId", "<>", "bifi-vault"]],
      },
      { label: "Maxi", filter: ["strategyTypeId", "=", "bifi-vault"] },
    ],
  },
];
