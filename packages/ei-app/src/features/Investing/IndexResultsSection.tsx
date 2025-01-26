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
} from "@mui/material";
import {
  AppAccordionSection,
  BasicTable,
  InvestingTableAsset,
  nativeBarSx,
  StyledWalletsTable,
  toTableTokensModels,
  useAppSelector,
} from "components";
import { useTranslation } from "react-i18next";
import { useGridApiRef } from "@mui/x-data-grid";
import { getIndexResultTableColumns } from "@/constants/ColumnsDefs/IndexResultTable";
import { fetchWallets } from "components";
import { useAppDispatch } from "@/libs/redux/Store";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { getIndexResultWalletTableColumns } from "@/constants/ColumnsDefs/IndexResultWalletTable";
import { getIndexPositionTableColumns } from "@/constants/ColumnsDefs/IndexResultPositionTable";
import { PositionAllocation } from "@/models/Wallet/PositionAllocation";
import { ConnectionCard } from "@/features/Investing/ConnectionCard";
import { Wallet } from "@/models/Wallet/Wallet";

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
  onWalletChange: (wallet: Wallet | null) => void;
}

export const IndexResultsSection = ({ title, tableAssets, onWalletChange, ...props }: Props) => {
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

  const handleClearTable = () => {
    setSelectedWallet(null);
    onWalletChange(null);
    setFilteredRows([]);
  };

  const { wallets } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
    setFilteredWalletData(
      selectedWallet
        ? toTableTokensModels(
            wallets?.find(wallet => wallet.walletId.toString() === selectedWallet.walletId.toString())?.chainAssets ?? [],
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
  }, [filteredWalletData]);

  useEffect(() => {
    if (filteredRows.length > 0 || tableAssets.length > 0) {
      const rebalancedData = tableAssets.map(asset => ({
        id: asset.symbol ? asset.symbol.toLowerCase() : "",
        symbol: asset.symbol ? asset.symbol.toLowerCase() : "",
        qty: asset.qty,
        action: "",
        connection: true,
      }));

      const walletData = filteredRows.map(({ tokenName, balance }) => ({
        id: tokenName ? tokenName.toLowerCase() : "",
        symbol: tokenName ? tokenName.toLowerCase() : "",
        qty: balance,
        action: "",
        connection: true,
      }));

      const mergedData = [...rebalancedData, ...walletData];

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

      const uniqueRows = Array.from(new Map(updatedRows.map(item => [item.id, item])).values());
      setPositionRows(uniqueRows);
    }
  }, [filteredRows, tableAssets]);

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    const selectedWallet = wallets?.find(wallet => wallet.walletId === selectedWalletId) || null;
    setSelectedWallet(selectedWallet);
    if (onWalletChange && selectedWallet) {
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
      const tokenNameLower = newToken.toLowerCase();
      const existingRowIndex = filteredRows.findIndex(row => row.tokenName?.toLowerCase() === tokenNameLower);

      if (existingRowIndex >= 0) {
        const updatedRows = [...filteredRows];
        updatedRows[existingRowIndex].balance += parseFloat(newBalance);
        setFilteredRows(updatedRows);
      } else {
        const newRow: WalletBalance = {
          tokenName: newToken,
          balance: parseFloat(newBalance),
        };
        setFilteredRows(prevRows => [newRow, ...prevRows]);
      }

      setNewToken("");
      setNewBalance("");
      setIsAddingManualPosition(false);
    }
  };

  return (
    <AppAccordionSection
      persistKey="IndexResultsSection"
      defaultExpanded={false}
      title={title}
      tooltip={t("ToggleView", { ns: "Common" })}
      {...props}>
      <Grid
        mt={2}
        spacing={0}
        container
        sx={{ marginTop: 0 }}>
        <Grid
          xs={12}
          md={7.64}
          lg={4}
          container
          direction="row"
          sx={{
            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
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
            lg={4.8}
            sx={{ marginTop: "15px", marginLeft: "2%" }}>
            <Select
              displayEmpty
              value={selectedWallet?.walletId || ""}
              onChange={handleWalletSelect}
              renderValue={selected =>
                selected ? selectedWallet?.walletName : t("AddSavedWallet")
              }
              sx={{
                backgroundColor: "#109EEF",
                fontSize: "11px",
                color: "white",
                width: "98%",
                maxHeight: "40px",
                marginBottom: "12px",
                "& .MuiSelect-icon": { color: "white" },
              }}>
              {wallets?.map(wallet => (
                <MenuItem key={wallet.walletId} value={wallet.walletId}>
                  {wallet.walletName}
                </MenuItem>
              ))}
            </Select>
            <Button
              sx={{
                backgroundColor: "white",
                width: "98%",
                height: "40px",
                color: "black",
                justifyContent: "flex-start",
                paddingLeft: "15px",
                fontSize: "11px",
              }}
              variant="outlined"
              onClick={() => setIsAddingManualPosition(true)}>
              {t("AddManualPosition")}
            </Button>
            <Box sx={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Button
                sx={{ mr: 2, width: "70px", height: "35px", fontSize: "11px" }}
                variant="outlined"
                disabled>
                {t("Save")}
              </Button>
              <Button
                sx={{ mr: 2, width: "70px", height: "35px", fontSize: "11px" }}
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
            lg={6.6}
            spacing={1}
            sx={{ marginTop: "15px", marginLeft: { lg: "0%", md: "2%", xs: "0%" } }}>
            {" "}
            <WalletsTable
              sx={{
                ...tableScrollSx,
                width: "100%",
              }}
              hideFooter
              rowSelection={false}
              checkboxSelection={false}
              apiRef={apiRef}
              getRowId={x => x.tokenName}
              columns={getIndexResultWalletTableColumns()}
              rows={filteredRows}
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
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={handleSaveManualPosition}>
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
          container
          xs={12}
          md={4.17}
          lg={2}
          sx={{
            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            marginRight: { lg: "1.5%", md: 0, xs: 0 },
            marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
          }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              alignSelf: "flex-start",
              fontSize: "14px",
              marginBottom: "5px",
              paddingLeft: "10px",
              paddingTop: "15px",
            }}>
            {t("RebalancedIndexQuantities")}
          </Typography>
          <Box
            sx={{
              paddingLeft: "15px",
              paddingRight: "15px",
              width: "100%",
            }}>
            <StyledWalletsTable
              sx={{
                ...tableScrollSx,
              }}
              hideFooter
              rowSelection={false}
              checkboxSelection={false}
              apiRef={apiRef}
              getRowId={x => x.id}
              columns={getIndexResultTableColumns()}
              rows={tableAssets}
            />
          </Box>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          xs={12}
          md={12}
          lg={5.63}
          sx={{
            display: "flex",
            boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            marginTop: { lg: "1.5%", md: "1.5%", xs: "4%" },
            padding: "10px",
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
              <StyledWalletsTable
                sx={{ ...tableScrollSx }}
                hideFooter
                rowSelection={false}
                checkboxSelection={false}
                apiRef={apiRef}
                getRowId={x => x.id}
                columns={getIndexPositionTableColumns()}
                rows={positionRows}
              />
            </Box>
          </Box>      
        </Grid>
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
