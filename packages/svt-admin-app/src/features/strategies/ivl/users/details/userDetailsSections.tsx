import { Typography } from "@mui/material"
import { Box, BoxProps, Stack, Theme, styled } from "@mui/system"
import { DataGrid } from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"
import { IvlUser } from "../IvlUser"
import { getOrderColumnsColumns } from "../ordersColumnsDefs"
import { smallTableSx } from "../../../shared/tableSx"
import { Billing } from "./billing"
import { getBillingColumnsDefs } from "./billingColumnsDefs"
import { CapitalAllocation } from "./capitalAllocation"
import { getCapitalAllocationColumnsDefs } from "./capitalAllocationColumnsDefs"
import { Order } from "./order"
import { Bot } from "./bot"
import { getBotColumnsDefs } from "./botsColumnsDefs"

type Props = BoxProps & {
  user: IvlUser
  orders: Order[]
  bots: Bot[]
  allocations: CapitalAllocation[]
  billings: Billing[]
  theme: Theme
  opened?: boolean
}
export default function UserDetailsSection({ opened, user, orders, allocations, billings, bots, theme, ...props }: Props) {
  const { t } = useTranslation("UserDetailsSection")

  console.warn(bots)
  const handleStopClick = () => {};
  const handleStartClick = () => {};
  const handleResetClick = () => {};

  return (
    <Box {...props}>
      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("Bots")}
      </Typography>  
      <DataGrid<Bot>
        slots={{
          footer: () => <></>,
        }}
        sx={{
          ...smallTableSx,
          "& .MuiDataGrid-cell[data-field=startBot]": {
            paddingTop: "0px",
            paddingBottom: "0px",
          },
        }}
        rows={bots}
        rowHeight={25}
        isCellEditable={() => false}
        columns={getBotColumnsDefs(handleStartClick, handleStopClick, handleResetClick)}
        editMode="row"
        getRowId={row => row.userId}
      />
      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("Orders")}
      </Typography>
      <Stack>
        <DataGrid<Order>
          slots={{
            footer: () => <></>,
          }}
          sx={smallTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={orders}
          rowHeight={25}
          isCellEditable={() => false}
          columns={getOrderColumnsColumns()}
          getRowId={row => row.id}
        />
        <Typography
          mt={2}
          align="center"
          variant="h6">
          {t("Billings")}
        </Typography>
        <DataGrid<Billing>
          slots={{
            footer: () => <></>,
          }}
          sx={smallTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={billings}
          rowHeight={25}
          isCellEditable={() => false}
          columns={getBillingColumnsDefs()}
          editMode="row"
          getRowId={row => row.id}
        />
        <Typography
          mt={2}
          align="center"
          variant="h6">
          {t("CapitalAllocation")}
        </Typography>
        <DataGrid<CapitalAllocation>
          slots={{
            footer: () => <></>,
          }}
          sx={smallTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={allocations}
          rowHeight={25}
          isCellEditable={() => false}
          columns={getCapitalAllocationColumnsDefs()}
          editMode="row"
          getRowId={row => row.id}
        />
      </Stack>
    </Box>
  )
}

export const StyledMetricsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}))

export const ClosingOnlyBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
  },
}))
