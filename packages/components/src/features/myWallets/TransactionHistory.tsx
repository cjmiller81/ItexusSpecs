import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  FormControl,
} from "@mui/material";
import { Wallet } from "../../models";
import { useTranslation } from "react-i18next";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTransactionHistory } from "../../hooks/useTransactionHistory";
import { formatAddress } from "../../utils/formatters";
import { exportTransactionsXlsx } from "../../utils/exportXlsx";
import { Spinner, Center } from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRow } from "./TransactionRow";
import Pagination from "./Pagination";
import "./TransactionHistory.css";

interface TransactionHistoryProps {
  walletAddress?: string;
  wallets?: Wallet[] | null;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress, wallets }) => {
  const { t } = useTranslation("MyWalletsPage");
  // local selection when wallets list is provided
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");

  // resolve address: explicit prop walletAddress wins, otherwise selected from wallets
  const resolvedAddress = walletAddress ?? wallets?.find(w => w.walletId === selectedWalletId)?.address ?? wallets?.[0]?.address ?? "";

  const {
    loading,
    error,
    paginatedTransactions,
    filteredTransactions,
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    tokenFilter, setTokenFilter,
    hideSpam, setHideSpam,
    uniqueTokens,
    page, setPage,
    totalPages,
    totalFiltered,
    spamCount
  } = useTransactionHistory(resolvedAddress);

  // memoized count text to avoid recalcs — must be declared before any early returns
  const sectionCountText = useMemo(() => {
    return `${totalFiltered} transactions${hideSpam && spamCount ? ` (${spamCount} hidden)` : ""}`;
  }, [totalFiltered, hideSpam, spamCount]);

  // keep dropdown in sync if external walletAddress prop provided
  React.useEffect(() => {
    if (walletAddress && wallets) {
      const w = wallets.find(w => w.address === walletAddress);
      if (w) setSelectedWalletId(w.walletId);
    }
  }, [walletAddress, wallets]);

  const handleWalletSelect = (e: SelectChangeEvent<string>) => {
    setSelectedWalletId(e.target.value);
    // reset page when wallet changes
    setPage(1);
  };

  if (!resolvedAddress) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {t?.("SelectSavedWallet") ?? "Select a wallet to view transactions"}
        </Typography>
        {wallets && (
          <FormControl sx={{ mt: 2, minWidth: 240 }}>
            <Select
              displayEmpty
              value={selectedWalletId}
              onChange={handleWalletSelect}
              renderValue={() =>
                selectedWalletId
                  ? wallets.find(w => w.walletId === selectedWalletId)?.walletName || ""
                  : t?.("SelectSavedWAallet", { ns: "IndexModelingSection", defaultValue: "SELECT SAVED WALLET" })
              }
            >
              {wallets.map(w => (
                <MenuItem key={w.walletId} value={w.walletId}>
                  {w.walletName ?? w.address}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    );
  }

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="lg" thickness="4px" speed="0.65s" color="purple.400" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" textAlign="center" py={6}>
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Something went wrong
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="transaction-history">
      {/* Header */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>

      {/* Wallet Selection */}
      <Box sx={{ mb: 3 }}>
        <Select
          displayEmpty
          value={selectedWalletId}
          onChange={handleWalletSelect}
          renderValue={() => selectedWalletId ? wallets?.find(w => w.walletId === selectedWalletId)?.walletName || "" : t("SelectSavedWAallet", { ns: "IndexModelingSection", defaultValue: "SELECT SAVED WALLET" })}
          sx={{
            backgroundColor: "#219a83",
            fontSize: "12px",
            fontWeight: 500,
            color: "white",
            width: "100%",
            maxWidth: "400px",
            maxHeight: "40px",
            marginBottom: selectedWalletId ? "12px" : 0,
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          {wallets?.map(wallet => (
            <MenuItem key={wallet.walletId} value={wallet.walletId}>
              {wallet.walletName || wallet.address}
            </MenuItem>
          ))}
        </Select>

        {resolvedAddress && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              mt: 1,
            }}
          >
            {resolvedAddress}
          </Typography>
        )}
      </Box>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => exportTransactionsXlsx(filteredTransactions)}
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981",
              padding: "0.5rem 1rem",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            📊 Export XLSX
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="transaction-section" style={{ marginTop: 12 }}>
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #4E4E57" }}>
          <span className="section-title" style={{ fontWeight: 600 }}>Transactions</span>
          <span className="section-count" style={{ color: "#64748b" }}>{sectionCountText}</span>
        </div>

        {/* Filters */}
        <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid #4E4E57" }}>
          <TransactionFilters
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            tokenFilter={tokenFilter}
            setTokenFilter={setTokenFilter}
            hideSpam={hideSpam}
            setHideSpam={setHideSpam}
            uniqueTokens={uniqueTokens}
          />
        </div>

        {/* Transaction List */}
        <div className="transaction-list" style={{ padding: "0.75rem 1rem", maxHeight: "60vh", overflowY: "auto" }}>
          {paginatedTransactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              📭 No transactions found matching filters
            </div>
          ) : (
            paginatedTransactions.map(tx => (
              <TransactionRow key={tx.hash} transaction={tx} />
            ))
          )}
        </div>

        {/* Pagination */}
        <div style={{ padding: 12, borderTop: "1px solid #4E4E57", display: "flex", justifyContent: "center" }}>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalFiltered}
            itemsPerPage={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  );
};