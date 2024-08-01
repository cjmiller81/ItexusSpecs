export const formatTVL = (value?: number | null) => {
  if (!value) return "";
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `$${billions.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}b`;
  } else if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}m`;
  } else {
    return `$${value.toLocaleString()}`;
  }
};
