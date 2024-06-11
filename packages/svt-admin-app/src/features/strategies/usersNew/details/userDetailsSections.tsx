import { useDispatch } from 'react-redux';
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Box, BoxProps, Stack, Theme, styled } from "@mui/system";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { IFifoUser } from "../iFifoUser";
import { getOrderColumnsColumns } from "./ordersColumnsDefs";
import { smallTableSx } from "../../shared/tableSx";
import UserMetricCard from "./UserMetricCard";
import { getBotColumnsDefs } from "./botsColumnsDefs";
import { Order } from "./order";
import { Bot } from "./bot";
import { deleteFifoBot } from "@/features/strategies/usersNew/fifoUsersSlice";

type Props = BoxProps & {
  user: IFifoUser;
  orders: Order[];
  bots: Bot[];
  theme: Theme;
  opened?: boolean;
};

export default function UserDetailsSection({ opened, user, orders, bots, theme, ...props }: Props) {
  const { t } = useTranslation("UserDetailsSection");
  const dispatch = useDispatch();
  const botStatusColor = user.connectionStatus === "Connected" ? theme.palette.warning.main : theme.palette.success.main;
  const botStatusVariant = user.connectionStatus === "Connected" ? "error" : "success";
  const botStatusText = user.connectionStatus === "Connected" ? t("StopAutomation") : t("StartAutomation");

  const handleDeleteBotClick = (id: GridRowId) => {
    dispatch(deleteFifoBot({ userId: user.id, botId: encodeURIComponent(id as string) }));
  };
  const handleStartStopClick = () => {};

  const capitalAllocationCardColor = theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main;
  const ordersCardColor = theme.palette.mode === "dark" ? theme.palette.warning.dark : theme.palette.warning.light;
  const botStatusCardColor = theme.palette.mode === "dark" ? theme.palette.success.dark : theme.palette.success.main;

  return (
    <Box {...props}>
      <StyledMetricsBox>
        <UserMetricCard
          sx={{ backgroundColor: capitalAllocationCardColor }}
          title={t("CapitalAllocation")}
          subtitle={'ytu'}
        ></UserMetricCard>
        <UserMetricCard
          sx={{ backgroundColor: ordersCardColor }}
          title={t("OrdersPlaced")}
          subtitle={orders.length.toString()}></UserMetricCard>
        <UserMetricCard
          sx={{ backgroundColor: botStatusCardColor }}
          title={t("BotStatus")}
          subtitle={user.connectionStatus}></UserMetricCard>
      </StyledMetricsBox>

      {opened && (
        <ClosingOnlyBox>
          <Button
            variant="outlined"
            color={botStatusVariant}
            sx={{ borderColor: botStatusColor, color: botStatusColor, maxWidth: "200px" }}>
            {botStatusText}
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
        {t("Bots")}
      </Typography>
      <DataGrid<Bot>
        slots={{
          footer: () => <></>,
        }}
        sx={smallTableSx}
        rowSelection={false}
        checkboxSelection={false}
        rows={bots}
        rowHeight={25}
        isCellEditable={() => false}
        columns={getBotColumnsDefs( handleStartStopClick, handleDeleteBotClick )}
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
