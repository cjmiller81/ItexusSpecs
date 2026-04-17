import React, { useEffect, useState } from "react";
import {
  AccordionProps,
  Box,
  styled,
  Typography,
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
  Tooltip,
  FormControlLabel,
  InputBase,
  Switch,
  DialogTitle,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  AppAccordionSection,
  BasicTable,
  InvestingTableAsset,
  nativeBarSx,
  toTableTokensModelFromWallet,
  toTableTokensModelsFromPortfolio,
  useAppSelector,
} from "components";
import { useTranslation } from "react-i18next";
import { GridRowSelectionModel, useGridApiRef } from "@mui/x-data-grid";
import { getIndexResultTableColumns } from "@/constants/ColumnsDefs/IndexResultTable";
import { fetchWallets } from "components";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppDispatch } from "@/libs/redux/Store";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { getIndexResultWalletTableColumns } from "@/constants/ColumnsDefs/IndexResultWalletTable";
import { useLifiChainMap } from "@/common/lifiChainContext";
import { getIndexPositionTableColumns } from "@/constants/ColumnsDefs/IndexResultPositionTable";
import { PositionAllocation } from "@/models/Wallet/PositionAllocation";

import { Coins } from "lucide-react";
import { Wallet as WalletIcon } from "lucide-react";
import { MarketCapWallet } from "../MyWallets/MarketCapWallet";
import CustomNoWalletOverlay from "@/components/CustomNoWalletOverlay";

import { Wallet } from "components";

interface SelectedWallet extends Wallet {

}
interface SelectedRow {
  id: string;
  symbol: string;
  qty: number;
}

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
  onWalletChange: (wallet: SelectedWallet | null) => void;
  onCapitalChange: (capital: number) => void;
  capital: number;
  onTokensChange: (tokens: number) => void;
  tokens: number;
  id?: string;
}

export const IndexResultsSection = ({
  title,
  tableAssets,
  onWalletChange,
  onTokensChange,
  capital,
  onCapitalChange,
  tokens,
  id,
  ...props
}: Props) => {
  const { t } = useTranslation(["IndexModelingSection", "Common"]);
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const { lifiChainMap } = useLifiChainMap();
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet | null>(null);
  const [newToken, setNewToken] = useState<string>("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [isAddingManualPosition, setIsAddingManualPosition] = useState<boolean>(false);
  const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
  const [filteredWalletData, setFilteredWalletData] = useState<WalletBalance[]>([]);
  const [positionRows, setPositionRows] = useState<PositionAllocation[]>([]);
  const [selectedExchanges, setSelectedExchanges] = useState<{ [key: number]: string }>({});
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [useWalletCapital, setUseWalletCapital] = useState(true);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [tokensToTrade, settokensToTrade] = useState<number>(5);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [selectedChain, setSelectedChain] = useState("");
  const [addPositionError, setAddPositionError] = useState<string>("");
  const [shouldShowGrid, setShouldShowGrid] = useState<boolean>(false);

  const handleClearTable = () => {
    setSelectedWallet(null);
    onWalletChange(null);
    setFilteredRows([]);
    setUseWalletCapital(true);
  };

  const { wallets } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (!selectedWallet) {
      onCapitalChange(1000);
    } else {
      const newTotalAmount = calculateTotalUsdAmount(selectedWallet);
      setTotalAmount(newTotalAmount);
      onCapitalChange(newTotalAmount);
      if (!useWalletCapital) {
        onCapitalChange(newTotalAmount);
      } else {
        onCapitalChange(1000);
      }
    }
  }, [selectedWallet]);

  const { portfolioWalletData } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
    
    if (selectedWallet && portfolioWalletData.length > 0) {
      const wallet = portfolioWalletData.find(w => w.walletAddress === selectedWallet.address);
      if (wallet) {
        const tokens = toTableTokensModelFromWallet(wallet);
        setFilteredWalletData(
          tokens.map(({ tokenName, chainName, balance }) => ({
            tokenName,
            chain: chainName,
            balance: balance,
          }))
        );
      } else {
        setFilteredWalletData([]);
      }
    } else {
      setFilteredWalletData([]);
    }
  }, [wallets, selectedWallet, portfolioWalletData]);

  useEffect(() => {
    setFilteredRows(filteredWalletData);
  }, [filteredWalletData]);

  useEffect(() => {
    const allRowIds = filteredRows.map(row => row.tokenName).filter((id): id is string => id !== undefined);
    setSelectedRows(allRowIds);
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
    if (filteredRows.length > 0 || tableAssets.length > 0) {
      const rebalancedData = tableAssets.map(asset => ({
        id: asset.symbol ? asset.symbol.toLowerCase() : "",
        symbol: asset.symbol ? asset.symbol.toLowerCase() : "",
        qty: asset.qty,
        action: "",
        connection: true,
      }));

      const walletData = filteredRows
        .filter(row => selectedRows.includes(row.tokenName || ""))
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
        if (selectedRows.length > 0) {
          uniqueRows = Array.from(
            new Map(
              updatedRows
                .filter(
                  row =>
                    selectedRows.includes(row.symbol) ||
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
  }, [filteredRows, tableAssets, selectedWallet, selectedRows, tokensToTrade]);

  const handleConfirmSend = (row) => {
    setSelectedRow(row);
    setOpen(true); 
  };


  const calculateTotalUsdAmount = (selectedWallet: SelectedWallet): number => {
    const wallet = portfolioWalletData.find(w => w.walletAddress === selectedWallet.address);
    
    if (wallet) {
      return wallet.totalValueUSD;
    }
    
    return 0;
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedWallet) {
      setIsTooltipOpen(true);
      event.preventDefault();
    } else {
      setUseWalletCapital(event.target.checked);
      setIsTooltipOpen(false);
      setTotalAmount(calculateTotalUsdAmount(selectedWallet));
      if (useWalletCapital) onCapitalChange(totalAmount);
      else onCapitalChange(1000);
    }
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    const selectedWallet = wallets?.find(wallet => wallet.walletId === selectedWalletId) || null;
    setSelectedWallet(selectedWallet);
    if (onWalletChange) {
      onWalletChange(selectedWallet);
    }
  };

  const handleExchangeChange = (event: React.ChangeEvent<{ value: unknown }>, rowId: string) => {
    const value = event.target.value as string;

    setSelectedExchanges(prev => ({
      ...prev,
      [rowId]: value,
    }));
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
  const handleConfirm = () => {
    setOpen(false);
  };

  return (
    <AppAccordionSection
      className="index-modeling-section-container"
      persistKey="IndexResultsSection"
      defaultExpanded={false}
      title={title}
      tooltip={t("ToggleView", { ns: "Common" })}
      id={id}
      {...props}>
      <Grid
        mt={2}
        spacing={0}
        container
        sx={{ marginTop: 0 }}>
        <Grid
          container
          xs={12}
          spacing={1}>
          <Grid
            item
            xs={12}
            md={7.64}
            lg={4.6}
            container
            direction="row"
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: "8px",
              marginRight: { lg: "1.5%", md: "1.5%", xs: 0 },
              marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
            }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                alignSelf: "flex-start",
                fontSize: "14px",
                marginTop: "11px",
                marginBottom: "-7px",
                marginLeft: "10px",
                width: "100%",
              }}>
              {t("CurrentPosition")}
            </Typography>

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
                  backgroundColor: "#219a83",
                  fontSize: "11px",
                  color: "white",
                  width: "98%",
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

              {selectedWallet?(<>
              <Button
                sx={{
                  backgroundColor: "#f7f5f2", // Warm off-white
                  width: "98%",
                  height: "40px",
                  color: "#219a83",
                  justifyContent: "flex-start",
                  paddingLeft: "15px",
                  fontSize: "11px bold",
                }}
                variant="outlined"
                onClick={() => setIsAddingManualPosition(true)}>
                {t("AddManualPosition")}
              </Button>
              </>
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#f7f5f2",
                    width: "98%",
                    height: "40px",
                    color: "#219a83",
                    justifyContent: "flex-start",
                    paddingLeft: "15px",
                    fontSize: "11px bold",
                    borderColor: "#219a83",
                    "&.Mui-disabled": {
                      backgroundColor: "transparent",
                      borderColor: "#219a83",
                      color: "#219a83",
                    },
                  }}
                  variant="outlined"
                  disabled
                  onClick={() => setIsAddingManualPosition(true)}
                >
                {t("AddManualPosition")}
              </Button>
              )}
              
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
                  checkboxSelection={true}
                  apiRef={apiRef}
                  getRowId={x => x.tokenName}
                  columns={getIndexResultWalletTableColumns(lifiChainMap)}
                  rows={filteredRows}
                  rowSelectionModel={selectedRows}
                  onRowSelectionModelChange={handleSelectionChange}
                  slots={{
                    noRowsOverlay: CustomNoWalletOverlay,
                  }}
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

                  <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                      <InputLabel id="chain-select-label">{t("Chain")}</InputLabel>
                      <Select
                        labelId="chain-select-label"
                        value={selectedChain}
                        label={t("Chain")}
                        onChange={e => setSelectedChain(e.target.value)}
                      >
                        <MenuItem disabled value=""></MenuItem>
                        <MenuItem value="ETHEREUM">ETHEREUM</MenuItem>
                        <MenuItem value="BNB CHAIN">BNB CHAIN</MenuItem>
                        <MenuItem value="OPTIMISM">OPTIMISM</MenuItem>
                        <MenuItem value="POLYGON">POLYGON</MenuItem>
                        <MenuItem value="AVALANCHE">AVALANCHE</MenuItem>
                        <MenuItem value="ARBITRUM">ARBITRUM</MenuItem>
                        <MenuItem value="BASE">BASE</MenuItem>
                        <MenuItem value="ZKSYNC">ZKSYNC</MenuItem>
                        <MenuItem value="GNOSIS">GNOSIS</MenuItem>
                        <MenuItem value="LINEA">LINEA</MenuItem>
                        <MenuItem value="SONIC">SONIC</MenuItem>
                        <MenuItem value="UNICHAIN">UNICHAIN</MenuItem>
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

          <Grid
            item
            xs={12}
            md={7.64}
            lg={6.8}
            container
            direction="row"
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              marginLeft: {
                xs: "0",
                lg: "auto",
              },
              marginRight: { md: "1.5%", xs: 0 },
              marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
            }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                alignSelf: "flex-start",
                fontSize: "14px",
                marginTop: "11px",
                marginBottom: "-7px",
                marginLeft: "10px",
                width: "100%",
              }}>
              {t("RebalancedIndexQuantities")}
            </Typography>
            <Grid
              item
              xs={12}
              md={12}
              lg={5.85}
              sx={{ marginLeft: "2%", marginTop: "30px" }}>
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>

            <Grid item container direction="column" alignItems="flex-start" spacing={1} sx={{ width: "auto" }}>
              
              <Grid container item alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <WalletIcon color={useWalletCapital ? "gray" : "#0ea5e9"} />
                </Grid>
                <Grid item>
                  <Typography
                    color={useWalletCapital ? "gray" : "#0ea5e9"}
                    variant="h6"
                    sx={{ fontSize: "14px" }}>
                    {t("WalletCapital", { ns: "IndexModelingSection" })}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item>
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: 2,
                    border: `1px solid ${!useWalletCapital ? "#0ea5e9" : "gray"}`,
                    bgcolor: !useWalletCapital ? "#f0f9ff" : "transparent",
                    width: "90%",
                  }}>
                  <InputBase
                    value={useWalletCapital === true ? " " : parseFloat(totalAmount.toFixed(2))}
                    sx={{ color: !useWalletCapital ? "black" : "gray", width: "100%" }}
                    disabled={useWalletCapital === true}
                  />
                </Box>
              </Grid>
            </Grid>

          <Grid item sx={{ flexGrow: 1, display: "flex", justifyContent: "center", marginTop:"40px" }}>
            <Tooltip
            
              open={isTooltipOpen}
              title={t("SelectSavedWallet", { ns: "IndexModelingSection" })}
              placement="top"
              arrow>
              <span>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useWalletCapital}
                      onChange={handleSwitchChange}
                    />
                  }
                  label=""
                />
              </span>
            </Tooltip>
          </Grid>

      <Grid item container direction="column" alignItems="flex-start" spacing={1} sx={{ width: "auto" }}>
        <Grid container item alignItems="center" direction="row" spacing={1}>
          <Grid item>
            <Coins color={!useWalletCapital ? "gray" : "#0ea5e9"} />
          </Grid>
          <Grid item>
            <Typography
              color={!useWalletCapital ? "gray" : "#0ea5e9"}
              variant="h6"
              sx={{ fontSize: "14px" }}>
              {t("DeploymentCapital", { ns: "IndexModelingSection" })}
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Box
            sx={{
              mt: 1,
              p: 1,
              borderRadius: 2,
              border: `1px solid ${useWalletCapital ? "#0ea5e9" : "gray"}`,
              bgcolor: useWalletCapital ? "#f0fdf4" : "transparent",
              width: "90%",
            }}>
            <InputBase
              value={useWalletCapital === true ? capital : " "}
              sx={{ color: useWalletCapital ? "black" : "gray", width: "100%" }}
              onChange={event => onCapitalChange(Number(event.target.value) || 0)}
            />
          </Box>
        </Grid>

      </Grid>
  </Grid>

      <Grid container spacing={2} direction={"column"} sx={{justifyContent: "flex-start" , marginLeft:"0px", mt: 2 }}>
        <Typography 
          sx={{ color: "gray",fontSize: "14px" }} 
          variant="h6">{t("TokensToTrade")}
        </Typography>
        <TextField
          type="number"
          value={tokensToTrade === 0 ? "" : tokensToTrade}
          onChange={(event) => {
            const value = event.target.value;
            settokensToTrade(value === "" ? 0 : Number(value.replace(/^0+/, "")));
          }}
          onFocus={() => settokensToTrade(tokensToTrade)}
          onBlur={(event) => {
            if (event.target.value === "") {
              settokensToTrade(tokensToTrade);
            }
          }}
          InputProps={{ inputProps: { min: 0 } }}
          sx={{
            width: "70%",
            maxWidth: "300px",
            display: "flex",
            justifyContent: "flex-start"
          }}
        />
      </Grid>

          </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={5.3}
              spacing={1}
              sx={{ marginTop: "25px", marginLeft: { lg: "2%", md: "2%", xs: "0%" } }}>
              <MarketCapWallet
                sx={tableScrollSx}
                hideFooter
                rowSelection={false}
                checkboxSelection={false}
                apiRef={apiRef}
                getRowId={x => x.id}
                columns={getIndexResultTableColumns()}
                rows={tableAssets.slice(0, tokensToTrade)}
              />
            </Grid>
          </Grid>
        </Grid>

        {shouldShowGrid && (
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={12}
          md={12}
          lg={12}
          sx={{
            display: "flex",
            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
            padding: "10px",
            marginRight: { lg: "2%", md: 0, xs: 0 },
            height: "100%",
            "@media (max-width: 700px)": {
              display: "block",
            },
          }}>
          <Box
            sx={{
              flexGrow: 1,
              width: "70%",
              paddingRight: "15px",
              "@media (max-width: 700px)": {
                width: "100%",
              },
            }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                alignSelf: "flex-start",
                fontSize: "14px",
                paddingLeft: "10px",
                paddingTop: "4px",
              }}>
              {t("PositionAllocationUpdates")}
            </Typography>
            <Box
              sx={{
                paddingTop: "12px",
                width: "100%",
                marginRight: "10px",
              }}>
              <MarketCapWallet
                sx={tableScrollSx}
                hideFooter
                rowSelection={false}
                checkboxSelection={false}
                apiRef={apiRef}
                getRowId={x => x.id}
                columns={getIndexPositionTableColumns(selectedExchanges, handleExchangeChange,handleConfirmSend)}
                rows={positionRows}
              />
            </Box>
            <Dialog
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: '#1E213D',
                color: 'white',
                border: '2px solid white', 
                borderRadius: '6px', 
                width: 'auto',
                height: 'auto', 
              }
            }}
             open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{display: 'flex', marginLeft:"5%" }}>{t("ConfirmTransaction")}</DialogTitle>
        <DialogContent sx={{display: 'flex', marginLeft: "5%" }}>
          {selectedRow && (
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("Symbol")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{selectedRow.symbol.toUpperCase()}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("Chain")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{t("NotSelected")}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("Qty")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{selectedRow.qty.toFixed(4)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("SwapFor")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{t("NotSelected")}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("EstGasFees")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{"--"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "20px"}}><strong>{t("EstTotal")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{"--"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "40px"}}><strong>{t("SlippageTolerance")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{"0.5%"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography sx={{color: "darkgray", marginRight: "40px"}}><strong>{t("Exchanges")}:</strong></Typography>
                <Typography sx={{color: "darkgray"}}>{"Kraken"}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{display: 'flex', justifyContent: 'center' }}>
          <Button 
          sx={{color:"white", backgroundColor:"#49678D", borderRadius:"6px", textTransform: "none",}}
          onClick={() => setOpen(false)}>{t("Cancel")}</Button>
          <Button 
          sx={{color:"white", backgroundColor:"#1D1E33", borderRadius:"6px", textTransform: "none",}}
          onClick={handleConfirm} color="primary">
            {t("ConfirmSend")}
          </Button>
        </DialogActions>
      </Dialog>
          </Box>
        </Grid>)}
      </Grid>
    </AppAccordionSection>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const WalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: 350,
  mt: 2,
  display: "grid",
  "& .MuiDataGrid-virtualScroller": {
    overflowY: "auto !important",
  },
  "& .MuiDataGrid-main": {
    height: "auto",
    maxHeight: "350px",
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
