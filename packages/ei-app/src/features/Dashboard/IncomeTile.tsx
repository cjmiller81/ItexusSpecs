import { Box } from "@mui/system"
import { FC } from "react"
import { DashboardTile, DashboardTileProps } from "./DashboardTile"

type Props = Omit<DashboardTileProps, "children"> & {}

export const IncomeTile: FC<Props> = ({ title, icon, ...props }) => {
  return (
    <DashboardTile
      title={title}
      icon={icon}
      {...props}>
      <Box sx={{ height: "584px" }}></Box>
    </DashboardTile>
  )
}
