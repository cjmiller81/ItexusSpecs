import { Box, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import AccountsTable from "./AccountsTable";
import { ExchangeAccount } from "../../../../services/tradingPlatformService";

type Props = {
  accountNumber: string;
  tableData: ExchangeAccount[];
  onAccountSelected: (newAccountNumberState: ExchangeAccount) => void;
  handleStatusUpdate: () => void;
};

export default function Accounts({ accountNumber, tableData, onAccountSelected, handleStatusUpdate}: Props) {
  const onAccountChange = useCallback((accntNum: string): void => {
    if (accntNum.length > 0) {
      let selectedAccount = tableData.find(row => row.accountNumber === accntNum);
      if (selectedAccount) {
        onAccountSelected(selectedAccount);
      }
    } else {
      handleStatusUpdate();
    }
  }, [handleStatusUpdate, onAccountSelected, tableData]);

  useEffect(() => {
    handleStatusUpdate();
  }, [accountNumber, handleStatusUpdate, tableData]);

  return (
    <>
      <Box sx={{ marginTop: "30px" }}>
        <Typography
          variant="button"
          display="block"
          fontSize="h6.fontSize"
          textAlign="left"
          gutterBottom
          sx={{ marginBottom: "20px", fontWeight: "900" }}
        >
          Select your Tastytrade account which will run the /ES autotrading strategy.
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <AccountsTable accountNumber={accountNumber} data={tableData} onChange={onAccountChange} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
