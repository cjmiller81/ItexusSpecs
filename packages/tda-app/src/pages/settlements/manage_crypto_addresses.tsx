import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography, useTheme } from "@mui/material";
import MainCard from "../../../src/components/MainCard";
import CryptoAddressesTable from "../../../src/features/tables/crypto-addresses-table/CryptoAddressesTable";
import { getManageCryptoAddressesTableColumns } from "features/tables/crypto-addresses-table/columns";
import { useAppDispatch, useAppSelector } from "libs/redux/Store";
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { deleteCryptoAddress, fetchCryptoAddress } from "features/tables/crypto-addresses-table/cryptoAddressesSlice";
import AddNewAddressForm from "features/tables/crypto-addresses-table/addNewAddressForm";
import Box from "@mui/material/Box";
import { borderRadius } from "@mui/system";

const ManageCryptoAddresses: React.FC = () => {
  const dispatch = useAppDispatch();
  const cryptoAddresses = useAppSelector(state => state.cryptoAddresses.accounts);
  const { t } = useTranslation("ManageCryptoAddresses");
  const theme = useTheme();
  const [sorting, setSorting] = useState<SortingState>([{ id: "transactTime", desc: true }]);

  useEffect(() => {
    dispatch(fetchCryptoAddress());
  }, [dispatch]);

  const handleRemoveAccount = (id: string) => {
    dispatch(deleteCryptoAddress(id));
  };

  const handleSortingChange: OnChangeFn<SortingState> = updaterOrValue => {
    const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
  };

  return (
    <>
      <Typography variant="h3">{t("ManageCryptoAddressTitle")}</Typography>
      <Grid
        container
        mt={2}
        spacing={2}>
        <Grid
          item
          xs={12}>
          <MainCard
            content={false}
            sx={{ bgcolor: "primary.lighter", position: "relative", width: "100%", borderRadius: "10px" }}>
            <CryptoAddressesTable
              data={cryptoAddresses}
              columns={getManageCryptoAddressesTableColumns(theme, handleRemoveAccount, t)}
              sorting={sorting}
              onSortingChange={handleSortingChange}
            />
          </MainCard>
        </Grid>
        <Grid
          item
          xs={12}>
          <Box
            mt={4}
            component="div">
            <Typography
              variant="h3"
              sx={{ mb: 2 }}>
              {t("AddANewAddress")}
            </Typography>
            <AddNewAddressForm />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageCryptoAddresses;
