import React, { useMemo } from "react";
import { Box, Typography, useTheme, Card } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAppSelector } from "../../../slices";
import { NftCell } from "./NftCell";
import { useTranslation } from "react-i18next";
import { filterValidNFTs, processNFTImageUrl } from "../../../utils/nftUtils";
import { formatCurrencyWithSymbol } from "../../../utils/currencyUtils";
import { WALLET_COLORS } from "../../../constants/colors";
import { getNetworkConfig } from "../../../constants/networks";
import { TABLE_SIZES } from "../../../constants/tableSizes";
import { useDataGridStyles } from "../../../hooks/useDataGridStyles";

interface WalletNftOverviewProps {
  walletAddress: string;
}

interface NftRowData {
  id: string;
  imageUrl: string | null;
  collectionName: string;
  tokenId: string;
  network: string;
  estimatedValue: number;
  portfolioPercent: number;
}

const useWalletNFTs = (walletAddress: string) => {
  const { portfolioWalletData } = useAppSelector((state) => state.wallets);

  return useMemo(() => {
    const wallet = portfolioWalletData.find((w) => w.walletAddress === walletAddress);
    const validNFTs = filterValidNFTs(wallet?.nftHoldings || []);
    const totalValue = validNFTs.reduce((sum, nft) => sum + nft.estimatedValue, 0);

    const rows: NftRowData[] = validNFTs.map((nft, idx) => {
      const imageUrl = processNFTImageUrl(nft.imageUrl);

      return {
        id: `${nft.collectionContractAddress}-${nft.tokenId}-${idx}`,
        imageUrl,
        collectionName: nft.collectionName,
        tokenId: nft.tokenId,
        network: nft.network,
        estimatedValue: nft.estimatedValue,
        portfolioPercent: (nft.estimatedValue / totalValue) * 100,
      };
    });

    return {
      rows,
      totalValue,
      hasNFTs: validNFTs.length > 0,
    };
  }, [portfolioWalletData, walletAddress]);
};

const NetworkBadge: React.FC<{ network: string }> = ({ network }) => {
  const theme = useTheme();
  const networkName = getNetworkConfig(network);

  return (
    <Box
      sx={{
        px: 1,
        py: 0.5,
        borderRadius: "4px",
        fontSize: "0.75rem",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        backgroundColor: "rgba(71, 85, 105, 0.2)",
        color: theme.palette.mode === "dark" ? "#cbd5e1" : "black",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 400,
        minWidth: TABLE_SIZES.NETWORK_BADGE_MIN_WIDTH,
      }}
    >
      {networkName}
    </Box>
  );
};

const PortfolioProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();
  const percentage = Math.min(value, 100);

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" gap={1}>
      <Typography fontSize={14}>{value.toFixed(1)}%</Typography>
      <Box
        sx={{
          width: TABLE_SIZES.PROGRESS_BAR_WIDTH,
          height: TABLE_SIZES.PROGRESS_BAR_HEIGHT,
          bgcolor: theme.palette.mode === "dark" ? "rgba(71,85,105,0.5)" : "#ccc",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${percentage}%`,
            bgcolor: WALLET_COLORS.nft,
            transition: "width 0.3s ease-in-out",
          }}
        />
      </Box>
    </Box>
  );
};

const EmptyState: React.FC = () => (
  <Typography>No valid NFT holdings found for this wallet.</Typography>
);

const WalletNftOverview: React.FC<WalletNftOverviewProps> = ({ walletAddress }) => {
  const theme = useTheme();
  const { t } = useTranslation("MyWalletsPage");
  const { rows, hasNFTs } = useWalletNFTs(walletAddress);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: "nft",
      headerName: t("NFT"),
      minWidth: 200,
      maxWidth: 400,
      flex: 1,
      renderCell: ({ row }) => (
        <NftCell
          imageUrl={row.imageUrl}
          collectionName={row.collectionName}
          tokenId={row.tokenId}
        />
      ),
    },
    {
      field: "network",
      headerName: t("Network"),
      minWidth: 80,
      maxWidth: 120,
      flex: 1,
      renderCell: ({ value }) => <NetworkBadge network={value} />,
    },
    {
      field: "estimatedValue",
      headerName: t("EstimatedValue"),
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography fontWeight={600}>
          {formatCurrencyWithSymbol(value)}
        </Typography>
      ),
    },
    {
      field: "portfolioPercent",
      headerName: t("OfPortfolio"),
      minWidth: 120,
      maxWidth: 200,
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => <PortfolioProgressBar value={Number(value)} />,
    },
  ], [t]);

  const dataGridStyles = useDataGridStyles();

  if (!hasNFTs) {
    return <EmptyState />;
  }

  return (
    <Box mt={2} sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <Card elevation={3} sx={{ width: "100%", maxWidth: "100%" }}>
        <Box sx={{ width: "100%", maxWidth: "100%" }}>
                     <DataGrid
             rows={rows}
             columns={columns}
             hideFooter
             disableColumnMenu
             disableRowSelectionOnClick
                         sx={{
               ...dataGridStyles,
               width: "100%",
               maxWidth: "100%",
               minHeight: "auto !important",
               height: "auto !important",
               "& .MuiDataGrid-main": {
                 ...dataGridStyles["& .MuiDataGrid-main"],
                 width: "100%",
                 maxWidth: "100%",
                 minHeight: "auto !important",
                 height: "auto !important"
               }
             }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default WalletNftOverview;
