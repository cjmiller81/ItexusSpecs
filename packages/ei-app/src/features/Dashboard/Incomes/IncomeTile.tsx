import { PoolApiResponse } from "@/features/Income/Models/PoolApiResponse";
import { fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch } from "@/libs/redux/Store";
import { DataGrid } from "@mui/x-data-grid";
import { nativeBarSx } from "components";
import { FC, useEffect, useMemo } from "react";
import { DashboardTile, DashboardTileProps } from "../DashboardTile";
import { getIncomeTokensColumnsDefs } from "./incomeTokensColumnsDefs";
import { useTheme } from "@mui/material";

type Props = Omit<DashboardTileProps, "children"> & {
  data?: PoolApiResponse;
};

export const IncomeTile: FC<Props> = ({ data, loading, ...props }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const rows = useMemo(() => {
    const coins = data ? data.data : [];
    const copy = coins.slice();
    copy.sort((a, b) => b?.tvlUsd - a?.tvlUsd);
    return copy.slice(0, 10);
  }, [data]);

  useEffect(() => {
    dispatch(fetchFilters({}));
  }, [dispatch]);

  return (
    <DashboardTile
      loading={loading}
      sectionLink={{
        href: "/liquidity_pools",
        text: "Go to full page"
      }}
      {...props}>
      <DataGrid
        autoHeight
        loading={loading}
        rowHeight={56}
        disableVirtualization
        columnHeaderHeight={25}
        sx={{
          backgroundColor:
      theme.palette.mode === "dark"
        ? "transparent !important"
        : "#fff !important",
          "& .MuiDataGrid-overlay": {
            height: "582px !important",
          },
          "& .MuiDataGrid-main": {
            height: "582px !important",
          },
          borderColor: "rgba(0, 0, 0, 0.12)",
          ...tableScrollSx,
        }}
        slots={{
          footer: () => <></>,
        }}
        rowSelection={false}
        checkboxSelection={false}
        getRowId={x => x.pool}
        columns={getIncomeTokensColumnsDefs()}
        rows={rows}
      />
    </DashboardTile>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};
