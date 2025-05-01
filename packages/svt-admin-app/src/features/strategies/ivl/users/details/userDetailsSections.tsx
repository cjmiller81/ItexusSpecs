import { Typography } from "@mui/material";
import { Box, BoxProps, Stack, SxProps, Theme, styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { IvlUser } from "../IvlUser";
import { adaptiveHeightTableSx } from "../../../shared/tableSx";
import { Billing } from "./billing";
import { getBillingColumnsDefs } from "./billingColumnsDefs";
import { CapitalAllocation } from "./capitalAllocation";
import { getCapitalAllocationColumnsDefs } from "./capitalAllocationColumnsDefs";
import { Order } from "./order";
import { Bot } from "./bot";
import { getBotColumnsDefs } from "./botsColumnsDefs";
import UserMetricCard from "./UserMetricCard";
import { OpenPosition } from "./openPosition";
import { useMemo } from "react";
import { formatCurrencyToString } from "@/utils/common";
import { getOpenPositionColumns } from "./openPositionColumnsDefs";
import { ICurrentDayFills } from "./currentDayFillsInterface";
import { getCurrentDayFillsColumns } from "./currentDayFillsColumnsDefs";
import { IWorkingOrder } from "./workingOrderInterface";
import { getWorkingOrdersColumns } from "./workingOrdersColumnsDefs";
import { StrategyBot } from "@/features/strategies/0dte-iron-flies/users/types";

type Props = BoxProps & {
  user: IvlUser;
  orders: Order[];
  bot: Bot;
  allocations: CapitalAllocation[];
  billings: Billing[];
  openPositions: OpenPosition[];
  currentDayFills: ICurrentDayFills[];
  workingOrders: IWorkingOrder[];
  theme: Theme;
  opened?: boolean;
};
export default function UserDetailsSection({
  opened,
  user,
  orders,
  allocations,
  billings,
  openPositions,
  bot,
  currentDayFills,
  workingOrders,
  theme,
  ...props
}: Props) {
  const { t } = useTranslation("UserDetailsSection");
  const handleStopClick = () => {};
  const handleStartClick = () => {};
  const handleResetClick = () => {};

  return (
    <Box {...props}>
      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("OpenPositions")}
      </Typography>

      <StyledMetricsBox>
        <DataGrid<OpenPosition>
          slots={{
            footer: () => <></>,
          }}
          sx={OpenPositionTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={openPositions}
          rowHeight={20}
          columnHeaderHeight={25}
          isCellEditable={() => false}
          columns={getOpenPositionColumns()}
          getRowId={row => {
            if (!row.username) {
              throw new Error("Row does not have a valid username");
            }
            return row.username;
          }}
        />
      </StyledMetricsBox>

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
          ...adaptiveHeightTableSx,
          "& .MuiDataGrid-cell[data-field=startBot]": {
            paddingTop: "0px",
            paddingBottom: "0px",
          },
        }}
        rows={[bot]}
        rowHeight={25}
        isCellEditable={() => false}
        columns={getBotColumnsDefs(handleStartClick, handleStopClick, handleResetClick)}
        editMode="row"
        getRowId={row => row.entryOrderId}
      />

      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("CurrentDayFills")}
      </Typography>
      <Stack>
        <DataGrid<ICurrentDayFills>
          slots={{
            footer: () => <></>,
          }}
          sx={adaptiveHeightTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={currentDayFills}
          rowHeight={25}
          isCellEditable={() => false}
          columns={getCurrentDayFillsColumns()}
          getRowId={row => row.orderId}
        />
      </Stack>

      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("WorkingOrders")}
      </Typography>
      <Stack>
        <DataGrid<IWorkingOrder>
          slots={{
            footer: () => <></>,
          }}
          sx={adaptiveHeightTableSx}
          rowSelection={false}
          checkboxSelection={false}
          rows={workingOrders}
          rowHeight={25}
          isCellEditable={() => false}
          columns={getWorkingOrdersColumns()}
          getRowId={row => row.orderId}
        />
      </Stack>

      <Stack>
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
          sx={adaptiveHeightTableSx}
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
          sx={adaptiveHeightTableSx}
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
  );
}

export const StyledMetricsBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const ClosingOnlyBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
  },
}));

export const OpenPositionTableSx: SxProps<Theme> = {
  height: "inherit !important",
  maxHeight: "110px",
  minHeight: "50px",
  minWidth: "120px",
  "& .MuiDataGrid-main": {
    maxHeight: "110px",
    minHeight: "50px",
  },
  "& .MuiDataGrid-footerContainer": {
    height: "30px",
  },
  "& .MuiDataGrid-cell": {
    padding: 0.5,
    minWidth: "auto important",
    fontSize: "10.5px",
  },
  "& .MuiDataGrid-columnHeader": {
    padding: 0.5,
    fontSize: "11px",
    height: "10px",
    width: "auto !important",
  },
  "& .MuiDataGrid-row": {
    minHeight: "10px",
  },
};
