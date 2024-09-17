import { Box, Grid, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { ExchangeAccount } from "../../../../services/tradingPlatformService";
import AccountsTable from "./AccountsTable";

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
          SELECT WHICH TASTYTRADE ACCOUNT WILL RUN THE 0DTE TRADING SYSTEM
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
