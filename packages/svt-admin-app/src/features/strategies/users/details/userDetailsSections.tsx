import { deleteFifoBot } from "@/features/strategies/users/fifoUsersSlice";
import { Typography } from "@mui/material";
import { Box, BoxProps, Stack, Theme, styled, SxProps } from "@mui/system";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { adaptiveHeightTableSx } from "../../shared/tableSx";
import { IFifoUser } from "../iFifoUser";
import { Bot } from "./bot";
import { getBotColumnsDefs } from "./botsColumnsDefs";
import { Order } from "./order";
import UserMetricCard from "./UserMetricCard";
import { OpenPosition } from "./openPosition";
import { getOpenPositionColumns } from "./openPositionColumnsDefs";
import { formatCurrencyToString } from "@/utils/common";
import { useMemo } from "react";
import { getCurrentDayFillsColumns } from "@/features/strategies/users/details/currentDayFillsColumnsDefs";
import { WorkingOrder } from "@/features/strategies/users/details/workingOrder";
import { ICurrentDayFills } from "@/features/strategies/users/details/currentDayFillsInterface";
import { getWorkingOrdersColumns } from "@/features/strategies/users/details/workingOrdersColumnsDefs";

type Props = BoxProps & {
  user: IFifoUser;
  orders: Order[];
  currentDayFills: ICurrentDayFills[];
  workingOrders: WorkingOrder[];
  bots: Bot[];
  openPositions: OpenPosition[];
  theme: Theme;
  opened?: boolean;
};

export default function UserDetailsSection({
  opened,
  user,
  orders,
  currentDayFills,
  workingOrders,
  bots,
  openPositions,
  theme,
  ...props
}: Props) {
  const { t } = useTranslation("UserDetailsSection");
  const dispatch = useDispatch();
  const handleDeleteBotClick = (id: GridRowId) => {
    dispatch(deleteFifoBot({ userId: user.id, botId: encodeURIComponent(id as string) }));
  };

  const getPandLStyleAndValue = useMemo(() => {
    if (!openPositions || openPositions.length === 0) {
      return { text: "-", color: "#84b067" };
    }

    let sumPanAndL = 0;
    openPositions.forEach(x => {
      if (x.pAndL) {
        sumPanAndL += x.pAndL;
      }
    });

    return {
      text: formatCurrencyToString(sumPanAndL, openPositions[0].currencySymbol),
      color: sumPanAndL >= 0 ? "#84b067" : "#ff7782",
    };
  }, [openPositions]);

  const getOpenPositionStyleAndValue = useMemo(() => {
    return openPositions.length > 0
      ? { color: "#89d08d", text: t("OpenPositions") }
      : { color: "#bfbfbf", text: t("Flat") };
  }, [openPositions]);

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
        <UserMetricCard
          sx={{ backgroundColor: getOpenPositionStyleAndValue.color }}
          title={undefined}
          subtitle={getOpenPositionStyleAndValue.text}></UserMetricCard>
        <UserMetricCard
          sx={{ backgroundColor: getPandLStyleAndValue.color }}
          title={t("OpenPANDL")}
          subtitle={getPandLStyleAndValue.text}></UserMetricCard>
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
          getRowId={row => row.id}
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
        {t("CurrentDayFills")}
      </Typography>
      <Stack>
        <DataGrid<Order>
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
          getRowId={row => row.id}
        />
      </Stack>
      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("WorkingOrders")}
      </Typography>
      <Stack>
        <DataGrid<Order>
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
