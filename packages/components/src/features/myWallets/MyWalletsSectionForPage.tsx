import { Box, BoxProps, Card, CircularProgress, SelectChangeEvent, Typography, Button } from "@mui/material";
import { styled, useMediaQuery, useTheme } from "@mui/system";
import { TabSelector } from "../../components/common/TabSelector";
import { tabIcons } from "../../components/common/tabIcons";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  GridCellParams,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
  MuiEvent,
  useGridApiRef,
} from "@mui/x-data-grid";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { PageTitle } from "../../components/TextDisplay/PageTitle";
import { IExchange, Wallet } from "../../models";
import { createWallet, TotalWalletWorthData, useAppDispatch, useAppSelector } from "../../slices";

import { AddressModel, WalletInputModal } from "./WalletInputModal";
import { WalletPlanGate } from "./WalletPlanGate";
import { WalletLimitOverlay } from "./WalletLimitOverlay";
import { useFormik } from "formik";
import { DexWalletsTable } from "./DexWalletTable";
import { getDexWalletsColumns } from "./DexWalletsTableColumnsDefs";
import { ExpandableRowDex } from "./TokensRowDex";
import { TransactionHistory } from "./TransactionHistory";

interface Props extends BoxProps {
  wallets: Wallet[] | null;
  selectedWalletsIds: string[];
  loading?: boolean;
  onUpdateWallet: (wallet: Wallet) => void;
  onDeleteWallet: (wallet: string) => void;
  onSelectedRowsChanged?: (rows: Wallet[]) => void;
  totalWalletsWorthData?: TotalWalletWorthData;
  totalAmount: number;
  addWalletModalOpen: boolean;
  setAddWalletModalOpen: (open: boolean) => void;
  id?: string;
}

export const MyWalletsSectionForPage = ({
  onDeleteWallet,
  onSelectedRowsChanged,
  onUpdateWallet,
  wallets,
  totalWalletsWorthData,
  totalAmount,
  loading,
  selectedWalletsIds,
  addWalletModalOpen,
  setAddWalletModalOpen,
  id,
  sx,
  ...props
}: Props) => {
  const { t } = useTranslation("MyWalletsSection");
  const apiRef = useGridApiRef();

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const [expandedRowHeights, setExpandedRowHeights] = useState<Record<string, string>>({});
  const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
  const [openCoinbaseDialog, setOpenCoinbaseDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [exchange, setExchange] = useState<IExchange[]>([]);
  const [activeConnection, setActiveConnection] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const { portfolioWalletData } = useAppSelector(state => state.wallets);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"positions" | "history">("positions");

  const addWallet = async (walletAddressModel: AddressModel) => {
    const resultAction = (await dispatch(createWallet(walletAddressModel))) as {
      meta?: { requestStatus?: string };
      payload?: { error?: unknown };
    };

    if (resultAction.meta?.requestStatus === "rejected") {
      const err = resultAction.payload?.error;
      setCreateErrorMessage(err != null ? String(err) : null);
    } else {
      setCreateErrorMessage(null);
      setAddWalletModalOpen(false);
    }
  };

  const onSelectedChanged = (rows: Wallet[]) => {
    if (onSelectedRowsChanged) onSelectedRowsChanged(rows);
  };

  const updateRowHeight = (rowId: string, height: string) => {
    setExpandedRowHeights(prev => ({
      ...prev,
      [rowId]: height,
    }));
  };
  const formik = useFormik({
    initialValues: {
      apiKey: "",
      apiSecret: "",
      apiPassphrase: "",
      network: "",
      customRpcUrl: "",
      chainName: selectedService === "Kraken" ? "Kraken" : "Coinbase",
    },
    validationSchema: Yup.object({
      apiKey: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      apiSecret: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      apiPassphrase: activeConnection === "api" ? Yup.string().optional() : Yup.string().optional(),
      network: activeConnection === "rpc" ? Yup.string().required(t("NetworkRequired")) : Yup.string().optional(),
      customRpcUrl:
        activeConnection === "rpc"
          ? Yup.string().url(t("InvalidURL")).required(t("CustomRPCRequired"))
          : Yup.string().optional(),
      chainName: Yup.string().required(t("ChainNameRequired")),
    }),
    onSubmit: (values, { resetForm }) => {
      resetForm();
      setOpenKrakenDialog(false);
      setOpenCoinbaseDialog(false);
      const newExchanges: IExchange = {
        exchange_id: selectedService,
        name: selectedService,
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
      };
      setExchange([...exchange, newExchanges]);
    },
  });

  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    const stopPropagation = ["expand", "trash", "address", "name"];
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (selectedService === "Kraken") {
      setOpenKrakenDialog(true);
    } else if (selectedService === "Coinbase") {
      setOpenCoinbaseDialog(true);
    }
    setOpenExchangeDialog(false);
  }, [selectedService]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleExpandClick = (id: GridRowId, expanded: boolean) => {
    // Only allow one wallet to be expanded at a time
    if (expanded) {
      setExpandedRows([id as string]);
    } else {
      setExpandedRows([]);
    }
  };

  // Reorder wallets so that expanded wallet is always last
  const orderedWallets = React.useMemo(() => {
    if (!wallets || expandedRows.length === 0) return wallets;
    const expandedRowId = expandedRows[0];
    const expandedWallet = wallets.find(w => w.address === expandedRowId);
    if (!expandedWallet) return wallets;

    const otherWallets = wallets.filter(w => w.address !== expandedRowId);
    return [...otherWallets, expandedWallet];
  }, [wallets, expandedRows]);

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = (id: GridRowId) => {
    onDeleteWallet(id as string);
  };

  const processRowUpdate = (newRow: GridRowModel<Wallet>, _oldRow: GridRowModel<Wallet>) => {
    const updatedRow = { ...newRow, isNew: false };
    onUpdateWallet(newRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    const collapseOnRoute = () => setExpandedRows([]);
    router.events.on("routeChangeStart", collapseOnRoute);
    router.events.on("hashChangeStart", collapseOnRoute);
    return () => {
      router.events.off("routeChangeStart", collapseOnRoute);
      router.events.off("hashChangeStart", collapseOnRoute);
    };
  }, [router.events]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isExpanded]);

  const theme = useTheme();
  const isXL = useMediaQuery("(min-width:2000px)");

  const renderCardContent = (isExpandedView: boolean = false) => (
    <WalletPlanGate wallets={wallets}>
    <Card
      elevation={0}
      sx={{
        height: isExpandedView ? "calc(100vh - 100px)" : "auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor: theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}>
        <TabSelector
          options={[
            {
              label: t("Positions", { ns: "MyWalletsPage", defaultValue: "Positions" }),
              value: "positions",
              icon: tabIcons.positions,
            },
            {
              label: t("TransactionHistory", { ns: "MyWalletsPage", defaultValue: "Transaction History" }),
              value: "history",
              icon: tabIcons.history,
            },
          ]}
          value={activeTab}
          onChange={setActiveTab as (v: string) => void}
        />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
          {isExpandedView && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}>
              Click or press &quot;Esc&quot; to Collapse View
            </Typography>
          )}
          <Box
            component="button"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(25, 118, 210, 0.2)",
              gap: 0.3,
              textDecoration: "none",
              color: "#219a83",
              fontSize: "0.75rem",
              fontWeight: 500,
              padding: "2px 6px",
              border: "1px solid #219a83",
              borderRadius: "4px",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              background: "none",
              fontFamily: "inherit",
              "&:hover": {
                backgroundColor: "#219a83",
                color: "white",
              },
            }}>
            <OpenInNewIcon sx={{ fontSize: "0.85rem", flexShrink: 0 }} />
            <Typography
              variant="body2"
              component="span"
              sx={{
                fontSize: "0.75rem",
                lineHeight: 1.2,
              }}>
              {isExpanded
                ? t("CollapseView", { ns: "MyWalletsPage", defaultValue: "Collapse View" })
                : t("ExpandView", { ns: "MyWalletsPage", defaultValue: "Expand View" })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {activeTab === "positions" && (
          <Box sx={{ width: "100%", p: 2, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Box sx={{ position: "relative", width: "99%", overflowX: "clip", mb: 1 }}>
              {loading && (
                <CircularProgress
                  size="20px"
                  sx={{ width: "24px", position: "absolute", right: 0, top: 0 }}
                />
              )}
            </Box>
            <WalletLimitOverlay wallets={wallets} sx={{ flex: 1, minHeight: 0 }}>
              <DexWalletsTable
                loading={wallets === null && loading}
                disableVirtualization
                hideFooter
                $hasExpandedRows={expandedRows.length > 0}
                $minHeight={expandedRows.length > 0 ? (expandedRowHeights[expandedRows[0] as string] || "55vh") : undefined}
                sx={{
                  ...tableScrollSx,
                  flex: 1,
                  minHeight: 0,
                }}
                scrollbarSize={7}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                  row: {
                    isExpanded: (id: GridRowId) => expandedRows.includes(id),
                    onHeightUpdate: updateRowHeight,
                    isCollapsed: isExpandedView,
                  },
                }}
                slots={{
                  row: ExpandableRowDex,
                }}
                onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
                  onSelectedChanged(
                    (orderedWallets || wallets || []).filter(wallet => rowSelectionModel.some(rowSelection => wallet.address === rowSelection)),
                  );
                }}
                onCellClick={onCellClick}
                apiRef={apiRef}
                getRowId={x => x.address}
                columns={getDexWalletsColumns({
                  handleCancelClick: handleCancelClick,
                  handleSaveClick: handleSaveClick,
                  handleEditClick: handleEditClick,
                  handleDeleteClick: handleDeleteClick,
                  gridRowModesModel: rowModesModel,
                  expandedRows: expandedRows,
                  onExpandClick: handleExpandClick,
                  isXL: isXL
                })}
                rows={orderedWallets || []}
                rowSelectionModel={selectedWalletsIds}
                checkboxSelection={true}
              />
            </WalletLimitOverlay>
          </Box>
        )}

        {activeTab === "history" && (
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <TransactionHistory wallets={wallets} />
          </Box>
        )}
      </Box>
    </Card>
    </WalletPlanGate>
  );

  return (
    <Box
      id={id}
      {...props}
      sx={{ ...sx, position: "relative" }}>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={addWallet}
          onClose={() => setAddWalletModalOpen(false)}
          error={createErrorMessage}
          onCleanupError={() => setCreateErrorMessage(null)}
        />
      )}
      <StyledAdaptivePageBox>
        <PageTitle sx={{ mt: 4 }}>{t("WalletsWeb3")}</PageTitle>
      </StyledAdaptivePageBox>

      <Box
        sx={{
          position: isExpanded ? "fixed" : "relative",
          top: isExpanded ? "140px" : "auto",
          left: isExpanded ? "220px" : "auto",
          right: isExpanded ? 0 : "auto",
          bottom: isExpanded ? 0 : "auto",
          width: isExpanded ? "calc(100vw - 220px)" : "100%",
          height: isExpanded ? "calc(100vh - 140px)" : "auto",
          zIndex: isExpanded ? 1300 : "auto",
          backgroundColor: "transparent",
          ...(isExpanded && {
            padding: 3,
            display: "flex",
            flexDirection: "column",
          }),
        }}>
        {renderCardContent(isExpanded)}
      </Box>
    </Box>
  );
};
const tableScrollSx = {
  "& .MuiDataGrid-virtualScroller": {
    ...nativeBarSx,
  },
};

export const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  [theme.breakpoints.down("md")]: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    top: 0,
    mt: 4,
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

export const StyledAddWalletButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(4),
  },
}));
