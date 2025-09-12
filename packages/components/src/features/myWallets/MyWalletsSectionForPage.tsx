import { Box, BoxProps, Button, CircularProgress, SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/system";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { PageTitle } from "../../components/TextDisplay/PageTitle";
import { IExchange, Wallet } from "../../models";
import { createWallet, TotalWalletWorthData, useAppDispatch, useAppSelector } from "../../slices";

import { AddressModel, WalletInputModal } from "./WalletInputModal";
import { useFormik } from "formik";
import { DexWalletsTable } from "./DexWalletTable";
import { getDexWalletsColumns } from "./DexWalletsTableColumnsDefs";
import { ExpandableRowDex } from "./TokensRowDex";

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
  const { portfolioWalletData } = useAppSelector( state => state.wallets);

  const addWallet = async (walletAddressModel: AddressModel) => {
    const resultAction = await dispatch(createWallet(walletAddressModel));
    if (createWallet.rejected.match(resultAction)) {
      setCreateErrorMessage((resultAction.payload as any)?.error)
    } else {
      setCreateErrorMessage(null);
      setAddWalletModalOpen(false)
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
      const newExchanges: IExchange = { exchange_id: selectedService, name: selectedService, apiKey:values.apiKey, apiSecret: values.apiSecret };
      setExchange([...exchange, newExchanges]);
    },
  });

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
    const newExpanded = expanded ? [...expandedRows, id as string] : expandedRows.filter(rowId => rowId !== id);
    setExpandedRows(newExpanded);
  };

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

             <Box sx={{ width: "100%" }}>
        <Box sx={{ position: "relative", width: "99%", top: 18, overflowX: "clip" }}>
          {loading && (
            <CircularProgress
              size="20px"
              sx={{ width: "24px", position: "absolute", right: 0, top: 0 }}
            />
          )}
        </Box>
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
              wallets!.filter(wallet => rowSelectionModel.some(rowSelection => wallet.address === rowSelection)),
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
          })}
          rows={wallets || []}
          rowSelectionModel={selectedWalletsIds}
          checkboxSelection={true}
        />
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
