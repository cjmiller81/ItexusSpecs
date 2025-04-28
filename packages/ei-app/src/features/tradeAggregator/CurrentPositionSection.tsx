import React, { useEffect, useState } from "react";
import {
  Box,
  styled,
  Select,
  SelectChangeEvent,
  Button,
  MenuItem,
  darken,
  lighten,
  TextField,
  DialogActions,
  Dialog,
  DialogContent,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BasicTable,
  nativeBarSx,
  toTableTokensModels,
} from "components";
import { useTranslation } from "react-i18next";
import { GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid";
import { fetchWallets } from "components";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { getIndexResultWalletTableColumns } from "@/constants/ColumnsDefs/IndexResultWalletTable";
import { PositionAllocation } from "@/models/Wallet/PositionAllocation";
import { Wallet } from "@/models/Wallet/Wallet";


interface CurrentPositionSectionProps {
    onWalletChange?: (wallet: Wallet | null) => void;
    selectedToken: string | null;
    onFilteredRowsChange?: (rows: WalletBalance[]) => void;
    selectedChainNewPosition: string | null;
  }

export const CurrentPositionSection : React.FC<CurrentPositionSectionProps> = ({ onWalletChange,onFilteredRowsChange, selectedToken,selectedChainNewPosition }) => {
  const theme = useTheme();
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [newToken, setNewToken] = useState<string>("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [isAddingManualPosition, setIsAddingManualPosition] = useState<boolean>(false);
  const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
  const [filteredWalletData, setFilteredWalletData] = useState<WalletBalance[]>([]);
  const [positionRows, setPositionRows] = useState<PositionAllocation[]>([]);
  const [selectedRows, setSelectedRows] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState("");
  const [addPositionError, setAddPositionError] = useState<string>("");
  const [tokensToTrade, settokensToTrade] = useState<number>(5);
  const { tableData } = useAppSelector(
      state => state.marketCapWeightedModeling,
    );

  const handleClearTable = () => {
    setSelectedWallet(null);
      if (onWalletChange) {
        onWalletChange(null);
      }
    setFilteredRows([]);
  };

  const { wallets } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (selectedToken && selectedChainNewPosition) {
      const matchingRow = filteredRows.find(
        row => row.tokenName?.toLowerCase() === selectedToken.toLowerCase() && 
        row.chain?.toLowerCase() === selectedChainNewPosition.toLowerCase()
      );

      setSelectedRows(matchingRow?.tokenName ?? null);
    } else {
      setSelectedRows(null);
    }
  }, [selectedToken,selectedChainNewPosition, filteredRows]);  

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
    setFilteredWalletData(
      selectedWallet
        ? toTableTokensModels(
            wallets?.find(wallet => wallet.walletId.toString() === selectedWallet.walletId.toString())?.chainAssets ??
              [],
          ).map(({ tokenName, chainName, balance }) => ({
            tokenName,
            chain: chainName,
            balance: balance,
          }))
        : [],
    );
  }, [wallets, selectedWallet]);

  useEffect(() => {
    setFilteredRows(filteredWalletData);
    if (onFilteredRowsChange) {
      onFilteredRowsChange(filteredWalletData);
    }
  }, [filteredWalletData]);

  useEffect(() => {
    if (onFilteredRowsChange) {
      onFilteredRowsChange(filteredRows);
    }
  }, [filteredRows]);

  useEffect(() => {
    if (newToken && newBalance && selectedChain) {
      const tokenNameLower = newToken.toLowerCase();
      const selectedChainLower = selectedChain.toLowerCase();
  
      const isDuplicate = filteredRows.some(
        row =>
          row.tokenName?.toLowerCase() === tokenNameLower &&
          row.chain?.toLowerCase() === selectedChainLower
      );
  
      if (isDuplicate) {
        setAddPositionError(t("TokenAlreadyExists"));
      } else {
        setAddPositionError("");
      }
    } else {
      setAddPositionError("");
    }
  }, [newToken, newBalance, selectedChain, filteredRows]);

  useEffect(() => {
    if (filteredRows.length > 0 || tableData.length > 0) {
      const rebalancedData = tableData.map(asset => ({
        id: asset.symbol ? asset.symbol.toLowerCase() : "",
        symbol: asset.symbol ? asset.symbol.toLowerCase() : "",
        qty: asset.qty,
        action: "",
        connection: true,
      }));

      const walletData = filteredRows
        .filter(row => selectedRows === (row.tokenName || ""))
        .map(({ tokenName, balance }) => ({
          id: tokenName ? tokenName.toLowerCase() : "default-id",
          symbol: tokenName ? tokenName.toLowerCase() : "",
          qty: balance,
          action: "",
          connection: true,
        }));

      const mergedData = [...rebalancedData.slice(0, tokensToTrade), ...walletData];

      const updatedRows = mergedData.map(row => {
        const rebalancedRow = rebalancedData.find(asset => asset.symbol === row.symbol);
        const walletRow = walletData.find(wallet => wallet.symbol === row.symbol);

        let qty = 0;
        let action = "";

        if (rebalancedRow && walletRow) {
          qty = rebalancedRow.qty - walletRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        } else if (!rebalancedRow && walletRow) {
          qty = -walletRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        } else if (rebalancedRow && !walletRow) {
          qty = rebalancedRow.qty;
          action = qty >= 0 ? "Buy" : "Sell";
        }

        return {
          ...row,
          qty,
          action: action.charAt(0).toUpperCase() + action.slice(1).toLowerCase(),
        };
      });

      let uniqueRows;

      if (selectedWallet) {
        if (selectedRows !== null) {
          uniqueRows = Array.from(
            new Map(
              updatedRows
                .filter(
                  row =>
                    selectedRows === row.symbol ||
                    rebalancedData.slice(0, tokensToTrade).some(reb => reb.symbol === row.symbol),
                )
                .map(item => [item.id, item]),
            ).values(),
          );
        } else {
          uniqueRows = rebalancedData.slice(0, tokensToTrade).map(walletRow => {
            const qty = walletRow.qty;
            return {
              ...walletRow,
              qty,
              action: qty >= 0 ? "Buy" : "Sell",
            };
          });
        }
      } else {
        uniqueRows = Array.from(new Map(updatedRows.map(item => [item.id, item])).values());
      }
      setPositionRows(uniqueRows);
    }
  }, [filteredRows, tableData, selectedWallet, selectedRows, tokensToTrade]);


  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    const selected = newSelection.length > 0 ? String(newSelection[0]) : null;
    setSelectedRows(selected);
  };

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    const selectedWallet = wallets?.find(wallet => wallet.walletId === selectedWalletId) || null;
    setSelectedWallet(selectedWallet);
    if (onWalletChange) {
      onWalletChange(selectedWallet);
    }
  };

  const handleCancelManualPosition = () => {
    setNewToken("");
    setNewBalance("");
    setIsAddingManualPosition(false);
  };

  const handleSaveManualPosition = () => {
    if (newToken && newBalance) {

      const newRow: WalletBalance = {
        tokenName: newToken,
        balance: parseFloat(newBalance),
        chain: selectedChain,
      };
  
      setFilteredRows(prevRows => [newRow, ...prevRows]);
      setIsAddingManualPosition(false);
    }
  };

  return (
      <Grid
        mt={2}
        spacing={0}
        container
        xs={12}
        sx={{ marginTop: 0}}>
        <Grid
          container
          xs={12}
          spacing={1}>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            container
            direction="row"
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: "8px",
              marginRight: { lg: "1.5%", md: "1.5%", xs: 0 },
              marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
              backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
            }}>

            <Grid
              item
              xs={4.5}
              md={4.5}
              lg={4}
              sx={{ marginTop: "15px", marginLeft: "2%" }}>
              <Select
                displayEmpty
                value={selectedWallet?.walletId || ""}
                onChange={handleWalletSelect}
                renderValue={selected => (selected ? selectedWallet?.walletName : t("AddSavedWallet"))}
                sx={{
                  backgroundColor: "#109EEF",
                  fontSize: "11px",
                  color: "white",
                  width: "100%",
                  maxHeight: "40px",
                  marginBottom: "12px",
                  "& .MuiSelect-icon": { color: "white" },
                }}>
                {wallets?.map(wallet => (
                  <MenuItem
                    key={wallet.walletId}
                    value={wallet.walletId}>
                    {wallet.walletName}
                  </MenuItem>
                ))}
              </Select>

              <Button
                sx={{
                  backgroundColor: "white",
                  width: "100%",
                  height: "40px",
                  color: "#1e90ff",
                  justifyContent: "flex-start",
                  paddingLeft: "15px",
                  fontSize: "11px bold",
                }}
                variant="outlined"
                onClick={() => setIsAddingManualPosition(true)}>
                {t("AddManualPosition")}
              </Button>

              <Box sx={{ marginTop: "12px", display: "flex", flexDirection: "column" }}>
                <Button
                  sx={{ width: "70px", height: "35px", fontSize: "11px" }}
                  variant="outlined"
                  onClick={handleClearTable}>
                  {t("Clear")}
                </Button>
              </Box>
            </Grid>

            <Grid
              item
              xs={6.8}
              md={6.9}
              lg={7.1}
              spacing={1}
              sx={{ marginTop: "15px", marginLeft: { lg: "5%", md: "2%", xs: "0%" } }}>
              <WalletsTable
                sx={{
                  ...tableScrollSx,
                  width: "100%",
                }}
                hideFooter
                rowSelection={true}
                rowSelectionModel={selectedRows ? [selectedRows] : []}
                checkboxSelection={false}
                apiRef={apiRef}
                getRowId={(x) => String(x.tokenName)}

                columns={getIndexResultWalletTableColumns()}
                rows={filteredRows}
                onRowSelectionModelChange={handleSelectionChange}
              />
              <Dialog
                open={isAddingManualPosition}
                onClose={handleCancelManualPosition}>
                <DialogContent>
                  <TextField
                    label={t("TokenName")}
                    variant="outlined"
                    size="small"
                    value={newToken}
                    onChange={e => setNewToken(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    label={t("Qty")}
                    variant="outlined"
                    size="small"
                    value={newBalance}
                    onChange={e => setNewBalance(e.target.value)}
                    type="number"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                <FormControl fullWidth size="small" sx={{ marginBottom: 2 }} error={!!addPositionError}>
                  <InputLabel id="chain-select-label">{t("Chain")}</InputLabel>
                  <Select
                    labelId="chain-select-label"
                    value={selectedChain}
                    label={t("Chain")}
                    onChange={e => {
                      setSelectedChain(e.target.value);
                      setAddPositionError("");
                    }}
                  >
                    <MenuItem value="ETHEREUM">ETHEREUM</MenuItem>
                    <MenuItem value="BNB CHAIN">BNB CHAIN</MenuItem>
                    <MenuItem value="OPTIMISM">OPTIMISM</MenuItem>
                    <MenuItem value="POLYGON">POLYGON</MenuItem>
                    <MenuItem value="AVALANCHE">AVALANCHE</MenuItem>
                    <MenuItem value="ARBITRUM">ARBITRUM</MenuItem>
                    <MenuItem value="ABSTRACTIONS">ABSTRACTIONS</MenuItem>
                  </Select>
                  {addPositionError && (
                    <Box sx={(theme) => ({
                      color: theme.palette.error.main,
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginTop: '4px',
                    })}>
                      {addPositionError}
                    </Box>
                  )}
                </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="outlined"
                    onClick={handleSaveManualPosition}
                    disabled={Boolean(addPositionError) || !newToken || !newBalance || !selectedChain}
                  >
                    {t("Add")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelManualPosition}>
                    {t("Cancel")}
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const WalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: 300,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    maxHeight: "300px",
  },
  "& .MuiDataGrid-footerContainer": {
    height: "40px",
  },
  "& .MuiDataGrid-row": {
    maxHeight: "1000px !important",
  },
  ".MuiDataGrid-cell--withRenderer ": {
    maxHeight: "1000px !important",
  },
  "& .MuiDataGrid-row--editing": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
  },
  "& .MuiDataGrid-cell--editing[data-field=walletName]": {
    border: "solid",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.7),
  },
  ".MuiDataGrid-withBorderColor": {
    bgColor: "transparent",
  }, 
}));
