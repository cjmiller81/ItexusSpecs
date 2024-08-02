export const toDollarsAmountField = (value?: number | null) => {
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

export const toDollarAmountField = (cellInfo: any) => {
  const { value } = cellInfo;
  return toDollarsAmountField(value);
};

export const toPoolCellField = ({ data }) => {
  return data.row.data.poolMeta ? `${data.value} (${data.row.data.poolMeta})` : data.value;
};

export const toPercentageField = (cellInfo: any) => {
  const { value } = cellInfo;
  if (!value) return "";
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};
