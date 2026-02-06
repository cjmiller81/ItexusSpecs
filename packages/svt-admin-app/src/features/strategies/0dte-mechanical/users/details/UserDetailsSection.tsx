  import { Typography } from "@mui/material";
  import { Box, BoxProps, Stack, SxProps, Theme, styled } from "@mui/system";
  import { DataGrid } from "@mui/x-data-grid";
  import { useTranslation } from "react-i18next";
  import { adaptiveHeightTableSx } from "@/features/strategies/shared/tableSx";
  import { useAppDispatch } from "@/libs/redux/Store";
  import { Mechanical0DteSpx, StrategyBotList } from "../types";
  import { ICurrentDayFills, IWorkingOrder, OpenPosition, StrategyBot } from "@/features/strategies/0dte-iron-flies/users/types";
  import { startMechanical0DteSpx, stopMechanical0DteSpx } from "../../dteMechanicalUsersSlice";
  import { getOpenPositionColumns } from "@/features/strategies/0dte-iron-flies/users/details/openPositionColumnsDefs";
  import { getWorkingOrdersColumns } from "@/features/strategies/0dte-iron-flies/users/details/workingOrdersColumnsDefs";
  import { getCurrentDayFillsColumns } from "@/features/strategies/0dte-iron-flies/users/details/currentDayFillsColumnsDefs";
  import { getBotColumnsDefs } from "./botsColumnDefs";
  
  type Props = BoxProps & {
    user: Mechanical0DteSpx;
    //bots: StrategyBotList;
    currentDayFills: ICurrentDayFills[];
    workingOrders: IWorkingOrder[];
    openPositions: OpenPosition[];
    theme: Theme;
    opened?: boolean;
  };
  
  export default function UserDetailsSection({
    opened,
    user,
    //bots,
    openPositions,
    theme,
    currentDayFills,
    workingOrders,
    ...props
  }: Props) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("UserDetailsSection");
  
    const handleStopClick = (row: Mechanical0DteSpx) => {
      dispatch(stopMechanical0DteSpx({ accountNumber: row.accountNumber, strategyId: row.strategyId }));
    };
    const handleStartClick = (row: Mechanical0DteSpx) => {
      dispatch(
        startMechanical0DteSpx({ accountNumber: row.accountNumber, strategyId: row.strategyId }),
      );
    };
  
    return (
      <Box {...props}>
        <Typography
          variant="h5"
          align="left"
          sx={{ fontSize: "14px" }}>
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
            getRowId={row => row.marketSymbol}
          />
        </StyledMetricsBox>
        <Typography
          mt={2}
          align="center"
          variant="h6">
          {t("Bots")}
        </Typography>
        {/* <DataGrid<Mechanical0DteSpx>
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
          columns={getBotColumnsDefs(handleStartClick, handleStopClick)}
          editMode="row"
          getRowId={row => row.userId}
        /> */}
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
  