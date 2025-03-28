import * as Yup from "yup";
import { deleteExchange, fetchExchanges, nativeBarSx, useAppDispatch, useAppSelector } from "components";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyledWalletsTable } from "@/features/MyWallets/WalletsTable";
import { GridRowId } from "@mui/x-data-grid/models/gridRows";
import { Box, Button, SelectChangeEvent, Stack, styled } from "@mui/material";
import { IExchange } from "../../../../../components/src/models/token/IExchange";
import { getExchangeAccountColumns } from "../../../../../components/src/features/myWallets/ExchangeAccountTable";
import { ExpandableChainRow } from "../../../../../components/src/features/myWallets/ChainsRow";
import { KrakenDialog } from "../../../../../components/src/features/myWallets/dialogs/KrakenDialog";
import { ExchangeDialog } from "../../../../../components/src/features/myWallets/dialogs/ExchangeDialog";
import { krakenApi } from "../../../../../components/src/services/krakenService";

export default function CEXWallets(){
    const [openKrakenDialog, setOpenKrakenDialog] = useState(false);
    const [selectedService, setSelectedService] = useState("");
    const [openExchangeDialog, setOpenExchangeDialog] = useState(false);
    const [exchange, setExchange] = useState<IExchange[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingExchangeName, setEditingExchangeName] = useState(" ");
    const [activeConnection, setActiveConnection] = useState<string>("");
    const { t } = useTranslation("MyWalletsSection");
    const [dialogState, setDialogState] = useState(["Kraken"]);
    const [expandedRows, setExpandedRows] = useState<GridRowId[]>([]);
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

    useEffect(() => {
        if (selectedService === "Kraken") {
            setOpenKrakenDialog(true);
        } 
        setOpenExchangeDialog(false);
    }, [selectedService]);  
  
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
      
    const handleChainNameChange = (name: string) => {
      setSelectedService(name);
    };
    
    const handleServiceChange = (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (
        value === "" ||
        value === "Kraken" 
      ) {
        setSelectedService(value);
        formik.setFieldValue("chainName", value);
      }
    };

    const handleCancelExchange = () => {
      setDialogState(["Kraken"]);
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

    const handleOpenModal = () => {
      setOpenExchangeDialog(true);
    };

    const handleUpdateExchange = ( updatedExchange: IExchange) => {
        const updatedExchanges = exchange.map(ex =>
        ex.name === editingExchangeName ? updatedExchange : ex 
        );
        setExchange(updatedExchanges); 
        setOpenKrakenDialog(false);
        setIsEditing(false);
    };

    const handleExchangeEditClick = (id: GridRowId) => {
      setIsEditing(true); 
      const exchangeToEdit = exchange.find((ex) => ex.exchange_id === id);
        if (exchangeToEdit) {
          setEditingExchangeName(exchangeToEdit.name)
          formik.setValues({
            apiKey: exchangeToEdit.apiKey,
            apiSecret: exchangeToEdit.apiSecret,
            chainName: exchangeToEdit.name,
          });
        }
      setOpenKrakenDialog(true);
      };
        
      const handleExchangeDeleteClick = (id: GridRowId) => {
        setExchange(prevExchange => prevExchange.filter(item => item.exchange_id !== id));
        dispatch(deleteExchange(id as string))
      };
        
      const handleExpandClick = (id: GridRowId, expanded: boolean) => {
        const newExpanded = expanded ? [...expandedRows, id as string] : expandedRows.filter(rowId => rowId !== id);
          setExpandedRows(newExpanded);
      };          
    
    return(
        <Stack>
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
                    existingExchanges={exchange}
                    isEditing={isEditing}
                    onUpdateExchange={handleUpdateExchange}
                    editingExchangeName ={editingExchangeName}
                  />
                  </StyledAdaptivePageBox>
                  </Box>
            
                   <StyledWalletsTable
                      loading={exchanges === null}
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
