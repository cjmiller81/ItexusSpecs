import { Typography } from "@mui/material";
import { Box, BoxProps, Stack, SxProps, Theme, styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { adaptiveHeightTableSx } from "@/features/strategies/shared/tableSx";
import { getBotColumnsDefs } from "./botsColumnDefs";
import { getOpenPositionColumns } from "./openPositionColumnsDefs";
import { getCurrentDayFillsColumns } from "./currentDayFillsColumnsDefs";
import { getWorkingOrdersColumns } from "./workingOrdersColumnsDefs";
import { ICurrentDayFills, IDteStrategy, IWorkingOrder, OpenPosition, StrategyBot, StrategyBotList } from "../types";
import { resetBot, startBot, stopBot } from "../dteUsersSlice";
import { useAppDispatch } from "@/libs/redux/Store";

type Props = BoxProps & {
  user: IDteStrategy;
  bots: StrategyBotList;
  currentDayFills: ICurrentDayFills[];
  workingOrders: IWorkingOrder[];
  openPositions: OpenPosition[];
  theme: Theme;
  opened?: boolean;
};

export default function UserDetailsSection({
  opened,
  user,
  bots,
  openPositions,
  theme,
  currentDayFills,
  workingOrders,
  ...props
}: Props) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation("UserDetailsSection");

  const handleStopClick = (row: StrategyBot) => {
    dispatch(stopBot({userId: row.userId, accountNumber: row.exchangeAccountNumber, masterSymbol: row.masterSymbol}))
  };
  const handleStartClick = (row: StrategyBot) => {
    dispatch(startBot({userId: row.userId, accountNumber: row.exchangeAccountNumber, masterSymbol: row.masterSymbol}))
  };
  const handleResetClick  = (row: StrategyBot) => {
    dispatch(resetBot({userId: row.userId, accountNumber: row.exchangeAccountNumber, masterSymbol: row.masterSymbol}))
  };
  const handleForceExitClick  = (row: StrategyBot) => {
    dispatch(resetBot({userId: row.userId, accountNumber: row.exchangeAccountNumber, masterSymbol: row.masterSymbol}))
  };

  return (
    <Box {...props}>
      <Typography
        variant="h5"
        align="left"
        sx={{fontSize: "14px"}}
      >
   {t("0DTEHeader", { accountNumber: user.accountNumber })}
      </Typography>

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
          getRowId={row => row.id}
        />
      </StyledMetricsBox>
      <Typography
        mt={2}
        align="center"
        variant="h6">
        {t("Bots")}
      </Typography>
      <DataGrid<StrategyBot>
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
        rows={bots.zeroDteFlyStrategyList}
        rowHeight={25}
        isCellEditable={() => false}
        columns={getBotColumnsDefs(handleStartClick, handleStopClick, handleResetClick,handleForceExitClick)}
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
