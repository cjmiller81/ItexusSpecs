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

interface Props extends Omit<AccordionProps, "children"> {
  title: string;
  tableAssets: InvestingTableAsset[];
}

export const IndexResultsSection = ({ title, tableAssets, ...props }: Props) => {
  const { t } = useTranslation("IndexModelingSection");
  const apiRef = useGridApiRef();
  const dispatch = useAppDispatch();
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [newToken, setNewToken] = useState<string>("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [isAddingManualPosition, setIsAddingManualPosition] = useState<boolean>(false);
  const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
  const [filteredWalletData, setFilteredWalletData] = useState<WalletBalance[]>([]);

  const handleClearTable = () => {
    setSelectedWallet("");
    setFilteredRows([]);
  };

  const { wallets } = useAppSelector(state => state.wallets);

  useEffect(() => {
    if (wallets === null) dispatch(fetchWallets(null));
    setFilteredWalletData(
      selectedWallet
        ? toTableTokensModels(
            wallets?.find(wallet => wallet.walletId.toString() === selectedWallet)?.chainAssets ?? [],
          ).map(({ tokenName, balance }) => ({
            tokenName,
            balance: balance,
          }))
        : [],
    );
  }, [wallets, selectedWallet]);

  useEffect(() => {
    setFilteredRows(filteredWalletData);
  }, [filteredWalletData]);

  const handleWalletSelect = (event: SelectChangeEvent) => {
    const selectedWalletId = event.target.value as string;
    setSelectedWallet(selectedWalletId);
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
      };

      setFilteredRows([newRow, ...filteredWalletData]);

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
      {...props}>
      <MainContainer
        display="flex"
        justifyContent="space-between">
        <LeftContainer>
          <LeftColumn>
            <Typography
              variant="h6"
              component="div"
              sx={{ alignSelf: "flex-start", fontSize: "14px" }}>
              {t("CurrentPosition")}
            </Typography>
            <Select
              displayEmpty
              value=""
              onChange={(event: SelectChangeEvent) => {}}
              renderValue={() => <Typography sx={{ color: "white" }}>{t("AddSavedPosition")}</Typography>}
              sx={{
                backgroundColor: "success.main",
                color: "white",
                width: "98%",
                maxHeight: "40px",
                "& .MuiSelect-icon": { color: "white" },
              }}
            />
            <Select
              displayEmpty
              value={selectedWallet}
              onChange={handleWalletSelect}
              renderValue={selected =>
                selected ? wallets?.find(wallet => wallet?.walletId === selected)?.walletName : t("AddSavedWallet")
              }
              sx={{
                backgroundColor: "#109EEF",
                color: "white",
                width: "98%",
                maxHeight: "40px",
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
                width: "98%",
                height: "40px",
                color: "black",
                justifyContent: "flex-start",
                paddingLeft: "15px",
              }}
              variant="outlined"
              onClick={() => setIsAddingManualPosition(true)}>
              {t("AddManualPosition")}
            </Button>
            <Button
              sx={{ mr: 2, width: "90px", height: "35px" }}
              variant="outlined"
              disabled>
              {t("Save")}
            </Button>
            <Button
              sx={{ mr: 2, width: "90px", height: "35px" }}
              variant="outlined"
              onClick={handleClearTable}>
              {t("Clear")}
            </Button>
          </LeftColumn>

          <RightColumn>
            <WalletsTable
              sx={{
                ...tableScrollSx,
                "& .MuiDataGrid-cell": {
                  padding: "4px 7px",
                },
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
          </RightColumn>
        </LeftContainer>

        <MiddleContainer>
          <Typography
            variant="h6"
            component="div"
            sx={{ alignSelf: "flex-start", fontSize: "14px", marginBottom: "8px" }}>
            {t("RebalancedIndexQuantities")}
          </Typography>
          <StyledWalletsTable
            sx={{
              ...tableScrollSx,
              maxWidth: 180,
              "& .MuiDataGrid-cell": {
                padding: "4px 7px",
                alignSelf: "flex-end",
              },
            }}
            hideFooter
            rowSelection={false}
            checkboxSelection={false}
            apiRef={apiRef}
            getRowId={x => x.id}
            columns={getIndexResultTableColumns()}
            rows={tableAssets}
          />
        </MiddleContainer>

        <RightContainer>
          <Typography
            variant="h6"
            component="div"
            sx={{ alignSelf: "flex-start", fontSize: "14px" }}>
            {t("PositionAllocationUpdates")}
          </Typography>
        </RightContainer>
      </MainContainer>
    </AppAccordionSection>
  );
};

const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

const LeftContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  width: "36%",
  borderRadius: "10px",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    width: "100%",
  },
}));

const LeftColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "55%",
  marginTop: "-49px",
}));

const RightColumn = styled(Box)(({ theme }) => ({
  width: "45%",
  paddingLeft: 1,
  marginTop: "15px",
}));

const MainContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

const MiddleContainer = styled(Box)(({ theme }) => ({
  width: "16%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));

const RightContainer = styled(Box)(({ theme }) => ({
  width: "44%",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
}));

export const WalletsTable = styled(BasicTable)(({ theme }) => ({
  width: "100%",
  minHeight: 300,
  maxWidth: 180,
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
