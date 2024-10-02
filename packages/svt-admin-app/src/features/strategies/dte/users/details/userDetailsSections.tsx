import { Typography } from "@mui/material";
import { Box, BoxProps, Theme, styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { IDteUser } from "../iDteUser";
import { smallTableSx } from "@/features/strategies/shared/tableSx";
import { Bot } from "./bot";
import { getBotColumnsDefs } from "./botsColumnDefs";


type Props = BoxProps & {
  user: IDteUser;
  bots: Bot[];
  theme: Theme;
  opened?: boolean;
};

export default function UserDetailsSection({ opened, user, bots, theme, ...props }: Props) {
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
