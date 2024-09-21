import { deleteFifoBot } from "@/features/strategies/users/fifoUsersSlice";
import { Typography } from "@mui/material";
import { Box, BoxProps, Stack, Theme, styled } from "@mui/system";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { smallTableSx } from "../../shared/tableSx";
import { IFifoUser } from "../iFifoUser";
import { Bot } from "./bot";
import { getBotColumnsDefs } from "./botsColumnsDefs";
import { Order } from "./order";
import { getOrderColumnsColumns } from "./ordersColumnsDefs";

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

  const handleDeleteBotClick = (id: GridRowId) => {
    dispatch(deleteFifoBot({ userId: user.id, botId: encodeURIComponent(id as string) }));
  };

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
