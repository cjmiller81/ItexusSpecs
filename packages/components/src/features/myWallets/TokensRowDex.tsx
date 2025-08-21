import { Box, useTheme } from "@mui/system";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { useTranslation } from "react-i18next";
import WalletTokensOverview from "./DEX/WalletTokensOverview";
import MovingIcon from "@mui/icons-material/Moving";
import { Typography } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import { useAppSelector } from "../../slices";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useMemo, useCallback, useState, useEffect } from "react";
import { filterDustTokens } from "../../helpers/filterDustTokens";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WalletDeFiOverview from "./DEX/WalletDeFiOverview";
import WalletNftOverview from "./DEX/WalletNftOverview";
import AppsIcon from '@mui/icons-material/Apps';
import { WalletPortfolioResponse, NftHolding } from "../../models/wallet/walletPortfolio";
import { formatCurrencyWithSymbol } from "../../utils/currencyUtils";
import { useDustToggle } from "../../hooks/useDustToggle";
import { WALLET_COLORS, getTokensColor } from "../../constants/colors";

const NFT_MIN_VALUE = 0.01;
const INVALID_NFT_PATTERN = "INVALID AND WORTHLESS";

interface ExpandableRowDexProps extends GridRowProps {
  row: {
    address: string;
    [key: string]: any;
  };
  isExpanded: (rowId: string | number) => boolean;
  rowId: string | number;
  onHeightUpdate?: (rowId: string, height: string) => void;
}

interface WalletData {
  wallet: WalletPortfolioResponse | undefined;
  filteredTokens: any[];
  filteredTokensValue: number;
  totalDeFiValue: number;
  validNFTs: NftHolding[];
  totalNftValue: number;
  nftCount: number;
  sectionsWithData: number;
}

const useWalletData = (walletAddress: string, showDust: boolean): WalletData => {
  const { portfolioWalletData } = useAppSelector(state => state.wallets);

  return useMemo(() => {
    if (!Array.isArray(portfolioWalletData)) {
      return {
        wallet: undefined,
        filteredTokens: [],
        filteredTokensValue: 0,
        totalDeFiValue: 0,
        validNFTs: [],
        totalNftValue: 0,
        nftCount: 0,
        sectionsWithData: 0,
      };
    }

    const wallet = portfolioWalletData.find(
      (w) => w.walletAddress === walletAddress
    );

    if (!wallet) {
      return {
        wallet: undefined,
        filteredTokens: [],
        filteredTokensValue: 0,
        totalDeFiValue: 0,
        validNFTs: [],
        totalNftValue: 0,
        nftCount: 0,
        sectionsWithData: 0,
      };
    }

    const filteredTokens = showDust 
      ? wallet.tokenHoldings || []
      : filterDustTokens(wallet.tokenHoldings || []);

    const filteredTokensValue = filteredTokens.reduce(
      (sum, token) => sum + (token.balanceUSD || 0), 
      0
    );

    const defiPositions = wallet.deFiPositions || [];
    const totalDeFiValue = defiPositions.reduce(
      (sum: number, pos) => sum + (pos.valueUSD || 0), 
      0
    );

    const filterValidNFTs = (nfts: NftHolding[]): NftHolding[] =>
      nfts?.filter((nft) => {
        const isInvalid = nft.collectionName?.includes(INVALID_NFT_PATTERN);
        const hasMinimalValue = nft.estimatedValue > NFT_MIN_VALUE;
        return !isInvalid && hasMinimalValue;
      }) || [];

    const validNFTs = filterValidNFTs(wallet.nftHoldings || []);
    const totalNftValue = validNFTs.reduce((sum, nft) => sum + nft.estimatedValue, 0);
    const nftCount = wallet.nftHoldings?.length || 0;

    const hasTokens = filteredTokens.length > 0;
    const hasDeFi = defiPositions.length > 0;
    const hasNFTs = validNFTs.length > 0;
    const sectionsWithData = [hasTokens, hasDeFi, hasNFTs].filter(Boolean).length;

    return {
      wallet,
      filteredTokens,
      filteredTokensValue,
      totalDeFiValue,
      validNFTs,
      totalNftValue,
      nftCount,
      sectionsWithData,
    };
  }, [portfolioWalletData, walletAddress, showDust]);
};

const useFormattedCurrency = (value: number): string => {
  return useMemo(() => {
    return formatCurrencyWithSymbol(value);
  }, [value]);
};

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  value?: string;
  color: string;
  onToggleDust?: () => void;
  showDust?: boolean;
}> = ({ icon, title, value, color, onToggleDust, showDust }) => {
  const { t } = useTranslation("MyWalletsPage");
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
      mt={3}
    >
      <Box display="flex" alignItems="center">
        {icon}
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 600, 
          mb: 0, 
          fontSize: "1.125rem",
          color: color 
        }}>
          {title}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center">
                 {value && (
           <Typography
             variant="h6"
             sx={{ color, fontWeight: 500, mr: 3 }}
           >
             {value}
           </Typography>
         )}

        {onToggleDust && (
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ cursor: "pointer" }}
            onClick={onToggleDust}
          >
                         {showDust ? (
               <VisibilityOffIcon sx={{ color: WALLET_COLORS.dustToggle, fontSize: 22, mr: 0.5 }} />
             ) : (
               <RemoveRedEyeIcon sx={{ color: WALLET_COLORS.dustToggle, fontSize: 22, mr: 0.5 }} />
             )}
            <Typography variant="body2" color="text.secondary">
              {showDust ? t("HideDust") : t("ShowDust")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const ExpandableRowDex: React.FC<ExpandableRowDexProps> = (props) => {
  const { t } = useTranslation("MyWalletsPage");
  const theme = useTheme();
  const { showDust, toggleDust } = useDustToggle();

  const {
    filteredTokens,
    filteredTokensValue,
    totalDeFiValue,
    totalNftValue,
    nftCount,
    sectionsWithData,
  } = useWalletData(props.row.address, showDust);

  const formattedTokensValue = useFormattedCurrency(filteredTokensValue);
  const formattedDeFiValue = useFormattedCurrency(totalDeFiValue);
  const formattedNftValue = useFormattedCurrency(totalNftValue);

  const getMinHeight = () => {
    switch (sectionsWithData) {
      case 0: return "35vh";
      case 1: return "43vh";
      case 2: return "55vh";
      case 3: return "55vh";
      default: return "55vh";
    }
  };

  useEffect(() => {
    if (props.onHeightUpdate && props.isExpanded(props.rowId)) {
      props.onHeightUpdate(props.row.address, getMinHeight());
    }
  }, [sectionsWithData, props.onHeightUpdate, props.isExpanded, props.rowId, props.row.address]);

  const tokensIcon = (
    <MovingIcon 
      sx={{ 
        color: getTokensColor(theme.palette.mode === "dark"), 
        mr: 1, 
        fontSize: "40px" 
      }} 
    />
  );

  const defiIcon = (
    <LayersIcon sx={{ color: WALLET_COLORS.defi, mr: 1, fontSize: "40px" }} />
  );

  const nftIcon = (
    <AppsIcon sx={{ color: WALLET_COLORS.nft, mr: 1, fontSize: "40px" }} />
  );

  return (
    <Box sx={{ width: "100%" }}>
      <GridRow {...props} />
      {props.isExpanded(props.rowId) && (
                 <Box px={3} py={1} sx={{ width: "100%", maxWidth: "100%", minHeight: getMinHeight() }}>
           <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: "100%", maxWidth: "100%" }}>
             <Box sx={{ width: "100%", maxWidth: "100%" }}>
                             <SectionHeader
                 icon={tokensIcon}
                 title={t("WalletTokens")}
                 value={formattedTokensValue}
                 color={getTokensColor(theme.palette.mode === "dark")}
                 onToggleDust={toggleDust}
                 showDust={showDust}
               />

              <Box sx={{ width: "100%", maxWidth: "100%" }}> 
                <WalletTokensOverview 
                  walletAddress={props.row.address}
                  tokens={filteredTokens}
                />
              </Box>
            </Box>
          </Box>
          
                     <SectionHeader
             icon={defiIcon}
             title={t("DeFiPositions")}
             value={formattedDeFiValue}
             color={WALLET_COLORS.defi}
           />

          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <WalletDeFiOverview walletAddress={props.row.address} />
          </Box>

          <Box mt={4} sx={{ width: "100%", maxWidth: "100%" }}>
            <SectionHeader
              icon={nftIcon}
              title={t("NFTHoldings")}
              value={formattedNftValue}
              color={WALLET_COLORS.nft}
            />

            <WalletNftOverview walletAddress={props.row.address} />
          </Box>
        </Box>
      )}
    </Box>
  );
};