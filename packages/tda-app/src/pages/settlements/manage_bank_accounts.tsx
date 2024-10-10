import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography, useTheme, Chip } from "@mui/material";
import SubmitNewAccPopUp from "./submit_new_account_popUp";
import MainCard from "../../../src/components/MainCard";
import ReactTable from "./manage_bank_acc_table";
import { getManageBankAccountTableColumns } from "features/tables/manage-bank-account-table/columns";
import { useAppDispatch, useAppSelector } from "libs/redux/Store";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { deleteBankAccount, fetchBankAccounts } from "features/tables/manage-bank-account-table/BankAccountsSlice";

const ManageBankAccounts: React.FC = () => {
  const dispatch = useAppDispatch();
  const bankAccounts = useAppSelector(state => state.bankAccounts.accounts);
  const { t } = useTranslation("ManageBankAccounts");
  const theme = useTheme();
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([{ id: "transactTime", desc: true }]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    dispatch(fetchBankAccounts());
  }, [dispatch]);

  const handleRemoveAccount = (id: string) => {
    dispatch(deleteBankAccount(id));
  };

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setFiles([]);
  };

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
  };

  return (
    <>
      <Typography variant="h3">{t("ManageBankAccountsTitle")}</Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <MainCard
          content={false}
          sx={{ bgcolor: "primary.lighter", position: "relative", width: "100%" }}>
          <ReactTable
            data={bankAccounts}
            columns={getManageBankAccountTableColumns(theme, handleRemoveAccount, t)}
            sorting={sorting}
            onSortingChange={handleSortingChange}
          />
        </MainCard>

        <Grid
          item
          xs={12}>
          <Typography variant="h3">{t("Add a New Bank Account")}</Typography>
          <Chip
            label="Submit New Account"
            onClick={handlePopupOpen}
            color="primary"
            sx={{ cursor: "pointer", mt: 2 }}
          />
        </Grid>
      </Grid>
      <SubmitNewAccPopUp
        open={popupOpen}
        onClose={handlePopupClose}
        files={files}
        setFiles={setFiles}
        t={t}
      />
    </>
  );
};

export default ManageBankAccounts;
