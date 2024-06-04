import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material"
import { Box, BoxProps, Stack, Theme, styled } from "@mui/system"
import { DataGrid } from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"
import { IvlUser } from "../IvlUser"
import { getOrderColumnsColumns } from "../ordersColumnsDefs"
import { smallTableSx } from "../tableSx"
import UserMetricCard from "./UserMetricCard"
import { Billing } from "./billing"
import { getBillingColumnsDefs } from "./billingColumnsDefs"
import { CapitalAllocation } from "./capitalAllocation"
import { getCapitalAllocationColumnsDefs } from "./capitalAllocationColumnsDefs"
import { Order } from "./order"

type Props = BoxProps & {
  user: IvlUser
  orders: Order[]
  allocations: CapitalAllocation[]
  billings: Billing[]
  theme: Theme
  opened?: boolean
}
export default function UserDetailsSection({ opened, user, orders, allocations, billings, theme, ...props }: Props) {
  const { t } = useTranslation("UserDetailsSection")
  const totalAllocation = allocations.reduce((acc, allocation) => acc + allocation.capitalAllocation, 0)

  const bootStatusColor = user.botStatus === "Active" ? theme.palette.warning.main : theme.palette.success.main
  const bootStatusVariant = user.botStatus === "Active" ? "error" : "success"
  const bootStatusText = user.botStatus === "Active" ? t("StopAutomation") : t("StartAutomation")

  const capitalAllocationCardColor =
    theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main
  const ordersCardColor = theme.palette.mode === "dark" ? theme.palette.warning.dark : theme.palette.warning.light
  const bootStatusCardColor = theme.palette.mode === "dark" ? theme.palette.success.dark : theme.palette.success.main
  return (
    <Box {...props}>
      <StyledMetricsBox>
        <UserMetricCard
          sx={{ backgroundColor: capitalAllocationCardColor }}
          title={t("CapitalAllocation")}
          subtitle={totalAllocation.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}></UserMetricCard>
        <UserMetricCard
          sx={{ backgroundColor: ordersCardColor }}
          title={t("OrdersPlaced")}
          subtitle={orders.length.toString()}></UserMetricCard>
        <UserMetricCard
          sx={{ backgroundColor: bootStatusCardColor }}
          title={t("BootStatus")}
          subtitle={user.botStatus}></UserMetricCard>
      </StyledMetricsBox>

      {opened && (
        <ClosingOnlyBox>
          <Button
            variant="outlined"
            color={bootStatusVariant}
            sx={{ borderColor: bootStatusColor, color: bootStatusColor, maxWidth: "200px" }}>
            {bootStatusText}
          </Button>

          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={t("ClosingOnly")}
          />
        </ClosingOnlyBox>
      )}

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
