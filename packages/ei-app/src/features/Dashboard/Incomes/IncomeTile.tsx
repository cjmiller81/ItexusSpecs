import { PoolApiResponse } from "@/features/Income/Models/PoolApiResponse";
import { fetchFilters } from "@/libs/redux/Slices/AllTokensTableSlice";
import { useAppDispatch } from "@/libs/redux/Store";
import { DataGrid } from "@mui/x-data-grid";
import { nativeBarSx } from "components";
import { FC, useEffect, useMemo } from "react";
import { DashboardTile, DashboardTileProps } from "../DashboardTile";
import { getIncomeTokensColumnsDefs } from "./incomeTokensColumnsDefs";

type Props = Omit<DashboardTileProps, "children"> & {
  data?: PoolApiResponse;
};

export const IncomeTile: FC<Props> = ({ data, loading, ...props }) => {
  const dispatch = useAppDispatch();

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
    <DashboardTile {...props}>
      <DataGrid
        autoHeight
        loading={loading}
        rowHeight={56}
        disableVirtualization
        columnHeaderHeight={25}
        sx={{
          "& .MuiDataGrid-overlay": {
            height: "582px !important",
          },
          "& .MuiDataGrid-main": {
            height: "582px !important",
          },
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
