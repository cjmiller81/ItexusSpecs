import { Box, BoxProps, Button, CircularProgress, SelectChangeEvent } from "@mui/material";
import { styled, useMediaQuery, useTheme } from "@mui/system";
import { FeatureAccessGuard } from "../../components/FeatureAccessGuard";
import { useSubscription } from "../../hooks/useSubscription";
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
import { createWallet, TotalWalletWorthData, useAppDispatch } from "../../slices";
import { AddressModel, WalletInputModal } from "./WalletInputModal";
import { useFormik } from "formik";
import { krakenApi } from "../../services/krakenService";
import { getDexWalletsColumns } from "./DexWalletsTableColumnsDefs";
import { ExpandableRowDex } from "./TokensRowDex";
import { DexWalletsTable } from "./DexWalletTable";
import { WalletLimitOverlay } from "./WalletLimitOverlay";

interface Props extends BoxProps {
  wallets: Wallet[] | null;
  exchanges: IExchange[]| null;
  selectedWalletsIds: string[];
  loading?: boolean;
  onUpdateWallet: (wallet: Wallet) => void;
  onDeleteWallet: (wallet: string) => void;
  onDeleteExchange: (exchange: string) => void;
  onAddWallet: (wallet: AddressModel) => void;
  onSelectedRowsChanged?: (rows: Wallet[]) => void;
  totalWalletsWorthData?: TotalWalletWorthData;
  totalAmount: number;
}

export const MyWalletsSection = ({
  onAddWallet,
  onDeleteWallet,
  onDeleteExchange,
  onSelectedRowsChanged,
  onUpdateWallet,
  wallets,
  exchanges,
  totalWalletsWorthData,
  totalAmount,
  loading,
  selectedWalletsIds,
  sx,
  ...props
}: Props) => {
  const { t } = useTranslation("MyWalletsSection");
  const apiRef = useGridApiRef();
  const { canConnectWallet } = useSubscription();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const [expandedRowHeights, setExpandedRowHeights] = useState<Record<string, string>>({});
  const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [exchange, setExchange] = useState<IExchange[]>([]);
  const [activeConnection, setActiveConnection] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const router = useRouter();
   
  const addWallet = async (walletAddressModel: AddressModel) => {
    const resultAction = await dispatch(createWallet(walletAddressModel));
    if (createWallet.rejected.match(resultAction)) {
      setCreateErrorMessage((resultAction.payload as any)?.error)
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
      [rowId]: height
    }));
  };
  const formik = useFormik({
    initialValues: {
      apiKey: "",
      apiSecret: "",
      chainName: "",
    },
    validationSchema: Yup.object({
      apiKey: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      apiSecret: activeConnection === "api" ? Yup.string().required(t("Required")) : Yup.string().optional(),
      chainName: Yup.string()
      .required(t("ChainNameRequired"))
      .test("unique-name", t("ExchangeNameExists"), (value) => {
        if (!value) return true;
        
        return (
          !isEditing ||
          !exchange.some((ex) => String(ex?.name || "").toLowerCase() === String(value || "").toLowerCase())
        );
      }),
    }),
    
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await krakenApi.connectToKraken({
          login: null,
          publicApiKey: values.apiKey,
          privateApiKey: values.apiSecret,
          userId: null,
          accountName: values.chainName,
        });
    
        if (result) {
          const newExchange = {
            exchange_id: selectedService,
            name: values.chainName,
            apiKey: values.apiKey,
            apiSecret: values.apiSecret,
          };
    
          if (isEditing) {
            setExchange((prevExchange) =>
              prevExchange.map((ex) =>
                ex.exchange_id === selectedService ? newExchange : ex
              )
            );
          } else {
            setExchange((prevExchange) => [...prevExchange, newExchange]);
          }
        }        
      } catch (error) {
        console.error("Failed to connect to Kraken", error);
        handleCancelExchange()
      } finally {
        resetForm();
        setIsEditing(false);
        setOpenKrakenDialog(false);
        setSelectedService("");
      }
    }
  });  
  

  const handleCancelExchange = () => {
    setActiveConnection("");
    setSelectedService("");
    setOpenExchangeDialog(false);
    setOpenKrakenDialog(false);
    setIsEditing(false);
    formik.setValues({
      apiKey: "",
      apiSecret: "",
      chainName: "",
    });
  };

  //eslint-disable-next-line no-undef
  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    const stopPropagation = ["expand", "trash", "address", "name"];
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation();
    }
  };

    useEffect(() => {
    if (selectedService === "Kraken") {
      setOpenKrakenDialog(true);
    } 
    setOpenExchangeDialog(false);
  }, [selectedService]);  

  useEffect(() =>{
    if(exchanges !== null){
      setExchange(exchanges)
    }
  },[exchanges])

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

  const theme = useTheme();
  const isXL = useMediaQuery("(min-width:2000px)");

  useEffect(() => {
    const collapseOnRoute = () => setExpandedRows([]);
    router.events.on("routeChangeStart", collapseOnRoute);
    router.events.on("hashChangeStart", collapseOnRoute);
    return () => {
      router.events.off("routeChangeStart", collapseOnRoute);
      router.events.off("hashChangeStart", collapseOnRoute);
    };
  }, [router.events]);

  return (
    <Box
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
        <FeatureAccessGuard
          feature="walletConnectionDEX"
          currentCount={wallets?.length || 0}
        >
          <StyledAddWalletButton
            variant="contained"
            onClick={() => setAddWalletModalOpen(true)}>
            {t("AddWalletWeb3")}
          </StyledAddWalletButton>
        </FeatureAccessGuard>
      </StyledAdaptivePageBox>
      <StyledAdaptivePageBox>
        <PageTitle sx={{ mt: 4 }}>{t("WalletsWeb3")}</PageTitle>
      </StyledAdaptivePageBox>

      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ position: "relative", width: "99%", top: 18, overflowX: "clip" }}>
          {loading && (
            <CircularProgress
              size="20px"
              sx={{ width: "24px", position: "absolute", right: 0, top: 0 }}
            />
          )}
        </Box>
        <WalletLimitOverlay wallets={wallets}>
        <DexWalletsTable
              loading={wallets === null && loading}
              disableVirtualization
              hideFooter
              $hasExpandedRows={expandedRows.length > 0}
              $minHeight={expandedRows.length > 0 ? (expandedRowHeights[expandedRows[0] as string] || "55vh") : undefined}
              sx={{
              ...tableScrollSx,
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