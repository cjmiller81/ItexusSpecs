import { 
  LIQUIDITY_POOL,
  PREFILTER_TAB_KEYS,
  PREFILTER_CATEGORIES_MAP,
  CATEGORY_NAME_MAPPING
} from "@/constants/prefilterKeys";
import { PrefilterCategories, PrefilterTabs } from "@/types/filter";

export const generateFilterKey = (
  filterType: string | null,
  tab: `${PrefilterTabs}` | undefined,
  category: `${PrefilterCategories}` | string | undefined
) => {
  if (!tab || filterType !== LIQUIDITY_POOL) {
    return null;
  }

  // TODO: Decide what to do with "All X" categories. By default we don't add a specific logic for it
  if (tab === PrefilterTabs.ALL_DEFI) {
    return filterType;
  }

  if (!category) {
    return null;
  }

  if (category.startsWith('All')) {
    return `${filterType}-all-${PREFILTER_TAB_KEYS[tab]}`;
  }

  const formattedCategory = CATEGORY_NAME_MAPPING[category] ?? category;
  return `${filterType}-${PREFILTER_TAB_KEYS[tab]}-${PREFILTER_CATEGORIES_MAP[tab][formattedCategory]}`;
};
