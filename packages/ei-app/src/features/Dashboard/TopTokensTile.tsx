import { DataGrid } from "@mui/x-data-grid"
import { FC } from "react"
import { DashboardTile, DashboardTileProps } from "./DashboardTile"
import { getTopTokensColumnsDefs } from "./TopTokensColumnsDefs"

type Props = Omit<DashboardTileProps, "children"> & {
  tableAssets: TopTokenData[] | null
}

export type TopTokenData = {
  id: string
  symbol: string
  price: number
  marketCap: number
  iconUrl?: string
  tokenId: string
  fulDilVal: number
}

export const TopTokensTile: FC<Props> = ({ title, icon, tableAssets, ...props }) => {
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <DataGrid
        rowHeight={35}
        columnHeaderHeight={25}
        sx={{
          minHeight: "375px",
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
  )
}
