import React, { useEffect, useState } from "react";
import {Grid, Button, useTheme, Typography, FormControl, MenuItem, Select, TextField, TableCell, TableRow, TableHead,
  Table,
  TableContainer,
  TableBody,
  Paper,
  Box,
  Tooltip,
  InputAdornment,
  IconButton,
  Autocomplete,
  Avatar,
  Stack,
  CircularProgress,
  Collapse,
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from "react-i18next";
import { Wallet } from "@/models/Wallet/Wallet";
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { useSelector } from "react-redux";
import { RootState } from "@/libs/redux/RootReducer";
import { useAppDispatch } from "@/libs/redux/Store";
import { fetchDex, fetchGas, fetchQuote, fetchQuoteParameters, fetchToken } from "components";
import { dexWebsites } from "@/constants/dexWebsites";
import { iconsApi } from "@/services/iconsService";
import { PaginatedList } from "components";
import { TokenSearchItem } from "@/models/Wallet/TokenSearchItem";
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import ReplayIcon from '@mui/icons-material/Replay';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MultiSelectDexDropdown, { Dex } from "./MultiSelectDexDropdown";
import { generateUniswapLink } from "@/helpers/UniswapLinksGenerator";
import { generateOneInchLink } from "@/helpers/OneInchLinksGenerator";
import SegmentedDexSwitch from "@/components/SegmentedDexSwitch";
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import NoRouteDialog from "./NoRouteDialog";
import { OneInchQuoteResponse } from "components";
import { useSubscription } from "components";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const hardcodedRoutes = [
  {
    provider: 'CCTP + Mayan',
    best: true,
    fastest: false,
    amount: '4,061.2858 USDC',
    gas: '$0.06',
    time: '15m',
    impact: '+0.03%',
    impactColor: '#00e5a0',
    rate: '1 DAI ≈ 0.999968 USDC',
    steps: [
      {
        type: 'swap',
        label: 'Swap on Ethereum via OKX Dex Aggregator',
        tokens: ['4,061.4122 DAI', '4,061.3593 USDC'],
        meta: ['⛽ Est. gas: $0.00', { link: 'https://app.1inch.io', label: 'app.1inch.io ↗' }, '· Re-enter amounts on site'],
      },
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via CCTP + Mayan',
        tokens: ['4,061.3593 USDC on Ethereum', '4,061.2858 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.06', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Complete steps in order — each step requires a separate wallet signature. Amounts shown are estimates; re-enter them manually on each protocol\'s site.'
  },
  {
    provider: 'CCTPv2 + Mayan',
    best: false,
    fastest: false,
    amount: '4,060.8631 USDC',
    gas: '$0.06',
    time: '35s',
    impact: '+0.02%',
    impactColor: '#00e5a0',
    rate: '1 DAI ≈ 0.999864 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via CCTPv2',
        tokens: ['4,061.4122 DAI on Ethereum', 'USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.03', { link: 'https://bridge.circle.com', label: 'bridge.circle.com ↗' }, '· Re-enter amounts on site'],
      },
      {
        type: 'swap',
        label: 'Swap on Arbitrum via Mayan',
        tokens: ['USDC', '4,060.8631 USDC'],
        meta: ['⛽ Est. gas: $0.03', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Complete steps in order — each step requires a separate wallet signature. Amounts shown are estimates; re-enter them manually on each protocol\'s site.'
  },
  {
    provider: 'Mayan (Swift)',
    best: false,
    fastest: true,
    amount: '4,059.7095 USDC',
    gas: '$0.06',
    time: '10s',
    impact: '-0.01%',
    impactColor: '#7680a0',
    rate: '1 DAI ≈ 0.99958 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via Mayan Swift',
        tokens: ['4,061.4122 DAI on Ethereum', '4,059.7095 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.06', { link: 'https://mayan.finance', label: 'mayan.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Single-step route — requires one wallet signature. Amounts shown are estimates; re-enter them manually on the protocol\'s site.'
  },
  {
    provider: 'Stargate',
    best: false,
    fastest: false,
    amount: '4,056.5141 USDC',
    gas: '$0.11',
    time: '2m',
    impact: '-0.09%',
    impactColor: '#f5a623',
    rate: '1 DAI ≈ 0.9991 USDC',
    steps: [
      {
        type: 'bridge',
        label: 'Bridge from Ethereum to Arbitrum via Stargate',
        tokens: ['4,061.4122 DAI on Ethereum', '4,056.5141 USDC on Arbitrum'],
        meta: ['⛽ Est. gas: $0.11', { link: 'https://stargate.finance/bridge', label: 'stargate.finance ↗' }, '· Re-enter amounts on site'],
      },
    ],
    summary: 'Single-step route — requires one wallet signature. Amounts shown are estimates; re-enter them manually on the protocol\'s site.'
  },
];

function BridgeRoutesMockup() {
  const theme = useTheme();
  const [openIdx, setOpenIdx] = useState(-1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  return (
    <Box>
      {hardcodedRoutes.map((route, idx) => (
        <Box key={idx} sx={{ border: '1px solid #30364a', borderRadius: '10px', background: selectedIdx === idx ? 'rgba(0,229,160,0.01)' : (theme.palette.mode === 'dark' ? 'rgb(37,40,54)' : '#fff'), mb: 1.5, cursor: 'pointer', overflow: 'hidden', borderColor: selectedIdx === idx ? 'rgba(0,229,160,0.28)' : '#30364a' }} onClick={() => setSelectedIdx(idx)}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 2 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: selectedIdx === idx ? '#00e5a0' : '#30364a', background: selectedIdx === idx ? '#00e5a0' : 'transparent', mt: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedIdx === idx && <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#0d1117' }} />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.83rem' }}>{route.provider}</Typography>
                  {route.best && <Chip label="⭐ BEST" size="small" sx={{ background: 'rgba(245,200,66,0.12)', color: '#f5c842', border: '1px solid rgba(245,200,66,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
                  {route.fastest && <Chip label="⚡ FASTEST" size="small" sx={{ background: 'rgba(91,140,245,0.12)', color: '#5b8cf5', border: '1px solid rgba(91,140,245,0.4)', fontWeight: 700, fontSize: '0.63rem', height: 20, ml: 1 }} />}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1.12rem', color: selectedIdx === idx ? '#00e5a0' : '#e4e8f5' }}>{route.amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.72rem', color: '#7680a0' }}>
                  <span>⛽ {route.gas}</span>
                  <span>🕐 {route.time}</span>
                  <span style={{ color: route.impactColor, fontWeight: 600 }}>{route.impact}</span>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.69rem', color: '#424b64', mt: 1 }}>
                <span>{route.rate}</span>
                <Button 
                  size="small"
                  endIcon={<ExpandMoreIcon sx={{ fontSize: '1rem', transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                  sx={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    color: openIdx === idx ? '#00e5a0' : '#7680a0', 
                    background: openIdx === idx ? 'rgba(0,229,160,0.10)' : 'rgba(37,40,54,1)', 
                    border: '1px solid', 
                    borderColor: openIdx === idx ? 'rgba(0,229,160,0.28)' : '#30364a', 
                    borderRadius: 1, 
                    px: 1.5, 
                    py: 0.5, 
                    minWidth: 0,
                    textTransform: 'none',
                  }} 
                  onClick={e => { e.stopPropagation(); setOpenIdx(openIdx === idx ? -1 : idx); }}
                >
                  {openIdx === idx ? 'Hide Steps' : 'View Steps'}
                </Button>
              </Box>
            </Box>
          </Box>
          <Collapse in={openIdx === idx} timeout="auto" unmountOnExit>
            <Box sx={{ borderTop: '1px solid #30364a', background: '#13151e', p: 2 }}>
              <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#7680a0', mb: 2 }}>How to execute this route</Typography>
              {route.steps.map((step, sidx) => (
                <Box key={sidx} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', position: 'relative', mb: 2 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: '#23263a', border: '1px solid #30364a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', mt: 0.5 }}>{sidx + 1}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', px: 1, py: 0.5, borderRadius: 1, mb: 0.5, background: step.type === 'swap' ? 'rgba(91,140,245,0.12)' : 'rgba(0,229,160,0.10)', color: step.type === 'swap' ? '#5b8cf5' : '#00e5a0', border: '1px solid', borderColor: step.type === 'swap' ? 'rgba(91,140,245,0.3)' : 'rgba(0,229,160,0.28)' }}>{step.type === 'swap' ? '⇄ Swap' : '⇌ Bridge'}</Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#e4e8f5', mb: 0.5 }}>{step.label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem', color: '#7680a0', mb: 0.5 }}>
                      <Box sx={{ background: '#23263a', border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>{step.tokens[0]}</Box>
                      <span style={{ color: '#424b64', fontSize: '0.7rem' }}>→</span>
                      <Box sx={{ background: '#23263a', border: '1px solid #30364a', borderRadius: 1, px: 1, py: 0.5, fontWeight: 600 }}>{step.tokens[1]}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.68rem', color: '#424b64' }}>
                      {step.meta.map((m, mi) => typeof m === 'string' ? <span key={mi}>{m}</span> : <a key={mi} href={m.link} target="_blank" rel="noopener" style={{ color: '#00e5a0', textDecoration: 'none', fontWeight: 600 }}>{m.label}</a>)}
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #30364a', display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.72rem', color: '#7680a0', lineHeight: 1.45 }}>
                <span style={{ fontSize: '0.8rem' }}>ℹ</span>
                {route.summary}
              </Box>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
}

interface NewPositionSectionProps {
    selectedWallet: Wallet | null;
    onSelectedTokenChange?: (tokenInfo: any, chainInfo: any) => void;
    filteredRows: WalletBalance[]; 
    selectedTokenRow: WalletBalance | null;
  }

export const NewPositionSection: React.FC<NewPositionSectionProps> = ({ selectedWallet, onSelectedTokenChange, filteredRows, selectedTokenRow})=> {
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const { getTradeAggregatorQuoteLimit } = useSubscription();
  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");
  const [selectedChain, setSelectedChain] = useState("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [symbolOptionSwap, setSymbolOptionSwap] = useState<TokenSearchItem | null>(null);
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<TokenSearchItem | null>(null);
  const [inputSearchSwapFor, setInputSearchSwapFor] = useState("");
  const [inputSearchSwap, setInputSearchSwap] = useState("");
  const [useMax,setUseMax] = useState<boolean>(true);
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const extractSymbol = (label: string) => label.split(" ")[0].toUpperCase();
  const [quoteData, setQuoteData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { data, error, quote, quoteError, quoteLoading} = useSelector((state: RootState) => state.dex);
  const [errorQuote, setErrorQuote] = useState<string | null>("");
  const [errorQuoteParametrs, setErrorQuoteParametrs] = useState<string | null>("");
  const [hasShownErrorOnce, setHasShownErrorOnce] = useState(false);
  const [tokenAddress,setTokenAddress] = useState<string | null>(null);
  const [tokenAddressSwapFor,setTokenAddressSwapFor] = useState<string | null>(null);
  const [shouldFetchQuote, setShouldFetchQuote] = useState(false);
  const [showNoQuotesMessage, setShowNoQuotesMessage] = useState(false);
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
  const [tokenIcons, setTokenIcons] = useState<PaginatedList<TokenSearchItem> | null>(null);
  const [tokenIconsSwapFor, setTokenIconsSwapFor] = useState<PaginatedList<TokenSearchItem> | null>(null);
  const [balanceRaw, setBalanceRaw] = useState<number | undefined>();
  const [isDexEnabled, setIsDexEnabled] = useState(false);
  const [selectedDexs, setSelectedDexs] = useState<Dex[]>([]);
  const MAX_SELECTIONS = 4;
  const [allDexs, setAllDexs] = useState<Dex[]>([]);
  const [isDexDropdownOpen, setIsDexDropdownOpen] = useState(false);
  const [noRouteOpen, setNoRouteOpen] = useState(false);
  const [invalidQuote, setInvalidQuote] = useState<OneInchQuoteResponse[]>([]);
  
  const handleRemoveDex = (dexId: string) => {
    setSelectedDexs(selectedDexs.filter(dex => dex.id !== dexId));
  };

  const invalidQuoteError = () => {
    return invalidQuote.map(x => x.error).join(', ');
  }

  const clearAllDexSelections = () => {
    setSelectedDexs([]);
  };

  const toggleDexFilter = async () => {
    const newState = !isDexEnabled;
    setIsDexEnabled(newState);

    const result = await dispatch(
      fetchDex({
        chainName: selectedChain,
      })
    );
    
    if (fetchDex.fulfilled.match(result)) {
      const data = result.payload;   
      setAllDexs(data.protocols);    
    } else {
      console.error("Error API:", result);
    }
        
    if (!newState) {
      setSelectedDexs([]);
    }
  };

  useEffect(() => {
    const hasError = Boolean(error || quoteError);

    if (hasError && !hasShownErrorOnce) {
      setNoRouteOpen(true);
      setHasShownErrorOnce(true);
    }

    if (!hasError && hasShownErrorOnce) {
      setHasShownErrorOnce(false);
    }
  }, [error, quoteError, hasShownErrorOnce]);


  const coinGeckoChainId = (chain: string) => {
          switch (chain.toLowerCase()) {
            case "ethereum": return 1;
            case "optimism": return 10;
            case "arbitrum": return 42161;
            case "bnb chain": return 56;
            case "polygon": return 137;
            case "avalanche": return 43114;
            case "base": return 8453;
            case "zksync": return 324;
            case "gnosis": return 100;
            case "linea": return 59144;
            case "sonic": return 146;
            case "unichain": return 130;
          }
  };

  useEffect(() => {
    if (symbolOptionSwap && selectedChain && isDexEnabled) {
      toggleDexFilter();
    }
  }, [selectedChain])     

  useEffect(()=> {
    if (!symbolOptionSwap || !selectedChain) {
        setSelectedDexs([]);
        setIsDexEnabled(false);
    }

    const chainId = coinGeckoChainId(selectedChain);
      if (!chainId) return;

    const matchedToken = filteredRows.find(token => 
      token.tokenName?.toUpperCase() === symbolOptionSwap?.sym?.toUpperCase() &&
      token.chain?.toUpperCase() === selectedChain.toUpperCase()
    );
    

    
    setBalanceRaw(matchedToken?.balance);
  }, [symbolOptionSwap, selectedChain])

  useEffect(() => {
    if (!selectedWallet) {
      setTokenAddresses([]);
      setTokenIcons(null);
      setSymbolOptionSwap(null);
      setSymbolOptionSwapFor(null);
      setInputSearchSwapFor("");
      setSelectedChain("");
      setNewBalance("");
      return;
    }
      setTokenIcons(null);
      setSymbolOptionSwap(null);
      setSymbolOptionSwapFor(null);
      setInputSearchSwapFor("");
      setSelectedChain("");
      setNewBalance("");
    
    const addresses: string[] = filteredRows
      .map((token) => token.tokenAddress)
      .filter((address): address is string => typeof address === 'string' && address !== '');

    setTokenAddresses(addresses);
  }, [selectedWallet, filteredRows]);

  useEffect(() => {
    if (!selectedChain) return;

    const timeoutId = setTimeout(() => {
      const fetchIconsForSwapFor = async () => {
        const chainId = coinGeckoChainId(selectedChain);
        if (!chainId) return;

        try {
          const result = await iconsApi.getIcons(
            inputSearchSwapFor,
            0,
            chainId,
            500
          );
          setTokenIconsSwapFor(result);
        } catch (error) {
          console.error('Error loading icons for swap for:', error);
        }
      };

      fetchIconsForSwapFor();
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [selectedChain, inputSearchSwapFor]);


  useEffect(() => {
    const fetchIcons = async () => {
    if (tokenAddresses.length === 0) return;

    const nonEmptyChainsCount = filteredRows.length > 0 ? 1 : 0;

    let pageSize = tokenAddresses?.length + nonEmptyChainsCount + 50;

    try {
      const result = await iconsApi.getIconsV2(
        undefined,
        0,
        pageSize,
        tokenAddresses
      );

      const walletTokenNamesLower = new Set(
        filteredRows.map(row => row?.tokenName?.toLowerCase())
      );

      const filteredItems = result.items.filter(item => {
        return walletTokenNamesLower.has(item.sym.toLowerCase());
      });

      const virtualTokens = filteredRows
        .filter(row => {
          const hasIcon = filteredItems.some(item => 
            item.sym.toLowerCase() === row.tokenName?.toLowerCase()
          );
          return !hasIcon;
        })
        .map(row => ({
          id: `virtual-${row.tokenName?.toLowerCase()}`,
          sym: row.tokenName || '',
          name: row.name || '',
          address: [row.tokenAddress || ''],
          lURI: undefined,
          mCap: 0,
          mSup: null,
        }));

      setTokenIcons({
        ...result,
        items: [...filteredItems, ...virtualTokens],
      });

    } catch (error) {
      console.error('Error loading icons:', error);
    }
    };

    fetchIcons();
  }, [tokenAddresses, filteredRows]);

  const maxBalance = balanceRaw !== undefined && balanceRaw !== null
    ? balanceRaw.toFixed(5)
    : "0.0000";

  useEffect(() => {
    if (hasAttemptedSubmit) {
      setErrorQuote(quoteError);
      setErrorQuoteParametrs(error);
    } else {
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
    }
  }, [quoteError, error, hasAttemptedSubmit]);

  useEffect(() => {
    const fetchProtocolsAndTokens = async () => {
      if (quote.length && symbolOptionSwap && symbolOptionSwapFor) {

        let chainPrice = 0;
        let swapForToken: any = null;

        try {
          const coinGeckoChainId = (chain: string) => {
            switch (chain.toLowerCase()) {
              case "ethereum":
              case "optimism":
              case "arbitrum":
              case "base":
              case "zksync":
              case "gnosis":
              case "linea":
              case "sonic":
              case "unichain":
                return "ethereum";
              case "bnb chain":
                return "binancecoin";
              case "polygon":
                return "matic-network";
              case "avalanche":
                return "avalanche-2";
              default:
                return "ethereum";
            }
          };

          const chainPosition = await dispatch(
            fetchToken({ id: coinGeckoChainId(selectedChain) })
          ).unwrap();
          chainPrice = Number(chainPosition.price.toString());

          const tokenPosition = await dispatch(
            fetchToken({ id: symbolOptionSwap.id })
          ).unwrap();

          swapForToken = await dispatch(
            fetchToken({ id: symbolOptionSwapFor.id })
          ).unwrap();

        } catch (err) {
          console.error("Error fetching tokens:", err);
        }

        let baseFee = 0;

        try {
          const response = await dispatch(fetchGas({ chainName: selectedChain }));

          if (selectedChain.toUpperCase() !== "BNB CHAIN") {
            baseFee = response.payload.baseFee;
          } else {
            baseFee = response.payload.standard;
          }
        } catch (err) {
          console.error("Error fetching gas:", err);
        }

        setInvalidQuote(quote.filter(x => x.error));

        const processedData = quote.filter(x => !x.error).map((q) => {
          const firstProtocol = q.protocols[0][0];
          const names = firstProtocol.map((step: any) => step.name).filter(Boolean);
          const name = names[0];

          let deepLink: string | null = null;
          
           const isUniswap = ["UNISWAP_V1", "UNISWAP_V2", "UNISWAP_V3", "UNISWAP_V4", "BSC_UNISWAP_V3", "BSC_UNISWAP_V4", 
            "OPTIMISM_UNISWAP_V3", "OPTIMISM_UNISWAP_V4", "POLYGON_UNISWAP_V3", "POLYGON_UNISWAP_V4", "AVALANCHE_UNISWAP_V3",
            "AVALANCHE_UNISWAP_V4", "ARBITRUM_UNISWAP_V3", "ARBITRUM_UNISWAP_V4", "BASE_UNISWAP_V3", "BASE_UNISWAP_V4",
            "ZKSYNC_UNISWAP_V3", "ZKSYNC_UNISWAP_V4", "GNOSIS_UNISWAP_V3", "GNOSIS_UNISWAP_V4", "SONIC_UNISWAP_V3",
            "SONIC_UNISWAP_V4", "UNICHAIN_UNISWAP_V3", "UNICHAIN_UNISWAP_V4",
          ].includes(name);

          const isOneInch = name === "1inch PMM";

          if (isUniswap && tokenAddress && tokenAddressSwapFor && newBalance) {
            
            deepLink = generateUniswapLink({
              inputCurrency: tokenAddress,
              outputCurrency: tokenAddressSwapFor,
              exactAmount: Number(newBalance),
              exactField: "input",
              version: name,
            });

          } else if (isOneInch && symbolOptionSwap && symbolOptionSwapFor && selectedChain) {
            deepLink = generateOneInchLink({
              chainName: selectedChain,
              srcTokenAddress: symbolOptionSwap.sym.toUpperCase(),
              dstTokenAddress: symbolOptionSwapFor.sym.toUpperCase(),
            });
          }

          let estAmount = Number(q.dstAmount) / Math.pow(10, q.dstToken.decimals);
          const price =  estAmount / parseFloat(newBalance);
          const gasUSD = parseFloat((((q.gas * baseFee) / 1e18) * chainPrice).toFixed(3));

          if (swapForToken && swapForToken.price) {
            estAmount = estAmount - (gasUSD / swapForToken.price);
          }

          return {
            name: names[0],
            gas: parseFloat(((q.gas * baseFee) / 1e18).toFixed(6)),
            price: price.toFixed(4),
            gasUSD: gasUSD,
            estAmount: estAmount.toFixed(4),
            deepLink,
          };
        });

        if (processedData.length === 0 && quoteLoading === false) {
          setShowNoQuotesMessage(true);
        } else {
          setShowNoQuotesMessage(false);
        }
        setQuoteData(processedData);
      }
    };

    fetchProtocolsAndTokens();
  }, [quote]);

  useEffect(() => {
    if (
      shouldFetchQuote &&
      data &&
      data.fromTokenAddress &&
      data.toTokenAddress &&
      data.amount > 0
    ) {
      const quoteLimit = getTradeAggregatorQuoteLimit();
      
      if(isDexEnabled === false)
      {
        dispatch(fetchQuote({
          chainName: data.chainName,
          fromTokenAddress: data.fromTokenAddress,
          toTokenAddress: data.toTokenAddress,
          amount: data.amount,
          requests: quoteLimit
        }));
      }
      else 
      {
        dispatch(fetchQuote({
          chainName: data.chainName,
          fromTokenAddress: data.fromTokenAddress,
          toTokenAddress: data.toTokenAddress,
          amount: data.amount,
          requests: quoteLimit,
          selectedProtocols: selectedDexs.map(dex => dex.id)
        }));
      }

      setShouldFetchQuote(false);
    }
  }, [shouldFetchQuote, data, dispatch]);

  useEffect(() => {
    if (!quoteLoading) {
      if (quote.length === 0) {
        setShowNoQuotesMessage(true);
      } else {
        setShowNoQuotesMessage(false);
      }
    }
  }, [quote, quoteLoading]);

  useEffect(() => {
    if (selectedTokenRow && tokenIcons?.items) {
      setSelectedChain(selectedTokenRow.chain?.toUpperCase() || "");

      const matchedToken = tokenIcons.items.find(token =>
        token.sym?.toUpperCase() === selectedTokenRow.tokenName?.toUpperCase()
      );

      if (matchedToken) {
        setSymbolOptionSwap(matchedToken);
        setSelectedToken(matchedToken.sym);
      } else {
        const virtualToken = {
          id: `virtual-${selectedTokenRow.tokenName?.toLowerCase()}`,
          sym: selectedTokenRow.tokenName || '',
          name: selectedTokenRow.name || '',
          address: [selectedTokenRow.tokenAddress || ''],
          lURI: undefined,
          mCap: 0,
          mSup: null,
        };
        setSymbolOptionSwap(virtualToken);
        setSelectedToken(virtualToken.sym);
      }
    } else if (selectedTokenRow && !tokenIcons?.items) {
      setSelectedChain(selectedTokenRow.chain?.toUpperCase() || "");
    }
  }, [selectedTokenRow, tokenIcons]);

  useEffect(() => {
    if (filteredRows.length > 0) {
      const virtualTokens = filteredRows.map(row => ({
        id: `virtual-${row.tokenName?.toLowerCase()}`,
        sym: row.tokenName || '',
        name: row.name || '',
        address: [row.tokenAddress || ''],
        lURI: undefined,
        mCap: 0,
        mSup: null,
      }));

      setTokenIcons({
        items: virtualTokens,
        totalCount: virtualTokens.length,
        pageNumber: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hansNextPage: false,
      });
    }
  }, [filteredRows]);

  useEffect(() => {
    if (selectedTokenRow && !tokenIcons?.items) {
      setSelectedChain(selectedTokenRow.chain?.toUpperCase() || "");
      
      const virtualToken = {
        id: `virtual-${selectedTokenRow.tokenName?.toLowerCase()}`,
        sym: selectedTokenRow.tokenName || '',
        name: selectedTokenRow.name || '',
        address: [selectedTokenRow.tokenAddress || ''],
        lURI: undefined,
        mCap: 0,
        mSup: null,
      };
      setSymbolOptionSwap(virtualToken);
      setSelectedToken(virtualToken.sym);
    }
  }, [selectedTokenRow, tokenIcons?.items]);

  useEffect(() => {
    if (!selectedTokenRow) {
      setSymbolOptionSwapFor(null);
      setInputSearchSwapFor("");
      setSelectedChain("");
      setSymbolOptionSwap(null);
      setSelectedToken(null);
      setNewBalance("");
    }
  }, [selectedTokenRow]);

  
  useEffect(() => {
    if (!symbolOptionSwap || !selectedChain || !selectedWallet) {
      setSelectedToken(null);
      setNewBalance("")
      return;
    }
  
    setNewBalance(maxBalance.toString());
    const matchedToken = filteredRows.find(token => 
      token.tokenName?.toUpperCase() === symbolOptionSwap.sym?.toUpperCase() &&
      token.chain?.toUpperCase() === selectedChain.toUpperCase()
    );
  
    if (matchedToken) {
      setSelectedToken(matchedToken.tokenName || null);
      onSelectedTokenChange?.(matchedToken.tokenName, selectedChain);
    } else {
      setSelectedToken(null);
      onSelectedTokenChange?.(null,null);
    }
  }, [symbolOptionSwap, selectedChain, selectedWallet, filteredRows]);

  useEffect(() => {
    if (useMax && symbolOptionSwap) {
      setNewBalance(maxBalance.toString());
    }
  }, [useMax, maxBalance]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      setErrorMessage(generateErrorMessage());
      setQuoteData([]);
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
    }
  }, [symbolOptionSwap, selectedChain, symbolOptionSwapFor, newBalance, hasAttemptedSubmit]);

const onOptionChangeSwapFor = (value: TokenSearchItem  | null) => {
  setShowNoQuotesMessage(false);
  if (value && value.id === symbolOptionSwap?.id) {
    setSymbolOptionSwapFor(value);
    setErrorMessage(t("SameTokenError"));
    return;
  }

  setSymbolOptionSwapFor(value);
  setErrorMessage(null);
};

  const onOptionChangeSwap = (value: TokenSearchItem  | null) => {
    setShowNoQuotesMessage(false);
    if (value && value.id === symbolOptionSwapFor?.id) {
      setSymbolOptionSwap(value);
      setErrorMessage(t("SameTokenError"));
      return;
    }

    if(value === null)
    {
      onSelectedTokenChange?.(null,null);
    }
    
    setSymbolOptionSwap(value);
    setErrorMessage(null);
  };

  const getGasTokenSymbol = (chain: string): string => {
    const chainMap: Record<string, string> = {
      "ETHEREUM": "ETH",
      "OPTIMISM": "ETH",
      "ARBITRUM": "ETH",
      "BASE": "ETH",
      "ZKSYNC": "ETH",
      "GNOSIS": "ETH",
      "LINEA": "ETH",
      "SONIC": "ETH",
      "UNICHAIN": "ETH",
      "BNB CHAIN": "BNB",
      "POLYGON": "MATIC",
      "AVALANCHE": "AVAX",
    };
    return chainMap[chain.toUpperCase()] || "";
  };  

  const generateErrorMessage = () => {
    const errors: string[] = [];
  
    const selectedSymbol = symbolOptionSwap?.sym?.toUpperCase();
    const tokenExistsInFilteredRows = filteredRows.some(
      token => token.tokenName?.toUpperCase() === selectedSymbol
    );
  
    if (!symbolOptionSwap) {
      errors.push(t("TokenPosition"));
    } else if (!tokenExistsInFilteredRows) {
      return t("SelectedError");
    }
  
    if (!selectedChain) errors.push(t("Chain"));
    if (!symbolOptionSwapFor) errors.push(t("SwapFor"));
    if (!newBalance || isNaN(Number(newBalance)) || Number(newBalance) <= 0) errors.push(t("Qty"));
  
    return errors.length > 0 ? `${t("MissingInputs")}: ${errors.join(", ")}` : null;
  };

  const formatNumberWithCommas = (value: string) => {
    const [intPart, decimalPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  const handleFetchQuotes = () => {
    setHasAttemptedSubmit(true);
    const err = generateErrorMessage();      
  
    if (err) {
      setQuoteData([]);
      setErrorMessage(err);
      setLastUpdated(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
    } else {
      setErrorMessage(null);
  
      const fetchAndSetAddresses = async () => {
        if (
          symbolOptionSwap &&
          symbolOptionSwapFor &&
          selectedChain &&
          newBalance
        ) {
          const result = await dispatch(
            fetchQuoteParameters({
              tokenPositionSymbol: symbolOptionSwap.sym,
              chainName: selectedChain,
              qty: Number(newBalance),
              swapForSymbol: symbolOptionSwapFor.sym,
              tokenPositionId: symbolOptionSwap.id,
              swapForId: symbolOptionSwapFor.id,
            })
          );
    
          if (fetchQuoteParameters.fulfilled.match(result)) {
            const data = result.payload;
            if (data?.fromTokenAddress && data?.toTokenAddress) {
              setTokenAddress(data.fromTokenAddress);
              setTokenAddressSwapFor(data.toTokenAddress);
              setShouldFetchQuote(true);
            } else {
              setTokenAddress(null);
              setTokenAddressSwapFor(null);
            }
          } else {
            setTokenAddress(null);
            setTokenAddressSwapFor(null);
            console.error("Error API:", result);
          }
        }
      };
    
      fetchAndSetAddresses();
      
      const now = new Date();
      const formatted = now.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
  
      setLastUpdated(formatted);
    }
  };

  const isWalletSelected = selectedWallet !== null;
  const noticeColor = theme.palette.mode === "dark" ? "#f1b036ff" : "#be7d04ff";

  return (
    <Grid
      container
      direction="column"
      sx={{
        minHeight: "522px",
        borderRadius: "10px",
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "#f7f5f2",
        padding: 2,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          opacity: isWalletSelected ? 1 : 0.4,
          pointerEvents: isWalletSelected ? 'auto' : 'none',
          userSelect: isWalletSelected ? 'auto' : 'none',
          filter: isWalletSelected ? 'none' : 'grayscale(50%)',
        }}
      >
        <Grid item container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item>
            <Button
              variant={activeTab === "swap" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setActiveTab("swap")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              backgroundColor: activeTab === "swap" ? "#f7f5f2" : "#e5ddd5",
              color: activeTab === "swap" ? "#000" : "#000",
              borderColor: "#e5ddd5",
              "&:hover": {
                backgroundColor: activeTab === "swap" ? "#f7f5f2" : "#e5ddd5",
                borderColor: "#e5ddd5",
              },
            }}
          >
            {t("Swap")}
          </Button>
        </Grid>

         
        <Grid item>
          <Button
            variant={activeTab === "bridge" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveTab("bridge")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              backgroundColor: activeTab === "bridge" ? "#f7f5f2" : "#e5ddd5",
              color: activeTab === "bridge" ? "#000" : "#000",
              borderColor: "#e5ddd5",
              "&:hover": {
                backgroundColor: activeTab === "bridge" ? "#f7f5f2" : "#e5ddd5",
                borderColor: "#e5ddd5",
              },
            }}
          >
            {t("Bridge")}
          </Button>
        </Grid>
        
      </Grid>

      <Grid item>
        {activeTab === "swap" ? (
            <Grid container spacing={2}>
                <Grid item xs={3.7}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{t("TokenPosition")}</Typography>

                      {!symbolOptionSwap && (
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '0.85rem',}}>
                              {t("SelectTokenToSwapFrom")}
                            </Typography>
                          }
                        >
                          <WarningTwoToneIcon
                            sx={{
                              color: "#fbc02d", 
                              fontSize: "14px",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                     <Autocomplete
                        options={tokenIcons?.items ?? []}
                        getOptionLabel={(option) => option.sym}
                        value={symbolOptionSwap}
                        onChange={(_e, newValue) => onOptionChangeSwap(newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disableClearable={false}
                        inputValue={symbolOptionSwap ? symbolOptionSwap.name ?
                          `${symbolOptionSwap.sym.toUpperCase()} - ${symbolOptionSwap.name}` :
                          symbolOptionSwap.sym.toUpperCase() : inputSearchSwap}
                        onInputChange={(_event, newInputValue, reason) => {
                          if (reason === 'clear') {
                            onOptionChangeSwap(null);
                          }
                          setInputSearchSwap(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("Search")}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {symbolOptionSwap?.lURI ? (
                                    <InputAdornment position="start">
                                      <Avatar
                                        src={symbolOptionSwap.lURI}
                                        alt={symbolOptionSwap.sym} 
                                        sx={{ width: 22, height: 22, mr: 1 }}
                                      />
                                    </InputAdornment>
                                  ) : (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  )}
                                </>
                              ),
                              sx: {
                                input: {
                                  textTransform: symbolOptionSwap ? 'uppercase' : 'none',
                                },
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={option.lURI ?? undefined}
                              alt={option.sym}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="body1">
                              {option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                      />
                  </Box>
                </Grid>

                <Grid item xs={2.2}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{t("Chain")}</Typography>
                      {!selectedChain && (
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '0.85rem'}}>
                              {t("ChooseToken")}
                            </Typography>
                          }
                        >
                          <WarningTwoToneIcon
                            sx={{
                              color: "#fbc02d", 
                              fontSize: "14px",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>
                  
                  <TextField
                    variant="outlined"
                    size="small"
                    value={selectedChain}
                    disabled
                    sx={{
                      height: "53px",
                      marginBottom: 2,
                      "& .MuiInputBase-root": {
                        height: "53px",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={2.2}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{t("Qty")}</Typography>
                      {!newBalance && (
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '0.85rem'}}>
                              {t("EnterSwapAmount")}
                            </Typography>
                          }
                        >
                          <WarningTwoToneIcon
                            sx={{
                              color: "#fbc02d", 
                              fontSize: "14px",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>

                  <TextField
                    id="quantity_input"
                    variant="outlined"
                    size="small"
                    value={formatNumberWithCommas(newBalance)}
                    onChange={(e) => {
                      const input = e.target.value.replace(/,/g, "");
                      const validInput = /^(\d+)?(\.\d*)?$/.test(input);
                      const numericValue = parseFloat(input);
                      const max = Number(maxBalance);
                    
                      if (validInput) {
                        const [, decimalPart = ""] = input.split(".");
                        
                        if (decimalPart.length <= 5) {
                          if (!isNaN(numericValue)) {
                            setShowNoQuotesMessage(false);
                            setNewBalance(input);
                          }
                    
                          if (input === "" || input === "." || input.endsWith(".")) {
                            setShowNoQuotesMessage(false);
                            setNewBalance(input);
                          }
                        }
                      }
                    }}                    
                    type="text"
                    fullWidth
                    inputProps={{
                      inputMode: "decimal",
                      min: 0,
                      style: {
                        MozAppearance: "textfield",
                      },
                    }}
                    sx={{
                      marginBottom: 2,
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                      "& .MuiInputBase-root": {
                        height: "53px",
                      },
                      "& .MuiInputLabel-root": {
                        marginTop: "8px",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={3.7}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{t("SwapFor")}</Typography>
                      {!symbolOptionSwapFor && (
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '0.85rem' }}>
                              {t("SelectTokenToSwapTo")}
                            </Typography>
                          }
                        >
                          <WarningTwoToneIcon
                            sx={{
                              color: "#fbc02d", 
                              fontSize: "14px",
                            }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                    
                    <Autocomplete
                      id="target_token_dropdown"
                      options={tokenIconsSwapFor?.items ?? []}
                      getOptionLabel={(option) =>
                        option.name
                          ? `${option.sym.toUpperCase()} - ${option.name}`
                          : option.sym.toUpperCase()
                      }
                      value={symbolOptionSwapFor}
                      disabled={!selectedTokenRow}
                      onChange={(_e, newValue) => {
                        onOptionChangeSwapFor(newValue);
                        if (newValue) {
                          setInputSearchSwapFor(
                            newValue.name
                              ? `${newValue.sym.toUpperCase()} - ${newValue.name}`
                              : newValue.sym.toUpperCase()
                          );
                        }
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      disableClearable={false}
                      inputValue={
                        symbolOptionSwapFor
                          ? symbolOptionSwapFor.name
                            ? `${symbolOptionSwapFor.sym.toUpperCase()} - ${symbolOptionSwapFor.name}`
                            : symbolOptionSwapFor.sym.toUpperCase()
                          : inputSearchSwapFor
                      }
                      onInputChange={(_event, newInputValue, reason) => {
                        if (reason === 'input') {
                          onOptionChangeSwapFor(null);
                          setInputSearchSwapFor(newInputValue);
                        } else if (reason === 'clear') {
                          onOptionChangeSwapFor(null);
                          setInputSearchSwapFor('');
                        }
                      }}
                      loading={!!selectedTokenRow && !tokenIconsSwapFor}
                      loadingText={<CircularProgress size={18} />}
                      noOptionsText={tokenIconsSwapFor ? t("NoOptionsOnThisChain") : ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("Search")}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                {symbolOptionSwapFor?.lURI ? (
                                  <InputAdornment position="start">
                                    <Avatar
                                      src={symbolOptionSwapFor.lURI}
                                      alt={symbolOptionSwapFor.sym}
                                      sx={{ width: 22, height: 22, mr: 1 }}
                                    />
                                  </InputAdornment>
                                ) : (
                                  <InputAdornment position="start">
                                    <SearchIcon />
                                  </InputAdornment>
                                )}
                              </>
                            ),
                            sx: {
                              input: {
                                textTransform: symbolOptionSwapFor ? 'uppercase' : 'none',
                              },
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={option.lURI ?? undefined}
                            alt={option.sym}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body1">
                            {option.name
                              ? `${option.sym.toUpperCase()} - ${option.name}`
                              : option.sym.toUpperCase()}
                          </Typography>
                        </Box>
                      )}
                    />
                  </Box>
                </Grid>

                <Grid item xs={11.8}>
                  <Grid container justifyContent="space-between" spacing={0}>
                    <Grid item xs={3.7}>
                      <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "transparent" ,
                            borderRadius: "4px",
                            paddingLeft: "15px"
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255, 0.23)" : "gray",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "calc(100% - 32px)",
                          }}
                        >
                          {tokenAddress ? `${tokenAddress.slice(0, 25)}...` : t("TokensAddress")}
                        </Typography>

                        {tokenAddress && tokenAddressSwapFor && !errorMessage && (
                          <Tooltip title={t("Copy")}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(tokenAddress);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255, 0.23)" : "gray" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>


                    <Grid item xs={3.7}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "transparent",
                          borderRadius: "4px",
                          paddingLeft: "20px"
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color:theme.palette.mode === "dark" ?  "rgba(255, 255, 255, 0.23)" : "gray",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "calc(100% - 32px)",
                          }}
                        >
                          {tokenAddressSwapFor
                            ? `${tokenAddressSwapFor.slice(0, 25)}...`
                            : t("SwapForPositionAddress")}
                        </Typography>

                        {tokenAddressSwapFor && !errorMessage && (
                          <Tooltip title={t("Copy")}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(tokenAddressSwapFor);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255, 0.23)" : "gray" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>

                  </Grid>
              </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    
                <Grid item xs />
                  <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={9}>
                        <Box>
                          <Stack 
                            direction="row" 
                            justifyContent="space-between" 
                            alignItems="center" 
                            mb={2}
                          >
                            <SegmentedDexSwitch
                              isDexEnabled={isDexEnabled}
                              selectedDexsCount={selectedDexs.length}
                              maxSelections={MAX_SELECTIONS}
                              onToggle={toggleDexFilter}
                            />

                            {isDexEnabled && selectedDexs.length > 0 && (
                              <Button
                                startIcon={<ReplayIcon />}
                                onClick={clearAllDexSelections}
                                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                                {t("Clear")}
                              </Button>
                            )}
                          </Stack>

                          {isDexEnabled && (
                            <>
                              {selectedDexs.length > 0 && (
                                <Box mb={2}>
                                  <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {selectedDexs.map((dex) => (
                                      <Chip
                                        key={dex.id}
                                        label={dex.title}
                                        onDelete={() => handleRemoveDex(dex.id)}
                                        sx={{ 
                                         bgcolor: 'background.default',
                                         border: '1px solid',
                                         borderColor: 'divider',
                                        '&:hover': { borderColor: 'primary.main' }
                                        }}
                                      />
                                     ))}
                                  </Stack>
                                </Box>
                              )}

                              <MultiSelectDexDropdown
                                setIsDexDropdownOpen={setIsDexDropdownOpen}
                                isDexDropdownOpen={isDexDropdownOpen}
                                dexs={allDexs}
                                selectedDexs={selectedDexs}
                                setSelectedDexs={setSelectedDexs}
                                maxSelections={4}           
                              />
                            </>
                         )}
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box display="flex" flexDirection="column" alignItems="flex-end" sx={{marginTop:"58px"}}>
                        <Button
                          id="get_quotes_btn"
                          variant="contained"
                          onClick={handleFetchQuotes}
                          disabled= {!selectedTokenRow || !symbolOptionSwapFor || !newBalance || !selectedChain || !symbolOptionSwap}
                          sx={{
                            backgroundColor: "#219a83",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#219a83",
                          },
                         }}
                         startIcon={
                           <Box
                             sx={{
                               display: "flex",
                               alignItems: "center",
                               animation: quoteLoading ? "spin 1s linear infinite" : "none",
                               "@keyframes spin": {
                                 "0%": { transform: "rotate(0deg)" },
                                 "100%": { transform: "rotate(360deg)" },
                                },
                              }}
                             >
                             <RefreshIcon />
                           </Box>
                         }
                        >
                      {t("GetQuotes")}
                       </Button>
                       </Box >
                         {quoteData.length > 0 && lastUpdated && (
                           <Typography sx={{ color: "#3acd40", fontSize: "0.875rem", marginTop: 1, textAlign: "right",}}>
                             {t("LastUpdate")}: {lastUpdated}
                           </Typography>
                         )}
                      </Grid>
                  </Grid>
                </Grid>
       
              </Grid>
              <Grid item xs={12} sx={{ marginTop: 3 }} id="execute_section">
                <TableContainer
                  id="routes_list"
                  component={Paper}
                  sx={{
                    border: "1px solid gray",
                    borderRadius: "4px",
                  }}
                >
                  <Table sx={{ color: "blue" }}>
                    <TableHead  sx={{
                  backgroundColor:
                    theme.palette.mode === "light" ? "#d2d2d2" : "inherit",
                }}>
                      <TableRow>
                        <TableCell sx={{ pl: 2 }}>{t("DEX")}</TableCell>
                        <TableCell>{t("Est. Price")}</TableCell>
                        <TableCell>
                          {t("EstGasFees", {
                            value: getGasTokenSymbol(selectedChain)
                              ? `(${getGasTokenSymbol(selectedChain)})`
                              : "",
                          })}
                        </TableCell>
                        <TableCell>{t("EstGasFeesUSD")}</TableCell>
                        <TableCell>{t("EstAmount")}</TableCell>
                        <TableCell sx={{ width: 120 }} />
                      </TableRow>
                    </TableHead>

                    {symbolOptionSwap &&
                      symbolOptionSwapFor &&
                      selectedChain &&
                      quoteData &&
                      !errorMessage &&
                      !quoteError && (
                        <TableBody
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "light" ? "#f5f5f5" : "#192132",
                          }}
                        >
                          {quoteData.map((row, index) => {
                            const dexKey = Array.isArray(row.name) ? row.name[0] : row.name;
                            const dexUrl = dexWebsites[dexKey];
                            const isHighlightedDex =
                              typeof dexKey === "string" &&
                              (dexKey.toUpperCase().includes("UNISWAP") || dexKey.toUpperCase().includes("1INCH"));
                            const isBest = index === 0;

                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  ...(isBest && {
                                    borderLeft: "4px solid #219a83",
                                     backgroundColor:
                                      theme.palette.mode === "light"
                                        ? "rgba(74, 158, 255, 0.08)"
                                        : "rgba(74, 158, 255, 0.15)",
                                  }),
                                }}
                              >
                                <TableCell sx={{ color: "#23751aff", pl: 2 }}>
                                  {dexUrl ? (
                                    <a
                                      href={row.deepLink ?? dexUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: "#219a83",
                                        textDecoration: "underline",
                                        fontWeight: isHighlightedDex ? 700 : 400,
                                      }}
                                    >
                                      {dexKey}
                                    </a>
                                  ) : (
                                    <Typography component="span" sx={{ fontWeight: isHighlightedDex ? 700 : 500 }}>
                                      {dexKey}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.gas}</TableCell>
                                <TableCell>{row.gasUSD}</TableCell>
                                <TableCell>{row.estAmount}</TableCell>
                                <TableCell align="right" sx={{ pr: 2 }}>
                                  {isBest && (
                                    <Chip
                                      label={
                                        <Box
                                          component="span"
                                          sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                          }}
                                        >
                                          <Typography component="span" variant="body2">
                                            ⭐
                                          </Typography>
                                          <Typography component="span" variant="body2" fontWeight={700}>
                                            {t("BEST")}
                                          </Typography>
                                        </Box>
                                      }
                                      size="small"
                                      sx={{
                                        backgroundColor: "#219a83",
                                        color: "#fff",
                                        fontWeight: 600,
                                        borderRadius: "999px",
                                        px: 1.2,
                                        py: 0.4,
                                        boxShadow: "none"
                                      }}
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      )}
                  </Table>
                </TableContainer>
                {quoteData.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderColor: theme.palette.mode === "dark" ? "rgba(3, 169, 244, 0.4)" : "rgba(3, 169, 244, 0.3)",
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <LaunchOutlinedIcon sx={{ color: "#03a9f4", fontSize: "1rem" }} />
                      <Typography sx={{ color: "#03a9f4", fontWeight: 600, fontSize: "0.85rem" }}>
                        {t("DeepLinksNotice")}
                      </Typography>
                    </Stack>
                  </Paper>
                )}
                {invalidQuote.length > 0 && lastUpdated && (
                  <Typography sx={{ color: theme.palette.mode === "dark" ? "#f14f36ff" : "#be3f04ff", fontSize: "0.75rem", marginTop: 1 }}>
                    {invalidQuoteError()}.
                  </Typography>
                )}
                {quoteData.length > 0 && lastUpdated && (
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <AccessTimeIcon sx={{ color: noticeColor, fontSize: "1rem", mt: "2px" }} />
                      <Typography sx={{ color: noticeColor, fontSize: "0.75rem" }}>
                        {t("MarketDataUpdated", { value: lastUpdated })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <WarningAmberRoundedIcon sx={{ color: noticeColor, fontSize: "1rem", mt: "2px" }} />
                      <Typography sx={{ color: noticeColor, fontSize: "0.75rem" }}>
                        {t("ExecutionPricesNotice")}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <DescriptionOutlinedIcon sx={{ color: noticeColor, fontSize: "1rem", mt: "2px" }} />
                      <Typography sx={{ color: noticeColor, fontSize: "0.75rem" }}>
                        {t("DexAdditionalFeesNotice")}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
                <NoRouteDialog
                    open={noRouteOpen}
                    onClose={() => setNoRouteOpen(false)}
                  />
              </Grid> 
            </Grid>            
        ) : (
            <Grid container spacing={2}>
              {/* BRIDGE SECTION START */}
              <Grid item xs={6}>
                {/* FROM CARD */}
                <Box sx={{ borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : '#e4e8f5', p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", letterSpacing: '0.06em', textTransform: 'none' }}>{t('Bridge From')}</Typography>
                    <Box className="chain-badge" sx={{ background: 'rgba(98,126,234,0.12)', border: '1px solid rgba(98,126,234,0.35)', color: '#627EEA', borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#627EEA', boxShadow: '0 0 6px #627EEA', mr: 0.5 }} />
                      {selectedChain || 'ETHEREUM'}
                    </Box>
                  </Box>
                  {/* Token Dropdown + Chain Dropdown */}
                  <Box display="flex" gap={2} mb={1.5}>
                    <Box flex={2}>
                      <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Current Position')}</Typography>
                      <Autocomplete
                        options={tokenIcons?.items ?? []}
                        getOptionLabel={(option) => option.sym}
                        value={symbolOptionSwap}
                        onChange={(_e, newValue) => onOptionChangeSwap(newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disableClearable={false}
                        inputValue={symbolOptionSwap ? symbolOptionSwap.name ? `${symbolOptionSwap.sym.toUpperCase()} - ${symbolOptionSwap.name}` : symbolOptionSwap.sym.toUpperCase() : inputSearchSwap}
                        onInputChange={(_event, newInputValue, reason) => {
                          if (reason === 'clear') {
                            onOptionChangeSwap(null);
                          }
                          setInputSearchSwap(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('Search')}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {symbolOptionSwap?.lURI ? (
                                    <InputAdornment position="start">
                                      <Avatar src={symbolOptionSwap.lURI} alt={symbolOptionSwap.sym} sx={{ width: 22, height: 22, mr: 1 }} />
                                    </InputAdornment>
                                  ) : (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  )}
                                </>
                              ),
                              sx: {
                                input: {
                                  textTransform: symbolOptionSwap ? 'uppercase' : 'none',
                                },
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={option.lURI ?? undefined} alt={option.sym} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body1">
                              {option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                      />
                    </Box>
                    <Box flex={1}>
                      <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Chain')}</Typography>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={selectedChain}
                        disabled
                        sx={{
                          height: '40px',
                          marginBottom: 1,
                          '& .MuiInputBase-root': { height: '40px' },
                        }}
                      />
                    </Box>
                  </Box>
                  {/* BRIDGE FROM: Token Address + Copy */}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7680a0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tokenAddress ? `${tokenAddress.slice(0, 25)}...` : t('TokensAddress')}
                    </Typography>
                    {tokenAddress && (
                      <Tooltip title={t('Copy')}>
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText(tokenAddress); }}>
                          <ContentCopyIcon fontSize="small" sx={{ color: '#7680a0' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  {/* Qty Input */}
                  <Box mb={1.5} display="flex" flexDirection="column">
                    <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Qty')}</Typography>
                    <TextField
                      id="bridge_quantity_input"
                      variant="outlined"
                      size="small"
                      value={formatNumberWithCommas(newBalance)}
                      onChange={(e) => {
                        const input = e.target.value.replace(/,/g, "");
                        const validInput = /^(\d+)?(\.\d*)?$/.test(input);
                        const numericValue = parseFloat(input);
                        const max = Number(maxBalance);
                        if (validInput) {
                          const [, decimalPart = ""] = input.split(".");
                          if (decimalPart.length <= 5) {
                            if (!isNaN(numericValue)) {
                              setShowNoQuotesMessage(false);
                              setNewBalance(input);
                            }
                            if (input === "" || input === "." || input.endsWith(".")) {
                              setShowNoQuotesMessage(false);
                              setNewBalance(input);
                            }
                          }
                        }
                      }}
                      type="text"
                      fullWidth
                      inputProps={{
                        inputMode: 'decimal',
                        min: 0,
                        style: { MozAppearance: 'textfield' },
                      }}
                      sx={{
                        marginBottom: 1,
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                        '& input[type=number]': { MozAppearance: 'textfield' },
                        '& .MuiInputBase-root': { height: '40px' },
                        '& .MuiInputLabel-root': { marginTop: '8px' },
                        width: '70%',
                      }}
                    />
                  </Box>
                </Box>
                {/* TO CARD */}
                <Box sx={{ borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : 'rgba(48,54,74,0.5)', p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", letterSpacing: '0.06em', textTransform: 'none' }}>{t('Bridge To')}</Typography>
                    <Box className="chain-badge" sx={{ background: 'rgba(40,160,240,0.12)', border: '1px solid rgba(40,160,240,0.35)', color: '#28A0F0', borderRadius: '4px', px: 1.5, py: 0.5, fontWeight: 700, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#28A0F0', boxShadow: '0 0 6px #28A0F0', mr: 0.5 }} />
                      {'ARBITRUM'}
                    </Box>
                  </Box>
                  {/* Token Dropdown + Chain Dropdown */}
                  <Box display="flex" gap={2} mb={1.5}>
                    <Box flex={2}>
                      <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Bridge For')}</Typography>
                      <Autocomplete
                        id="bridge_to_token_dropdown"
                        options={tokenIconsSwapFor?.items ?? []}
                        getOptionLabel={(option) => option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
                        value={symbolOptionSwapFor}
                        onChange={(_e, newValue) => {
                          onOptionChangeSwapFor(newValue);
                          if (newValue) {
                            setInputSearchSwapFor(newValue.name ? `${newValue.sym.toUpperCase()} - ${newValue.name}` : newValue.sym.toUpperCase());
                          }
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disableClearable={false}
                        inputValue={symbolOptionSwapFor ? symbolOptionSwapFor.name ? `${symbolOptionSwapFor.sym.toUpperCase()} - ${symbolOptionSwapFor.name}` : symbolOptionSwapFor.sym.toUpperCase() : inputSearchSwapFor}
                        onInputChange={(_event, newInputValue, reason) => {
                          if (reason === 'input') {
                            onOptionChangeSwapFor(null);
                            setInputSearchSwapFor(newInputValue);
                          } else if (reason === 'clear') {
                            onOptionChangeSwapFor(null);
                            setInputSearchSwapFor('');
                          }
                        }}
                        loading={!tokenIconsSwapFor}
                        loadingText={<CircularProgress size={18} />}
                        noOptionsText={tokenIconsSwapFor ? t('NoOptionsOnThisChain') : ''}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('Search')}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  {symbolOptionSwapFor?.lURI ? (
                                    <InputAdornment position="start">
                                      <Avatar src={symbolOptionSwapFor.lURI} alt={symbolOptionSwapFor.sym} sx={{ width: 22, height: 22, mr: 1 }} />
                                    </InputAdornment>
                                  ) : (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  )}
                                </>
                              ),
                              sx: {
                                input: {
                                  textTransform: symbolOptionSwapFor ? 'uppercase' : 'none',
                                },
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={option.lURI ?? undefined} alt={option.sym} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body1">
                              {option.name ? `${option.sym.toUpperCase()} - ${option.name}` : option.sym.toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                      />
                    </Box>
                    <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-end">
                      <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", fontWeight: 600, textTransform: 'none', fontSize: '0.85rem', mb: 0.5 }}>{t('Chain')}</Typography>
                      <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={"ARBITRUM"}
                        disabled
                        sx={{ height: '40px', marginBottom: 1, '& .MuiInputBase-root': { height: '40px' } }}
                      >
                        <MenuItem value="ARBITRUM">ARBITRUM</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                  {/* BRIDGE TO: Token Address + Copy */}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7680a0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tokenAddressSwapFor ? `${tokenAddressSwapFor.slice(0, 25)}...` : t('SwapForPositionAddress')}
                    </Typography>
                    {tokenAddressSwapFor && (
                      <Tooltip title={t('Copy')}>
                        <IconButton size="small" onClick={() => { navigator.clipboard.writeText(tokenAddressSwapFor); }}>
                          <ContentCopyIcon fontSize="small" sx={{ color: '#7680a0' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                {/* GET ROUTES BUTTON */}
                <Button
                  id="get_quotes_btn"
                  variant="contained"
                  onClick={handleFetchQuotes}
                  disabled= {!selectedTokenRow || !symbolOptionSwapFor || !newBalance || !selectedChain || !symbolOptionSwap}
                  sx={{
                    backgroundColor: "#219a83",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "#219a83",
                  },
                  }}
                  startIcon={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        animation: quoteLoading ? "spin 1s linear infinite" : "none",
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                      >
                      <RefreshIcon />
                    </Box>
                  }
                >
              {t("GetQuotes")}
                </Button>
                {/* Last update + disclaimers */}
                {lastUpdated && (
                  <Box sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
                      <AccessTimeIcon sx={{ color: '#00e5a0', fontSize: '1rem', mt: '2px' }} />
                      <Typography sx={{ color: '#00e5a0', fontSize: '0.75rem' }}>
                        Last Updated: {lastUpdated}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
                      <InfoOutlinedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                      <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                        Prices are estimates and fluctuate based on network conditions.
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
                      <WarningAmberRoundedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                      <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                        Gas fees are estimates only. Final costs determined at execution time.
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <DescriptionOutlinedIcon sx={{ color: '#fbc02d', fontSize: '1rem', mt: '2px' }} />
                      <Typography sx={{ color: '#fbc02d', fontSize: '0.75rem' }}>
                        Bridge protocols may apply additional fees. Review all parameters before proceeding.
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Grid>
              {/* BRIDGE ROUTES CARD */}
              <Grid item xs={6}>
                <Box sx={{ borderRadius: '10px', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(81, 81, 81, 1)' : '#e4e8f5', p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: theme.palette.mode === "dark" ?  "rgba(255, 255, 255)" : "gray", letterSpacing: '0.08em' }}>{t('Bridge Routes')}</Typography>
                    {/* routes count badge */}
                    {lastUpdated && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.7rem', color: '#00e5a0', fontWeight: 600 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5a0', boxShadow: '0 0 6px #00e5a0' }} />
                        <span>4 routes found</span>
                      </Box>
                    )}
                  </Box>
                  {/* Empty state / Loading / Routes list (hardcoded) */}
                  {!lastUpdated ? (
                    <Box sx={{ border: '1px dashed #30364a', borderRadius: '10px', p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'rgba(0,229,160,0.10)', border: '1px solid rgba(0,229,160,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⇄</Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#7680a0' }}>{t('NoRoutesYet', 'No routes yet')}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#424b64', maxWidth: 220, lineHeight: 1.5 }}>{t('ConfigureBridgeParams', 'Configure your bridge parameters and click Get Routes to see available options.')}</Typography>
                    </Box>
                  ) : (
                    <BridgeRoutesMockup />
                  )}
                </Box>
              </Grid>
            </Grid>
        )}
      </Grid>
      </Box>
    </Grid>
  );
};
