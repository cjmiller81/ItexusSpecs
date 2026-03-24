import { fetchExchanges, nativeBarSx, useAppDispatch, useAppSelector } from "components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledWalletsTable } from "@/features/MyWallets/WalletsTable";
import { GridRowId } from "@mui/x-data-grid/models/gridRows";
import { Box, Button, SelectChangeEvent, Stack, styled, useTheme } from "@mui/material";
import { IExchange } from "../../../../../components/src/models/token/IExchange";
import { getExchangeAccountColumns } from "../../../../../components/src/features/myWallets/ExchangeAccountTable";
import { ExpandableChainRow } from "../../../../../components/src/features/myWallets/ChainsRow";
import { ExchangeDialog } from "../../../../../components/src/features/myWallets/dialogs/ExchangeDialog";
import { CoinbaseConnectDialog } from "../../../../../components/src/features/myWallets/dialogs/CoinbaseConnectDialog";

export default function CEXWallets(){
  // Coinbase OAuth2 only
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [openCoinbaseDialog, setOpenCoinbaseDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [exchange, setExchange] = useState<IExchange[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExchangeName, setEditingExchangeName] = useState(" ");
  const [activeConnection, setActiveConnection] = useState<string>("");
  const { t } = useTranslation("MyWalletsSection");
  const [dialogState, setDialogState] = useState(["Coinbase"]);
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const theme = useTheme();
  const {  exchanges } = useAppSelector( state => state.wallets);
  const dispatch = useAppDispatch()
      
    useEffect(() => {
      dispatch(fetchExchanges(null))
    }, [dispatch])

    useEffect(() =>{
        if(exchanges !== null){
          setExchange(exchanges)
        }
      },[exchanges])

    const handleOpenModal = () => {
      setOpenExchangeDialog(true);
    };

    const handleCancelExchange = () => {
      setDialogState(["Coinbase"]);
      setActiveConnection("");
      setSelectedService("");
      setOpenExchangeDialog(false);
      setIsEditing(false);
    };

    // Handle service selection in ExchangeDialog
    const handleServiceChange = (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setSelectedService(value);
      if (value === "Coinbase") {
        setOpenExchangeDialog(false);
        setOpenCoinbaseDialog(true);
      }
    };


    // OAuth 2.0 URL using env client_id
    const COINBASE_CLIENT_ID = process.env.NEXT_PUBLIC_COINBASE_CLIENT_ID || "";
    const getCoinbaseAuthUrl = () => {
      const redirectUri = typeof window !== "undefined"
        ? window.location.origin + "/auth/coinbase-callback"
        : "";
      return `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${encodeURIComponent(COINBASE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=wallet:accounts:read`;
    };

    const handleCoinbaseConnect = () => {
      window.open(getCoinbaseAuthUrl(), "_blank", "noopener,noreferrer");
    };

    const handleCloseCoinbaseDialog = () => {
      setOpenCoinbaseDialog(false);
      setSelectedService("");
    };

    return(
        <Stack>
            <Box>
                  <StyledAdaptivePageBox>

                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <StyledAddWalletButton
                        variant="contained"
                        onClick={handleOpenModal}
                      >
                        {t("AddCentarlizedWallet")}
                      </StyledAddWalletButton>
                      <Box sx={{ mx: 1 }} />
                      <StyledAddWalletButton
                        variant="contained"
                        onClick={() => {
                          setOpenCoinbaseDialog(false); // reset first to force remount
                          setTimeout(() => setOpenCoinbaseDialog(true), 0);
                        }}
                      >
                        Refresh
                      </StyledAddWalletButton>
                    </Box>

                    <ExchangeDialog
                      open={openExchangeDialog}
                      title={["Coinbase"]}
                      selectedService={["Coinbase"]}
                      onClose={handleCancelExchange}
                      onServiceChange={handleServiceChange}
                    />
                    <CoinbaseConnectDialog
                      open={openCoinbaseDialog}
                      onClose={handleCloseCoinbaseDialog}
                      onConnect={handleCoinbaseConnect}
                    />
                  </StyledAdaptivePageBox>
                  </Box>
                   <StyledWalletsTable
                      loading={exchanges === null}
                      disableVirtualization
                      hideFooter
                      sx={{
                        marginTop:"2px",
                        ...tableScrollSx,
                        "&.MuiDataGrid-root.MuiDataGrid-withBorderColor": {
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: theme.palette.mode === "light" ? "rgb(181 177 177)" : "rgba(81, 81, 81, 1)",
                        },
                      }}
                      editMode="row"   
                      getRowId={x => x.exchange_id}
                      checkboxSelection={false}
                      columns={getExchangeAccountColumns({
                        // You may want to disable edit/delete for Coinbase for now
                        handleEditClick: () => {},
                        handleDeleteClick: () => {},
                        expandedRows: expandedRows,
                        onExpandClick: () => {},
                      })}
                      rows={exchange || []}
                      slotProps={{
                        row: {
                          isExpanded: (id: GridRowId) => expandedRows.includes(id),
                        },
                      }}
                      slots={{
                        row: ExpandableChainRow,
                      }}
                    />
        </Stack>
    )
}
const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};


export const StyledAddWalletButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}));

export const StyledAdaptivePageBox = styled(Box)(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  }));
