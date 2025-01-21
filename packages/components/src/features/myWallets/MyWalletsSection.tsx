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
import { useTranslation } from "react-i18next";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { PageTitle } from "../../components/TextDisplay/PageTitle";
import { IExchange, Wallet } from "../../models";
import { TotalWalletWorthData } from "../../slices";
import { ExpandableRow } from "./TokensRow";
import { TotalWalletsWorthCard } from "./TotalWalletsWorthCard";
import { AddressModel, WalletInputModal } from "./WalletInputModal";
import { StyledWalletsTable } from "./WalletsTable";
import { getWalletsColumns } from "./WalletsTableColumnsDefs";
import { getExchangeAccountColumns } from "./ExchangeAccountTable";
import { ExchangeDialog } from "./dialogs/ExchangeDialog";
import { CoinbaseDialog } from "./dialogs/CoinbaseDialog";
import { KrakenDialog } from "./dialogs/KrakenDialog";
import { useFormik } from "formik";

interface Props extends BoxProps {
  wallets: Wallet[] | null;
  selectedWalletsIds: string[];
  loading?: boolean;
  onUpdateWallet: (wallet: Wallet) => void;
  onDeleteWallet: (wallet: string) => void;
  onAddWallet: (wallet: AddressModel) => void;
  onSelectedRowsChanged?: (rows: Wallet[]) => void;
  totalWalletsWorthData?: TotalWalletWorthData;
}

export const MyWalletsSection = ({
  onAddWallet,
  onDeleteWallet,
  onSelectedRowsChanged,
  onUpdateWallet,
  wallets,
  totalWalletsWorthData,
  loading,
  selectedWalletsIds,
  sx,
  ...props
}: Props) => {
  const { t } = useTranslation("MyWalletsSection");
  const apiRef = useGridApiRef();
  const [addWalletModalOpen, setAddWalletModalOpen] = useState<boolean>(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
  const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
  const [openCoinbaseDialog, setOpenCoinbaseDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
  const [exchange, setExchange] = useState<IExchange[]>([]);
  const [activeConnection, setActiveConnection] = useState<string>("");
  const [dialogState, setDialogState] = useState(["Kraken", "Coinbase"]);

  const addWallet = async (walletAddressModel: AddressModel) => {
    onAddWallet(walletAddressModel);
    setAddWalletModalOpen(false);
  };

  const onSelectedChanged = (rows: Wallet[]) => {
    if (onSelectedRowsChanged) onSelectedRowsChanged(rows);
  };
  const formik = useFormik({
    initialValues: {
      apiKey: "",
      apiSecret: "",
      apiPassphrase: "",
      network: "",
      customRpcUrl: "",
      chainName: "",
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
      const newExchanges: IExchange = { exchange_id: selectedService, name: selectedService};
setExchange([...exchange, newExchanges]);
    },
  });
  
  const handleChainNameChange = (name: string) => {
    setSelectedService(name);
  };

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    if (
      value === "" ||
      value === "Kraken" ||
      value === "Coinbase"
    ) {
      setSelectedService(value);
    }
  };

  const handleCancelExchange = () => {
    setDialogState(["Kraken", "Coinbase"]);
    setActiveConnection("");
    setSelectedService("");
    setOpenExchangeDialog(false);
    setOpenKrakenDialog(false);
    setOpenCoinbaseDialog(false);
  };

  //eslint-disable-next-line no-undef
  const onCellClick = async (params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    const stopPropagation = ["expand", "trash", "address", "name"];
    if (stopPropagation.includes(params.field)) {
      event.stopPropagation();
    }
  };

  const handleOpenModal = () => {
    setOpenExchangeDialog(true);
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

  const handleExchangeEditClick = (id: GridRowId) => {
    
  };

  const handleExchangeDeleteClick = (id: GridRowId) => {
    setExchange(prevExchange => prevExchange.filter(item => item.exchange_id !== id));
  };

  const processRowUpdate = (newRow: GridRowModel<Wallet>, _oldRow: GridRowModel<Wallet>) => {
    const updatedRow = { ...newRow, isNew: false };
    onUpdateWallet(newRow);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box
      {...props}
      sx={{ ...sx, position: "relative" }}>
      {addWalletModalOpen && (
        <WalletInputModal
          open={addWalletModalOpen}
          onEnter={addWallet}
          onClose={() => setAddWalletModalOpen(false)}
        />
      )}
      <StyledWalletWorthContainer>
        <TotalWalletsWorthCard
          growPercentage={totalWalletsWorthData?.growPercentage ?? 0}
          totalWorth={totalWalletsWorthData?.totalWorth ?? 0}
        />
      </StyledWalletWorthContainer>
      <StyledAdaptivePageBox>
        <StyledAddWalletButton
          variant="contained"
          onClick={() => setAddWalletModalOpen(true)}>
          {t("AddWalletWeb3")}
        </StyledAddWalletButton>
      </StyledAdaptivePageBox>
      <StyledAdaptivePageBox>
        <PageTitle sx={{ mt: 4 }}>{t("Wallets")}</PageTitle>
      </StyledAdaptivePageBox>

      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ position: "relative", width: "99%", top: 18, overflowX: "clip" }}>
          {loading && (
            <CircularProgress
              size="20px"
              sx={{ width: "24px", position: "absolute", right: 0, top: 0 }}
            />
          )}
        </Box>
        <StyledWalletsTable
          loading={wallets === null && loading}
          disableVirtualization
          hideFooter
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
            },
          }}
          slots={{
            row: ExpandableRow,
          }}
          onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
            // Обновляем состояние с выбранными строками
            onSelectedChanged(
              wallets!.filter(wallet => rowSelectionModel.some(rowSelection => wallet.address === rowSelection)),
            );
          }}
          onCellClick={onCellClick}
          apiRef={apiRef}
          getRowId={x => x.address}
          columns={getWalletsColumns({
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

      <Box>
      <StyledAdaptivePageBox>
        <StyledAddWalletButton
          variant="contained"
          onClick={handleOpenModal}>
          {t("AddCentarlizedWallet")}
        </StyledAddWalletButton>
        <ExchangeDialog
        open={openExchangeDialog}
        title={dialogState}
        selectedService={dialogState}
        onClose={handleCancelExchange}
        onServiceChange={handleServiceChange}
      />
      <KrakenDialog
        open={openKrakenDialog}
        formik={formik}
        onClose={handleCancelExchange}
        onChainNameChange={handleChainNameChange}
      />

      <CoinbaseDialog
        open={openCoinbaseDialog}
        formik={formik}
        onClose={handleCancelExchange}
        onChainNameChange={handleChainNameChange}
      />
      </StyledAdaptivePageBox>
      </Box>

      <StyledWalletsTable
          disableVirtualization
          hideFooter
          sx={{
            ...tableScrollSx,
          }}
          editMode="row"   
          getRowId={x => x.exchange_id}
          checkboxSelection={false}
          columns={getExchangeAccountColumns({
            handleEditClick: handleExchangeEditClick,
            handleDeleteClick: handleExchangeDeleteClick,
            expandedRows: expandedRows,
            onExpandClick: handleExpandClick,
          })}
          rows={exchange || []}
        />
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
