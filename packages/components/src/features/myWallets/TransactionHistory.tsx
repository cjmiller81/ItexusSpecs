import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  TablePagination,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Wallet } from "../../models";
import { useTranslation } from "react-i18next";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Mock transaction data
interface TokenDelta {
  symbol: string;
  amount: string;
  usdValue?: string;
  iconUrl?: string;
  type: "received" | "sent";
  fallbackColor?: string;
}

interface Transaction {
  id: string;
  type: "Swap" | "Claim" | "Withdraw";
  timestamp: string;
  description: string;
  tokenDeltas: TokenDelta[];
  gasCost: string;
  txHash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Swap",
    timestamp: "Dec 02, 2025 · 23:52",
    description: "Did something with Morpho: Bundler3",
    tokenDeltas: [
      {
        symbol: "USDT",
        amount: "+3,306.90 USDT",
        usdValue: "$3,307.96",
        iconUrl: "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
        type: "received",
        fallbackColor: "#10b981",
      },
      {
        symbol: "bbqUSDT",
        amount: "-3,112.96 bbqUSDT",
        type: "sent",
        fallbackColor: "#8b5cf6",
      },
    ],
    gasCost: "$2.34",
    txHash: "0xad7ccfb80bde4a8afd381c7ee8dba17703b87ed8742318f34135c67d1169a484",
  },
  {
    id: "2",
    type: "Claim",
    timestamp: "Dec 02, 2025 · 23:30",
    description: "Claimed from Angle Protocol: Distributor",
    tokenDeltas: [
      {
        symbol: "USDC",
        amount: "+0.90 USDC",
        usdValue: "$0.90",
        iconUrl: "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        type: "received",
        fallbackColor: "#3b82f6",
      },
      {
        symbol: "opASF",
        amount: "+0.82 opASF",
        type: "received",
        fallbackColor: "#f59e0b",
      },
    ],
    gasCost: "$1.12",
    txHash: "0xca7cabf090fe7651596b13f219e1204c41da448264c73fb18e457047cd885991",
  },
  {
    id: "3",
    type: "Withdraw",
    timestamp: "Dec 02, 2025 · 23:24",
    description: "Withdrew from Aave V3",
    tokenDeltas: [
      {
        symbol: "DAI",
        amount: "+4,061.41 DAI",
        usdValue: "$4,060.53",
        iconUrl: "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
        type: "received",
        fallbackColor: "#8b5cf6",
      },
      {
        symbol: "uDAI",
        amount: "-4,061.41 uDAI",
        type: "sent",
        fallbackColor: "#ef4444",
      },
    ],
    gasCost: "$3.21",
    txHash: "0x22882f97c4115615c19a7143e8f6fd7ff1b867594c98fecb4f4305cd2f24a76f",
  },
  {
    id: "4",
    type: "Withdraw",
    timestamp: "Dec 02, 2025 · 23:18",
    description: "Withdrew from Timeswap",
    tokenDeltas: [
      {
        symbol: "USDC",
        amount: "+3,087.83 USDC",
        usdValue: "$3,087.15",
        iconUrl: "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        type: "received",
        fallbackColor: "#3b82f6",
      },
      {
        symbol: "tUSDC",
        amount: "-3,087.83 tUSDC",
        type: "sent",
        fallbackColor: "#06b6d4",
      },
    ],
    gasCost: "$2.89",
    txHash: "0xd2a15fb040531a765544a285e04e1bde4f1032873c8704cf349931279d73633f",
  },
  {
    id: "5",
    type: "Claim",
    timestamp: "Dec 02, 2025 · 23:11",
    description: "Claimed FLUID rewards",
    tokenDeltas: [
      {
        symbol: "FLUID",
        amount: "+0.91 FLUID",
        type: "received",
        fallbackColor: "#8b5cf6",
      },
    ],
    gasCost: "$1.45",
    txHash: "0xd07e51d0d428a69101daac50a7b4fa0be5c2592beb14391ceff33c5b720f8d66",
  },
];

interface TransactionHistoryProps {
  wallets: Wallet[] | null;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ wallets }) => {
  const { t } = useTranslation("MyWalletsPage");
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("90");
  const [transactionType, setTransactionType] = useState<string>("all");
  const [tokenFilter, setTokenFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const selectedWallet = wallets?.find(w => w.walletId === selectedWalletId);

  // Filter transactions based on selected filters
  const filteredTransactions = React.useMemo(() => {
    let filtered = [...mockTransactions];

    // Filter by transaction type
    if (transactionType !== "all") {
      filtered = filtered.filter(tx => {
        const typeMap: Record<string, string> = {
          swap: "Swap",
          claim: "Claim",
          withdraw: "Withdraw",
        };
        return tx.type === typeMap[transactionType];
      });
    }

    // Filter by token
    if (tokenFilter !== "all") {
      filtered = filtered.filter(tx => {
        return tx.tokenDeltas.some(delta => {
          const symbol = delta.symbol.toLowerCase();
          return symbol.includes(tokenFilter.toLowerCase());
        });
      });
    }

    // Filter by time range
    if (timeRange !== "all") {
      const days = parseInt(timeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      cutoffDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(tx => {
        // Parse timestamp like "Dec 02, 2025 · 23:52"
        const dateStr = tx.timestamp.split(" · ")[0];
        const txDate = new Date(dateStr);
        txDate.setHours(0, 0, 0, 0);
        return txDate >= cutoffDate;
      });
    }

    return filtered;
  }, [transactionType, tokenFilter, timeRange]);

  // Reset to page 0 when filters change
  React.useEffect(() => {
    setPage(0);
  }, [transactionType, tokenFilter, timeRange]);

  const handleWalletSelect = (event: SelectChangeEvent<string>) => {
    setSelectedWalletId(event.target.value);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Swap":
        return "⇅";
      case "Claim":
        return "💰";
      case "Withdraw":
        return "←";
      default:
        return "•";
    }
  };

  const getTransactionIconColor = (type: string) => {
    switch (type) {
      case "Swap":
        return { bg: "rgba(139, 92, 246, 0.1)", color: "#a78bfa" };
      case "Claim":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "Withdraw":
        return { bg: "rgba(251, 146, 60, 0.1)", color: "#fb923c" };
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b" };
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Swap":
        return { bg: "rgba(139, 92, 246, 0.1)", color: "#a78bfa" };
      case "Claim":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "Withdraw":
        return { bg: "rgba(251, 146, 60, 0.1)", color: "#fb923c" };
      default:
        return { bg: "rgba(100, 116, 139, 0.1)", color: "#64748b" };
    }
  };

  const getTokenIconFallback = (symbol: string) => {
    return symbol.substring(0, 2).toUpperCase();
  };

  const getTokenIconColor = (symbol: string, fallbackColor?: string) => {
    if (fallbackColor) return fallbackColor;
    const colors = [
      "#10b981", "#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444", "#06b6d4",
      "#a78bfa", "#fbbf24", "#f97316", "#ec4899"
    ];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTxHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const getEtherscanUrl = (hash: string) => {
    return `https://etherscan.io/tx/${hash}`;
  };

  const totalTransactions = filteredTransactions.length;
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Wallet Selection */}
      <Box sx={{ mb: 3 }}>
        <Select
          displayEmpty
          value={selectedWalletId}
          onChange={handleWalletSelect}
          renderValue={() => selectedWalletId ? selectedWallet?.walletName || "" : t("SelectSavedWAallet", { ns: "IndexModelingSection", defaultValue: "SELECT SAVED WALLET" })}
          sx={{
            backgroundColor: "#219a83",
            fontSize: "12px",
            fontWeight: 500,
            color: "white",
            width: "100%",
            maxWidth: "400px",
            maxHeight: "40px",
            marginBottom: selectedWallet ? "12px" : 0,
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          {wallets?.map(wallet => (
            <MenuItem key={wallet.walletId} value={wallet.walletId}>
              {wallet.walletName || wallet.address}
            </MenuItem>
          ))}
        </Select>

        {selectedWallet && (
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.875rem",
              color: "#94a3b8",
              mt: 1,
            }}
          >
            {selectedWallet.address}
          </Typography>
        )}
      </Box>

      {selectedWallet && (
        <>
          {/* Transaction Section */}
          <Card
            sx={{
              background: "#363640",
              backdropFilter: "blur(10px)",
              border: "1px solid #4E4E57",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                padding: "1.5rem",
                borderBottom: "1px solid #4E4E57",
              }}
            >
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, color: "#ffffff" }}>
                Transaction History
              </Typography>
            </Box>

            {/* Filters */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                padding: "1.5rem",
                borderBottom: "1px solid #4E4E57",
                flexWrap: "wrap",
              }}
            >
              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{
                    backgroundColor: "#363640",
                    border: "1px solid #4E4E57",
                    borderRadius: "0.5rem",
                    color: "#cbd5e1",
                    fontSize: "0.875rem",
                    "& .MuiSelect-icon": { color: "#cbd5e1" },
                  }}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 90 days</MenuItem>
                  <MenuItem value="all">All time</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  sx={{
                    backgroundColor: "#363640",
                    border: "1px solid #4E4E57",
                    borderRadius: "0.5rem",
                    color: "#cbd5e1",
                    fontSize: "0.875rem",
                    "& .MuiSelect-icon": { color: "#cbd5e1" },
                  }}
                >
                  <MenuItem value="all">All types</MenuItem>
                  <MenuItem value="swap">Swaps</MenuItem>
                  <MenuItem value="claim">Claims</MenuItem>
                  <MenuItem value="withdraw">Withdrawals</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <Select
                  value={tokenFilter}
                  onChange={(e) => setTokenFilter(e.target.value)}
                  sx={{
                    backgroundColor: "#363640",
                    border: "1px solid #4E4E57",
                    borderRadius: "0.5rem",
                    color: "#cbd5e1",
                    fontSize: "0.875rem",
                    "& .MuiSelect-icon": { color: "#cbd5e1" },
                  }}
                >
                  <MenuItem value="all">All tokens</MenuItem>
                  <MenuItem value="usdc">USDC</MenuItem>
                  <MenuItem value="usdt">USDT</MenuItem>
                  <MenuItem value="dai">DAI</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Transaction List */}
            <Box sx={{ padding: "1.5rem" }}>
              {displayedTransactions.map((transaction) => {
                const iconStyle = getTransactionIconColor(transaction.type);
                const badgeStyle = getBadgeColor(transaction.type);

                return (
                  <Card
                    key={transaction.id}
                    sx={{
                      background: "#363640",
                      border: "1px solid #4E4E57",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      mb: 1.5,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "#404050",
                        borderColor: "#5E5E67",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {/* Transaction Icon */}
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: "3rem",
                          height: "3rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.5rem",
                          fontSize: "1.5rem",
                          backgroundColor: iconStyle.bg,
                          color: iconStyle.color,
                        }}
                      >
                        {getTransactionIcon(transaction.type)}
                      </Box>

                      {/* Transaction Details */}
                      <Box sx={{ flex: 1 }}>
                        {/* Meta */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                          <Box
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              padding: "0.25rem 0.5rem",
                              borderRadius: "0.25rem",
                              backgroundColor: badgeStyle.bg,
                              color: badgeStyle.color,
                            }}
                          >
                            {transaction.type}
                          </Box>
                          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                            🕐 {transaction.timestamp}
                          </Typography>
                        </Box>

                        {/* Description */}
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            color: "#e2e8f0",
                            fontWeight: 500,
                            mb: 1.5,
                          }}
                        >
                          {transaction.description}
                        </Typography>

                        {/* Token Deltas */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                          {transaction.tokenDeltas.map((delta, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                backgroundColor:
                                  delta.type === "received"
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : "rgba(251, 146, 60, 0.1)",
                                color: delta.type === "received" ? "#10b981" : "#fb923c",
                              }}
                            >
                              {delta.iconUrl ? (
                                <img
                                  src={delta.iconUrl}
                                  alt={delta.symbol}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = "inline-flex";
                                  }}
                                />
                              ) : null}
                              <Box
                                sx={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  display: delta.iconUrl ? "none" : "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.625rem",
                                  fontWeight: "bold",
                                  color: "#ffffff",
                                  backgroundColor: getTokenIconColor(delta.symbol, delta.fallbackColor),
                                }}
                              >
                                {getTokenIconFallback(delta.symbol)}
                              </Box>
                              <span>{delta.amount}</span>
                              {delta.usdValue && (
                                <span style={{ opacity: 0.75 }}>{delta.usdValue}</span>
                              )}
                            </Box>
                          ))}
                        </Box>

                        {/* Footer */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            fontSize: "0.75rem",
                            color: "#64748b",
                          }}
                        >
                          <span>Gas: {transaction.gasCost}</span>
                          <a
                            href={getEtherscanUrl(transaction.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#64748b",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.25,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#10b981";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#64748b";
                            }}
                          >
                            {formatTxHash(transaction.txHash)}
                            <OpenInNewIcon sx={{ fontSize: "0.875rem" }} />
                          </a>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalTransactions}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Card>
        </>
      )}
    </Box>
  );
};

