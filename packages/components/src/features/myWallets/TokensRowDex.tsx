import { Box, useTheme } from "@mui/system";
import { GridRow, GridRowProps } from "@mui/x-data-grid";
import { nativeBarSx } from "../../components/common/SimpleBarStyled";
import { useTranslation } from "react-i18next";
import WalletTokensOverview from "./DEX/WalletTokensOverview";
import MovingIcon from "@mui/icons-material/Moving";
import { Typography } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import { useAppSelector } from "../../slices";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useMemo, useCallback, useEffect } from "react";
import { filterDustTokens } from "../../helpers/filterDustTokens";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WalletDeFiOverview from "./DEX/WalletDeFiOverview";
import WalletNftOverview from "./DEX/WalletNftOverview";
import AppsIcon from "@mui/icons-material/Apps";
import type { Wallet } from "../../models";
import type { NftHolding, TokenHolding, WalletPortfolioResponse } from "../../models/wallet/walletPortfolio";
import { formatCurrencyWithSymbol } from "../../utils/currencyUtils";
import { useDustToggle } from "../../hooks/useDustToggle";
import { WALLET_COLORS, getTokensColor } from "../../constants/colors";

const NFT_MIN_VALUE = 0.01;
const INVALID_NFT_PATTERN = "INVALID AND WORTHLESS";

interface ExpandableRowDexProps extends GridRowProps {
  row: Wallet;
  isExpanded: (rowId: string | number) => boolean;
  rowId: string | number;
  onHeightUpdate?: (rowId: string, height: string) => void;
  isCollapsed?: boolean;
}

interface WalletData {
  wallet: WalletPortfolioResponse | undefined;
  filteredTokens: TokenHolding[];
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

    const wallet = portfolioWalletData.find(w => w.walletAddress === walletAddress);

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

    const filteredTokens = showDust ? wallet.tokenHoldings || [] : filterDustTokens(wallet.tokenHoldings || []);

    const filteredTokensValue = filteredTokens.reduce((sum, token) => sum + (token.balanceUSD || 0), 0);

    const defiPositions = wallet.deFiPositions || [];
    const totalDeFiValue = defiPositions.reduce((sum: number, pos) => sum + (pos.valueUSD || 0), 0);

    const filterValidNFTs = (nfts: NftHolding[]): NftHolding[] =>
      nfts?.filter(nft => {
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
  titleWidth?: string;
  valueWidth?: string;
  titleWidthLarge?: string;
  valueWidthLarge?: string;
}> = ({
  icon,
  title,
  value,
  color,
  onToggleDust,
  showDust,
  titleWidth = "85.9%",
  valueWidth = "12.8%",
  titleWidthLarge,
  valueWidthLarge,
}) => {
  const { t } = useTranslation("MyWalletsPage");

  return (
    <Box
      display="flex"
      alignItems="center"
      mb={1}
      mt={3}
      sx={{ width: "100%" }}>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: titleWidth,
          justifyContent: "flex-start",
          ...(titleWidthLarge && {
            "@media (min-width: 2000px)": {
              width: titleWidthLarge,
            },
          }),
        }}>
        {icon}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 0,
            fontSize: "1.125rem",
            color: color,
          }}>
          {title}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: valueWidth,
          justifyContent: "flex-start",
          ...(valueWidthLarge && {
            "@media (min-width: 2000px)": {
              width: valueWidthLarge,
            },
          }),
        }}>
        {value && (
          <Typography
            variant="h6"
            sx={{ color, fontWeight: 500 }}>
            {value}
          </Typography>
        )}

        {onToggleDust && (
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: "pointer", ml: 2 }}
            onClick={onToggleDust}>
            {showDust ? (
              <VisibilityOffIcon sx={{ color: WALLET_COLORS.dustToggle, fontSize: 22, mr: 0.5 }} />
            ) : (
              <RemoveRedEyeIcon sx={{ color: WALLET_COLORS.dustToggle, fontSize: 22, mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color="text.secondary">
              {showDust ? t("HideDust") : t("ShowDust")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const ExpandableRowDex: React.FC<ExpandableRowDexProps> = props => {
  const { onHeightUpdate, isCollapsed, isExpanded: isRowExpanded, ...gridRowProps } = props;
  const { row, rowId } = gridRowProps;
  const { t } = useTranslation("MyWalletsPage");
  const theme = useTheme();
  const { showDust, toggleDust } = useDustToggle();

  const { filteredTokens, filteredTokensValue, totalDeFiValue, totalNftValue, sectionsWithData } = useWalletData(
    row.address,
    showDust,
  );

  const formattedTokensValue = useFormattedCurrency(filteredTokensValue);
  const formattedDeFiValue = useFormattedCurrency(totalDeFiValue);
  const formattedNftValue = useFormattedCurrency(totalNftValue);

  const getMinHeight = useCallback(() => {
    const isProfilePage = window.location.pathname.includes("/profile");
    const collapsed = isCollapsed ?? false;

    if (isProfilePage) {
      switch (sectionsWithData) {
        case 0:
          return "35vh";
        case 1:
          return "43vh";
        case 2:
          return "70vh";
        case 3:
          return "75vh";
        default:
          return "65vh";
      }
    } else {
      if (collapsed) {
        switch (sectionsWithData) {
          case 0:
            return "25vh";
          case 1:
            return "71vh";
          case 2:
            return "71vh";
          case 3:
            return "71vh";
          default:
            return "71vh";
        }
      } else {
        switch (sectionsWithData) {
          case 0:
            return `25vh`;
          case 1:
            return `50vh`;
          case 2:
            return `90vh`;
          case 3:
            return `90vh`;
          default:
            return `90vh`;
        }
      }
    }
  }, [sectionsWithData, isCollapsed]);

  const rowExpanded = isRowExpanded(rowId);
  useEffect(() => {
    if (onHeightUpdate && rowExpanded) {
      onHeightUpdate(row.address, getMinHeight());
    }
  }, [rowExpanded, rowId, row.address, onHeightUpdate, getMinHeight]);

  const tokensIcon = (
    <MovingIcon
      sx={{
        color: getTokensColor(theme.palette.mode === "dark"),
        mr: 1,
        fontSize: "40px",
      }}
    />
  );

  const defiIcon = <LayersIcon sx={{ color: WALLET_COLORS.defi, mr: 1, fontSize: "40px" }} />;

  const nftIcon = <AppsIcon sx={{ color: WALLET_COLORS.nft, mr: 1, fontSize: "40px" }} />;

  const expanded = isRowExpanded(rowId);

  return (
    <Box sx={{ width: "100%" }}>
      <GridRow
        {...gridRowProps}
        sx={{
          ...(expanded && {
            position: "sticky",
            top: 52,
            zIndex: 9,
            backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#f7f5f2",
            "& .MuiDataGrid-cell": {
              backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#f7f5f2",
            },
          }),
          ...gridRowProps.sx,
        }}
      />
      {expanded && (
        <Box
          px={3}
          py={1}
          sx={{
            width: "100%",
            maxWidth: "100%",
            maxHeight: getMinHeight(),
            overflowY: "auto",
            overflowX: "hidden",
            ...nativeBarSx,
          }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            sx={{ width: "100%", maxWidth: "100%" }}>
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <SectionHeader
                icon={tokensIcon}
                title={t("WalletTokens")}
                value={formattedTokensValue}
                color={getTokensColor(theme.palette.mode === "dark")}
                onToggleDust={toggleDust}
                showDust={showDust}
                titleWidth="87.7%"
                valueWidth="11.3%"
                titleWidthLarge="87.4%"
                valueWidthLarge="11.6%"
              />

              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <WalletTokensOverview
                  walletAddress={row.address}
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
            titleWidth="87.8%"
            valueWidth="11.2%"
            titleWidthLarge="87.4%"
            valueWidthLarge="11.6%"
          />

          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <WalletDeFiOverview walletAddress={row.address} />
          </Box>

          <Box
            mt={4}
            sx={{ width: "100%", maxWidth: "100%" }}>
            <SectionHeader
              icon={nftIcon}
              title={t("NFTHoldings")}
              value={formattedNftValue}
              color={WALLET_COLORS.nft}
              titleWidth="87.8%"
              valueWidth="11.2%"
              titleWidthLarge="87.4%"
              valueWidthLarge="11.6%"
            />
            <Box sx={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
              <WalletNftOverview walletAddress={row.address} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
