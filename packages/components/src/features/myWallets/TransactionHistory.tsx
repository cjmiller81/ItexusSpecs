import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  FormControl,
  Button,
  TablePagination,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Wallet } from "../../models";
import { useTranslation } from "react-i18next";
import DownloadIcon from "@mui/icons-material/Download";
import { useTransactionHistory } from "../../hooks/useTransactionHistory";
import { formatAddress } from "../../utils/formatters";
import { exportTransactionsXlsx, ExportOptions } from "../../utils/exportXlsx";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRow } from "./TransactionRow";
import "./TransactionHistory.css";
import { useTheme } from "@mui/system";
import { TransactionSyncStatus } from "./TransactionSyncStatus";
import { TransactionSyncButton } from "./TransactionSyncButton";

interface TransactionHistoryProps {
  walletAddress?: string;
  wallets?: Wallet[] | null;
}

type DateRange = { from: Date; to: Date }; // ISO yyyy-mm-dd

const PRESETS: Record<string, number | null> = {
  'all': null,
  'last_7': 7,
  'last_30': 30,
  'last_90': 90,
  'custom': null,
};

function formatISO(date: Date) {
  return date.toISOString().slice(0, 10); // yyyy-mm-dd
}

function computeRange(days: number | null): DateRange {
  const to = new Date();
  const from = days ? new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000) : new Date();
  return { from, to };
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress, wallets }) => {
  const { t } = useTranslation("MyWalletsPage");
  // local selection when wallets list is provided
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [hasUserSelectedWallet, setHasUserSelectedWallet] = useState<boolean>(false);

  // Determine if we're in "selection mode" (wallets provided but no explicit walletAddress)
  const isSelectionMode = !walletAddress && wallets && wallets.length > 0;

  // resolve address: explicit prop walletAddress wins, otherwise selected from wallets
  const resolvedAddress = useMemo(() => {
    // If explicit walletAddress is provided, use it immediately
    if (walletAddress) {
      setHasUserSelectedWallet(true);
      return walletAddress;
    }

    // If we have a selected wallet ID from user selection
    if (selectedWalletId && wallets) {
      const selectedWallet = wallets.find(w => w.walletId === selectedWalletId);
      if (selectedWallet) {
        setHasUserSelectedWallet(true);
        return selectedWallet.address;
      }
    }

    // No selection yet
    setHasUserSelectedWallet(false);
    return "";
  }, [walletAddress, wallets, selectedWalletId]);

  const {
    // server / UI state
    loading,
    error,
    data,
    paginatedTransactions,
    dateFilter, setDateFilter,
    typeFilter, setTypeFilter,
    tokenFilter, setTokenFilter,
    hideSpam, setHideSpam,
    uniqueTokens,
    page, setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalCount,
    filteredCount,
    spamCount,
    hasMore,
    allDateFilterRange,
    fetchAllTransactionsForExport,
  } = useTransactionHistory(resolvedAddress);

  // memoized count text to avoid recalcs — must be declared before any early returns
  const sectionCountText = useMemo(() => {
    return `${filteredCount} transactions${hideSpam && spamCount ? ` (${spamCount} hidden)` : ""}`;
  }, [filteredCount, hideSpam, spamCount]);

  // keep dropdown in sync if external walletAddress prop provided
  React.useEffect(() => {
    if (walletAddress && wallets) {
      const w = wallets.find(w => w.address === walletAddress);
      if (w) {
        setSelectedWalletId(w.walletId);
        setHasUserSelectedWallet(true);
      }
    }
  }, [walletAddress, wallets]);

  const handleWalletSelect = (e: SelectChangeEvent<string>) => {
    const newWalletId = e.target.value;
    setSelectedWalletId(newWalletId);
    setHasUserSelectedWallet(true);
    // reset page when wallet changes (server expects 0-based page)
    setPage(0);
  };

  // Date range state
  const [preset, setPreset] = useState<string>('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(allDateFilterRange.from);
  const [toDate, setToDate] = useState<Date | undefined>(allDateFilterRange.to);

  const theme = useTheme();
  const borderColors = useMemo(() => ({ borderColor: theme.palette.mode === "dark" ? "#4E4E57" : "#B5B1B1" }), [theme]);

  useEffect(() => {
    // notify parent / trigger API whenever preset changes to non-custom
    if (preset !== 'custom') {
      if (preset === 'all') {
        // "All Time" — clear date filter so API can request all records
        console.log('[DatePreset] preset=all -> clearing dateFilter');
        setDateFilter('all');
        setPage(0);
        setFromDate(allDateFilterRange.from);
        setToDate(allDateFilterRange.to);
        return;
      }

      const days = PRESETS[preset];
      const r = computeRange(days);
      setFromDate(r.from);
      setToDate(r.to);
      console.log('[DatePreset] setting dateFilter', r);
      setDateFilter({ from: formatISO(r.from), to: formatISO(r.to) });
      setPage(0); // reset to first page (server 0-based) to trigger refetch / UI update
    }
    // if preset === 'custom' do not auto-trigger here
  }, [preset]);

  useEffect(() => {
    if (preset !== 'all') return;

    if (fromDate !== allDateFilterRange.from || toDate !== allDateFilterRange.to) {
      setFromDate(allDateFilterRange.from);
      setToDate(allDateFilterRange.to);
    }

    return () => {
      setFromDate(undefined);
      setToDate(undefined);
    }
  }, [allDateFilterRange]);

  function handleApplyCustom() {
    // validate
    if (!fromDate || !toDate) {
      console.warn('[DateRange] Apply aborted - missing from/to', { fromDate, toDate });
      return;
    }
    if (fromDate > toDate) {
      console.warn('fromDate must be <= toDate');
      return;
    }
    console.log('[DateRange] Apply clicked -> setting dateFilter', { from: fromDate, to: toDate });
    setDateFilter({ from: formatISO(fromDate), to: formatISO(toDate) });
    setPage(0); // ensure API is called for server page 0 with new date filter
  }

  const refreshTransactions = () => {
    console.log('[Refresh] Refreshing transactions with current filters...');
    // ensure we pass strings (ISO dates) to the API, or 'all' if no explicit range
    if (fromDate && toDate) {
      setDateFilter({ from: formatISO(fromDate), to: formatISO(toDate) });
    } else {
      setDateFilter('all');
    }
    setPage(0);
  };

  const handleSyncComplete = () => {
    console.log('[Sync] Sync completed, refreshing transactions...');
    refreshTransactions();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
        <CircularProgress size={48} thickness={4} sx={{ color: "#9F7AEA" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          flexDirection: "column",
          textAlign: "center",
          alignItems: "center",
          py: 6,
          "& .MuiAlert-icon": { fontSize: 40, mr: 0, mb: 1, padding: 0 },
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <AlertTitle sx={{ mt: 2, mb: 1, fontSize: "1.125rem" }}>
          Something went wrong
        </AlertTitle>
        <Box sx={{ maxWidth: 360, mx: "auto" }}>
          {error.message}
        </Box>
      </Alert>
    );
  }

  return (
    <div className="transaction-history">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>

      {/* Wallet selection with address underneath, sync controls directly to the right of dropdown */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "flex-start", gap: 2, flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
        {/* Left column: dropdown + address */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Select
            displayEmpty
            value={selectedWalletId}
            onChange={handleWalletSelect}
            renderValue={() => selectedWalletId ? wallets?.find(w => w.walletId === selectedWalletId)?.walletName || "" : "SELECT SAVED WALLET" }
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
                mt: 0.5,
              }}
            >
              {resolvedAddress}
            </Typography>
          )}
        </div>

        {/* Sync controls placed immediately to the right of the dropdown */}
        {resolvedAddress && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: isSelectionMode ? 18 : 0, justifyContent: "flex-end", flexGrow: 1 }}>
            <TransactionSyncButton walletAddress={resolvedAddress} onSyncComplete={handleSyncComplete} />
            <TransactionSyncStatus walletAddress={resolvedAddress} />
          </div>
        )}
      </Box>
      </div>

      {/* Main Section - Only show when we have a resolved address */}
      {resolvedAddress && (
        <div className="transaction-section" style={{ marginTop: 12, ...borderColors }}>
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #4E4E57",
              ...borderColors
            }}
          >
            <span className="section-title" style={{ fontWeight: 600 }}>Transactions</span>
            <div>
              <span className="section-count" style={{ color: "#64748b" }}>{sectionCountText}</span>
              <Button
                onClick={async () => {
                  try {
                    const allTransactions = await fetchAllTransactionsForExport();

                    if (allTransactions.length === 0) {
                      console.warn('No transactions to export');
                      return;
                    }

                    let exportDateRange: 'all' | 'last_7' | 'last_30' | 'custom' = 'all';
                    let startDate: Date | undefined;
                    let endDate: Date | undefined;

                    if (dateFilter !== 'all' && typeof dateFilter !== 'string') {
                      // Custom date range
                      exportDateRange = 'custom';
                      startDate = new Date(dateFilter.from);
                      endDate = new Date(dateFilter.to);
                    } else if (dateFilter === 'all') {
                      exportDateRange = 'all';
                    } else if (dateFilter === 'last_7') {
                      exportDateRange = 'last_7';
                    } else if (dateFilter === 'last_30') {
                      exportDateRange = 'last_30';
                    }

                    const opts: ExportOptions = {
                      dateRange: exportDateRange,
                      startDate,
                      endDate,
                      selectedTypes: typeFilter === 'all' ? ['all'] : [typeFilter.toLowerCase()],
                      hideSpam: hideSpam
                    };

                    exportTransactionsXlsx(allTransactions, opts);
                  } catch (err) {
                    console.error('Export failed:', err);
                  }
                }}
                variant="outlined"
                sx={{ ml: 4, marginRight: "17px" }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <DownloadIcon />
                  {t("Export")}
                </Box>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid", ...borderColors }}>
            <TransactionFilters
              preset={preset}
              setPreset={setPreset}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              onApplyCustom={handleApplyCustom}
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
                <TransactionRow key={tx.hash} transaction={tx} borderColors={borderColors} />
              ))
            )}
          </div>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredCount}
            // map server 0-based page -> UI 1-based page
            page={page}
            rowsPerPage={pageSize}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setPageSize(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </div>
      )}
     </div>
   );
 };
