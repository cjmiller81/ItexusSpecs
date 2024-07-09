import { ColumnCellTemplateData } from "devextreme/ui/data_grid";
import { FC } from "react";
import { SymbolLookupField } from "../Common/DevExpressTable/SymbolLookupField";
import { PoolData } from "./Models/PoolData";

export const ChainCellComponent: FC<{ data: ColumnCellTemplateData<PoolData> }> = ({ data }) => {
  const url = `${process.env.LAMA_PROJECT_ICONS_URL}/icons/chains/rsz_${data.row.data.chain}?w=48&h=48`;
  return (
    <SymbolLookupField
      key={data.row.data.pool}
      text={data.row.data.chain}
      iconUrl={url}></SymbolLookupField>
  );
};
