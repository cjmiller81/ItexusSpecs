import { DataGrid } from "@mui/x-data-grid";
import { FC } from "react";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";
import { getTopTokensColumnsDefs } from "./TopTokensColumnsDefs";
import { useTheme } from "@mui/material";

type Props = Omit<DashboardTileProps, "children"> & {
  tableAssets: TopTokenData[] | null;
};

export type TopTokenData = {
  id: string;
  symbol: string;
  price: number;
  marketCap: number;
  iconUrl?: string;
  tokenId: string;
  fulDilVal: number;
};

export const TopTokensTile: FC<Props> = ({ title, icon, tableAssets, loading, ...props }) => {
  const theme = useTheme();
  return (
    <DashboardTile
      title={title}
      icon={icon}
      loading={loading}
      {...props}>
      <DataGrid
        loading={loading}
        rowHeight={35}
        columnHeaderHeight={25}
        sx={{
          borderColor: "rgba(0, 0, 0, 0.12)",
          backgroundColor:
              theme.palette.mode === "dark"
                ? "transparent !important"
                : "#fff !important",
          minHeight: "413px",
          "& .MuiDataGrid-main": {
            minHeight: "375px !important",
            height: "375px !important",
          },
        }}
        slots={{
          footer: () => <></>,
        }}
        rowSelection={false}
        checkboxSelection={false}
        getRowId={x => x.id}
        columns={getTopTokensColumnsDefs()}
        rows={tableAssets || []}
      />
    </DashboardTile>
  );
};
