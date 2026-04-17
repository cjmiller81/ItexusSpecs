import React, { useEffect, useState, useRef } from "react";
import {
  getGasTokenSymbol,
  formatNumberWithCommas,
  generateErrorMessage,
  coinGeckoChainId
} from "./tradeAggregatorUtils";

import { BridgeTab } from "./BridgeTab";
import { NewSwapTab } from "./newSwap/NewSwapTab";
import { toRawAmount } from "./toRawAmount";
import { postLifiRoutes } from "./lifiApi";
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
} from "@mui/material";
import InfoIcon from '@mui/icons-material/InfoOutlined';
import styles from "./unsupported-chain-notice.module.css";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from "react-i18next";
import { Wallet } from "@/models/Wallet/Wallet";
import RefreshIcon from '@mui/icons-material/Refresh';
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

import { EnrichedTokenPosition } from "../../../../components/src/utils/enrichTokenPositions";

interface NewPositionSectionProps {
  selectedWallet: Wallet | null;
  onSelectedTokenChange?: (tokenInfo: any, chainInfo: any) => void;
  filteredRows: EnrichedTokenPosition[];
  selectedTokenRow: EnrichedTokenPosition | null;
}

export const NewPositionSection: React.FC<NewPositionSectionProps> = ({ selectedWallet, onSelectedTokenChange, filteredRows, selectedTokenRow}) => {
  // Check if selected token is not bridgeable
  const isUnsupported = selectedTokenRow && selectedTokenRow.isBridgeable === false;
  const [selectedTokenRowSwap, setSelectedTokenRowSwap] = useState<EnrichedTokenPosition | null>(null);
  const [selectedTokenRowBridge, setSelectedTokenRowBridge] = useState<EnrichedTokenPosition | null>(null);
  const [selectedBridgeToChainId, setSelectedBridgeToChainId] = useState<number | null>(null);
  const [inputSearchBridgeToChain, setInputSearchBridgeToChain] = useState("");
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const { getTradeAggregatorQuoteLimit } = useSubscription();
  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");
  const [selectedChain, setSelectedChain] = useState("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [symbolOptionSwap, setSymbolOptionSwap] = useState<TokenSearchItem | null>(null);
  const [symbolOptionSwapForSwap, setSymbolOptionSwapForSwap] = useState<TokenSearchItem | null>(null);
  const [symbolOptionSwapForBridge, setSymbolOptionSwapForBridge] = useState<TokenSearchItem | null>(null);
  const [inputSearchSwapForSwap, setInputSearchSwapForSwap] = useState("");
  const [inputSearchSwapForBridge, setInputSearchSwapForBridge] = useState("");
  const [inputSearchSwap, setInputSearchSwap] = useState("");
  const [useMax,setUseMax] = useState<boolean>(true);
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedSwap, setLastUpdatedSwap] = useState<string | null>(null);
  const [hasAttemptedSubmitSwap, setHasAttemptedSubmitSwap] = useState(false);
  const [quoteDataSwap, setQuoteDataSwap] = useState<any[]>([]);
  const [quoteLoadingSwap, setQuoteLoadingSwap] = useState(false);
  const [errorMessageSwap, setErrorMessageSwap] = useState<string | null>(null);
  const [lastUpdatedBridge, setLastUpdatedBridge] = useState<string | null>(null);
  const [hasAttemptedSubmitBridge, setHasAttemptedSubmitBridge] = useState(false);
  const [quoteDataBridge, setQuoteDataBridge] = useState<any[]>([]);
  const [quoteLoadingBridge, setQuoteLoadingBridge] = useState(false);
  const [errorMessageBridge, setErrorMessageBridge] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { data, error, quote, quoteError, quoteLoading} = useSelector((state: RootState) => state.dex);
  const [errorQuote, setErrorQuote] = useState<string | null>("");
  const [errorQuoteParametrs, setErrorQuoteParametrs] = useState<string | null>("");
  const [hasShownErrorOnce, setHasShownErrorOnce] = useState(false);
  const [tokenAddress,setTokenAddress] = useState<string | null>(null);
  const [tokenAddressSwapFor,setTokenAddressSwapFor] = useState<string | null>(null);
  const [shouldFetchQuote, setShouldFetchQuote] = useState(false);
  const [showNoQuotesMessage, setShowNoQuotesMessage] = useState(false);
  // Cancel flag for clearing quotes
  const cancelQuotes = useRef(false);
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
  const onClearBridgeToTokenAddress = React.useCallback(() => {}, []);
    
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
  }, [selectedTokenRowBridge, activeTab, symbolOptionSwapForBridge, newBalance]);

  useEffect(() => {
    if (activeTab === "bridge" && selectedTokenRow) {
      setSelectedTokenRowBridge(selectedTokenRow);
    }
  }, [selectedTokenRow, activeTab]);

  // Reset Bridge For when Bridge To chain is cleared
    useEffect(() => {
      if (activeTab === "bridge" && selectedBridgeToChainId === null) {
        setSymbolOptionSwapForBridge(null);
        setInputSearchSwapForBridge("");
        setLastUpdatedBridge(null);
        setQuoteLoadingBridge(false);
        setQuoteDataBridge([]);
        setErrorMessageBridge(null);
      }
    }, [selectedBridgeToChainId, activeTab]);

    // Always clear Swap For Address when Bridge For is cleared (Bridge tab)
  useEffect(() => {
    if (activeTab === "bridge" && symbolOptionSwapForBridge === null) {
      setTokenAddressSwapFor(null);
    }
  }, [activeTab, symbolOptionSwapForBridge]);

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


  const resetAllState = () => {
    setTokenAddresses([]);
    setTokenIcons(null);
    setSymbolOptionSwap(null);
    setSymbolOptionSwapForSwap(null);
    setInputSearchSwapForSwap("");
    setSymbolOptionSwapForBridge(null);
    setInputSearchSwapForBridge("");
    setSelectedChain("");
    setNewBalance("");
  };

  useEffect(() => {
    if (!selectedWallet) {
      resetAllState();
      return;
    }
    const addresses: string[] = filteredRows
      .map((token) => token.tokenAddress)
      .filter((address): address is string => typeof address === 'string' && address !== '');
    setTokenAddresses(addresses);
  }, [selectedWallet, filteredRows]);

  // Swap tab: fetch icons for Swap For dropdown
  useEffect(() => {
    if (activeTab !== 'swap' || !selectedChain) return;

    const timeoutId = setTimeout(() => {
      const fetchIconsForSwapFor = async () => {
        const chainId = coinGeckoChainId(selectedChain);
        if (!chainId) return;

        try {
          const result = await iconsApi.getIcons(
            inputSearchSwapForSwap,
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
  }, [activeTab, selectedChain, inputSearchSwapForSwap]);

  const maxBalance = balanceRaw !== undefined && balanceRaw !== null
    ? balanceRaw.toFixed(5)
    : "0.0000";

    useEffect(() => {
    if (hasAttemptedSubmitSwap) {
      setErrorQuote(quoteError);
      setErrorQuoteParametrs(error);
    } else {
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
    }
  }, [quoteError, error, hasAttemptedSubmitSwap]);

  useEffect(() => {
    if (hasAttemptedSubmitBridge) {
      setErrorQuote(quoteError);
      setErrorQuoteParametrs(error);
    } else {
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
    }
  }, [quoteError, error, hasAttemptedSubmitBridge]);

  useEffect(() => {
    const fetchProtocolsAndTokens = async () => {
      if (quote.length && symbolOptionSwap && symbolOptionSwapForSwap) {

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
            fetchToken({ id: symbolOptionSwapForSwap.id })
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

          } else if (isOneInch && symbolOptionSwap && symbolOptionSwapForSwap && selectedChain) {
            deepLink = generateOneInchLink({
              chainName: selectedChain,
              srcTokenAddress: symbolOptionSwap.sym.toUpperCase(),
              dstTokenAddress: symbolOptionSwapForSwap.sym.toUpperCase(),
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
        setQuoteDataSwap(processedData);
      }
    };

    fetchProtocolsAndTokens();
  }, [activeTab, quote, symbolOptionSwap, symbolOptionSwapForSwap, tokenAddress, tokenAddressSwapFor, newBalance, selectedChain, quoteLoading, dispatch]);

  // Bridge: quotes processing for Bridge tab
  useEffect(() => {
    if (activeTab !== 'bridge') return;
    const fetchProtocolsAndTokens = async () => {
      if (quote.length && symbolOptionSwap && symbolOptionSwapForBridge) {
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
          await dispatch(fetchToken({ id: symbolOptionSwap.id })).unwrap();
          swapForToken = await dispatch(
            fetchToken({ id: symbolOptionSwapForBridge.id })
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
          // Bridge deepLink may differ if needed
          let estAmount = Number(q.dstAmount) / Math.pow(10, q.dstToken.decimals);
          const price = estAmount / parseFloat(newBalance);
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
        setQuoteDataBridge(processedData);
      }
    };
    fetchProtocolsAndTokens();
  }, [activeTab, quote, symbolOptionSwap, symbolOptionSwapForBridge, tokenAddress, tokenAddressSwapFor, newBalance, selectedChain, quoteLoading, dispatch]);

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
          lURI: selectedTokenRow.logoUrl,
          mCap: 0,
          mSup: null,
        };
        setSymbolOptionSwap(virtualToken);
        setSelectedToken(virtualToken.sym);
      }
    } else if (selectedTokenRow && !tokenIcons?.items) {
      setSelectedChain(selectedTokenRow.chain?.toUpperCase() || "");
    }
    setSymbolOptionSwapForSwap(null);
    setInputSearchSwapForSwap("");
    setSymbolOptionSwapForBridge(null);
    setInputSearchSwapForBridge("");
  }, [selectedTokenRow, tokenIcons]);

  useEffect(() => {
    if (filteredRows.length > 0) {
      const virtualTokens = filteredRows.map(row => ({
        id: `virtual-${row.tokenName?.toLowerCase()}`,
        sym: row.tokenName || '',
        name: row.name || '',
        address: [row.tokenAddress || ''],
        lURI: row.logoUrl,
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
        name: selectedTokenRow.chain || '',
        address: [selectedTokenRow.tokenAddress || ''],
        lURI: selectedTokenRow.logoUrl,
        mCap: 0,
        mSup: null,
      };
      setSymbolOptionSwap(virtualToken);
      setSelectedToken(virtualToken.sym);
    }
  }, [selectedTokenRow, tokenIcons?.items]);

  useEffect(() => {
    if (!symbolOptionSwap || !selectedWallet) {
      setSelectedToken(null);
      setNewBalance("");
      return;
    }

    // Try to find the token by symbol and chain (case-insensitive, trimmed)
    const matchedToken = filteredRows.find(token => {
      const tokenSym = token.tokenName?.toUpperCase().trim();
      const selSym = symbolOptionSwap.sym?.toUpperCase().trim();
      const tokenChain = token.chain?.toUpperCase().trim();
      const selChain = selectedChain?.toUpperCase().trim();
      // If selectedChain is empty, fallback to tokenChain match only by symbol
      if (!selChain) {
        return tokenSym === selSym;
      }
      return tokenSym === selSym && tokenChain === selChain;
    });

    if (matchedToken) {
      setSelectedToken(matchedToken.tokenName || null);
      setNewBalance(matchedToken.balance?.toString() || "");
      onSelectedTokenChange?.(matchedToken.tokenName, matchedToken.chain);
    } else {
      setSelectedToken(null);
      setNewBalance("");
      onSelectedTokenChange?.(null, null);
    }
  }, [symbolOptionSwap, selectedChain, selectedWallet, filteredRows]);

  useEffect(() => {
    if (useMax && symbolOptionSwap) {
      setNewBalance(maxBalance.toString());
    }
  }, [useMax, maxBalance]);

  useEffect(() => {
    if (hasAttemptedSubmitSwap) {
      setErrorMessageSwap(generateErrorMessage({
        symbolOptionSwap,
        filteredRows,
        selectedChain,
        symbolOptionSwapFor: symbolOptionSwapForSwap,
        newBalance,
        t
      }));
      // setQuoteDataSwap([]);
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
    }
  }, [symbolOptionSwap, selectedChain, symbolOptionSwapForSwap, newBalance, hasAttemptedSubmitSwap]);

  useEffect(() => {
    if (hasAttemptedSubmitBridge) {
      setErrorMessageBridge(generateErrorMessage({
        symbolOptionSwap,
        filteredRows,
        selectedChain,
        symbolOptionSwapFor: symbolOptionSwapForBridge,
        newBalance,
        t
      }));
      // setQuoteDataBridge([]);
      setErrorQuote(null);
      setErrorQuoteParametrs(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
    }
  }, [symbolOptionSwap, selectedChain, symbolOptionSwapForBridge, newBalance, hasAttemptedSubmitBridge]);

  const onOptionChangeSwapFor = (value: TokenSearchItem | null, tab: "swap" | "bridge") => {
    setShowNoQuotesMessage(false);
    if (tab === "swap") {
      if (value && value.id === symbolOptionSwap?.id) {
        setSymbolOptionSwapForSwap(value);
        setErrorMessageSwap(t("SameTokenError"));
        return;
      }
      setSymbolOptionSwapForSwap(value);
      setErrorMessageSwap(null);
      if (value === null) {
        setHasAttemptedSubmitSwap(false);
        setLastUpdatedSwap(null);
        cancelQuotes.current = true; // Cancel any pending quotes
        setQuoteLoadingSwap(false); // Stop spinner
      }

      if (symbolOptionSwap && value && selectedChain && newBalance) {
        dispatch(
          fetchQuoteParameters({
            tokenPositionSymbol: symbolOptionSwap.sym,
            chainName: selectedChain,
            qty: Number(newBalance),
            swapForSymbol: value.sym,
            tokenPositionId: symbolOptionSwap.id,
            swapForId: value.id,
          })
        ).then((result) => {
          if (fetchQuoteParameters.fulfilled.match(result)) {
            const data = result.payload;
            if (data?.fromTokenAddress && data?.toTokenAddress) {
              setTokenAddress(data.fromTokenAddress);
              setTokenAddressSwapFor(data.toTokenAddress);
            } else {
              setTokenAddress(null);
              setTokenAddressSwapFor(null);
            }
          } else {
            setTokenAddress(null);
            setTokenAddressSwapFor(null);
          }
        });
      }
    } else {
      if (value && value.id === symbolOptionSwap?.id) {
        setSymbolOptionSwapForBridge(value);
        setErrorMessageBridge(t("SameTokenError"));
        return;
      }
      setSymbolOptionSwapForBridge(value);
      setErrorMessageBridge(null);
      if (value === null) {
        setQuoteDataBridge([]);
        setLastUpdatedBridge(null);
        setErrorMessageBridge(null);
        setShowNoQuotesMessage(false);
        setErrorQuote(null);
        setErrorQuoteParametrs(null);
        setTokenAddress(null);
        setTokenAddressSwapFor(null);
        setHasAttemptedSubmitBridge(false);
        cancelQuotes.current = true; // Cancel any pending bridge quotes
        setQuoteLoadingBridge(false); // Stop spinner
      }
    }
  };

  const onOptionChangeSwap = (value: TokenSearchItem | null) => {
    setShowNoQuotesMessage(false);

    const swapFor = activeTab === "swap" ? symbolOptionSwapForSwap : symbolOptionSwapForBridge;

    if (value && swapFor && value.id === swapFor.id) {
      setSymbolOptionSwap(value);
      setErrorMessageSwap(t("SameTokenError"));
      return;
    }

    if (value === null) {
      onSelectedTokenChange?.(null, null);
      if (activeTab === "swap") {
        setHasAttemptedSubmitSwap(false);
        setLastUpdatedSwap(null);
        cancelQuotes.current = true; // Cancel any pending quotes
        setQuoteLoadingSwap(false); // Stop spinner
      } else if (activeTab === "bridge") {
        setQuoteDataSwap([]);
        setLastUpdatedBridge(null);
        setErrorMessageSwap(null);
        setShowNoQuotesMessage(false);
        setErrorQuote(null);
        setErrorQuoteParametrs(null);
        setTokenAddress(null);
        setTokenAddressSwapFor(null);
        setHasAttemptedSubmitBridge(false);
        cancelQuotes.current = true; // Cancel any pending bridge quotes
        setQuoteLoadingBridge(false); // Stop spinner
      }
    }

    setSymbolOptionSwap(value);
    setErrorMessageSwap(null);

    // Fetch token addresses for display if both tokens are selected
    if (value && swapFor && selectedChain && newBalance) {
      dispatch(
        fetchQuoteParameters({
          tokenPositionSymbol: value.sym,
          chainName: selectedChain,
          qty: Number(newBalance),
          swapForSymbol: swapFor.sym,
          tokenPositionId: value.id,
          swapForId: swapFor.id,
        })
      ).then((result) => {
        if (fetchQuoteParameters.fulfilled.match(result)) {
          const data = result.payload;
          if (data?.fromTokenAddress && data?.toTokenAddress) {
            setTokenAddress(data.fromTokenAddress);
            setTokenAddressSwapFor(data.toTokenAddress);
          } else {
            setTokenAddress(null);
            setTokenAddressSwapFor(null);
          }
        } else {
          setTokenAddress(null);
          setTokenAddressSwapFor(null);
        }
      });
    }
  };


  const handleFetchQuotesSwap = async () => {
    setHasAttemptedSubmitSwap(true);
    setQuoteLoadingSwap(true);
    cancelQuotes.current = false; // Reset cancel flag on new fetch
    const swapFor = symbolOptionSwapForSwap;
    const err = generateErrorMessage({
      symbolOptionSwap,
      filteredRows,
      selectedChain,
      symbolOptionSwapFor: swapFor,
      newBalance,
      t
    });
    if (err) {
      setQuoteDataSwap([]);
      setErrorMessageSwap(err);
      setLastUpdatedSwap(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
      setQuoteLoadingSwap(false);
      return;
    }
    setErrorMessageSwap(null);
    const fromTokenAddress =
      tokenAddress ||
      (selectedTokenRowSwap?.tokenAddress
        ? selectedTokenRowSwap.tokenAddress
        : selectedTokenRow?.tokenAddress || '');
    const toTokenAddress = swapFor?.address
      ? Array.isArray(swapFor.address)
        ? swapFor.address[0]
        : swapFor.address
      : '';

    let fromTokenDecimals = 18;
    if (typeof selectedTokenRowSwap?.decimals === 'number') {
      fromTokenDecimals = selectedTokenRowSwap.decimals;
    } else if (typeof selectedTokenRow?.decimals === 'number') {
      fromTokenDecimals = selectedTokenRow.decimals;
    }
    let fromAmountRaw = '0';
    try {
      fromAmountRaw = toRawAmount(newBalance, fromTokenDecimals);
    } catch (e) {
      setErrorMessageSwap(t("Invalid amount"));
      setQuoteDataSwap([]);
      setQuoteLoadingSwap(false);
      return;
    }
    try {
      const fromChainId = coinGeckoChainId(selectedChain) || 1;
      const toChainId = fromChainId; // For swap, both on same chain
      const data = await postLifiRoutes({
        fromChainId,
        toChainId,
        fromAmount: fromAmountRaw,
        fromTokenAddress: String(fromTokenAddress),
        toTokenAddress: String(toTokenAddress),
      });
      if (!cancelQuotes.current) {
        setQuoteDataSwap(Array.isArray(data.routes) ? data.routes : []);
        setErrorMessageSwap((Array.isArray(data.routes) && data.routes.length > 0) ? null : t("No swap routes found"));
      }
    } catch (e) {
      if (!cancelQuotes.current) {
        setErrorMessageSwap(t("Error fetching swap routes"));
        setQuoteDataSwap([]);
      }
      setQuoteLoadingSwap(false);
      return;
    }
    if (!cancelQuotes.current) {
      setTokenAddress(String(fromTokenAddress));
      setTokenAddressSwapFor(String(toTokenAddress));
      const now = new Date();
      const formatted = now.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLastUpdatedSwap(formatted);
    }
    setQuoteLoadingSwap(false);
  };

  const handleFetchQuotesBridge = async () => {
    setHasAttemptedSubmitBridge(true);
    setQuoteLoadingBridge(true);
    cancelQuotes.current = false; // Reset cancel flag on new fetch
    const swapFor = symbolOptionSwapForBridge;
    const err = generateErrorMessage({
      symbolOptionSwap,
      filteredRows,
      selectedChain,
      symbolOptionSwapFor: swapFor,
      newBalance,
      t
    });
    if (err) {
      setQuoteDataBridge([]);
      setErrorMessageBridge(err);
      setLastUpdatedBridge(null);
      setTokenAddress(null);
      setTokenAddressSwapFor(null);
      setQuoteLoadingBridge(false);
      return;
    }
    setErrorMessageBridge(null);
    const fromTokenAddress = selectedTokenRowBridge?.tokenAddress || '';
    const toTokenAddress = symbolOptionSwapForBridge?.address
      ? Array.isArray(symbolOptionSwapForBridge.address)
        ? symbolOptionSwapForBridge.address[0]
        : symbolOptionSwapForBridge.address
      : '';
    const fromTokenDecimals = typeof selectedTokenRowBridge?.decimals === 'number' ? selectedTokenRowBridge.decimals : 18;
    // Convert fromAmount to raw amount using BigInt
    let fromAmountRaw = '0';
    try {
      fromAmountRaw = toRawAmount(newBalance, fromTokenDecimals);
    } catch (e) {
      setErrorMessageBridge(t("Invalid amount"));
      setQuoteDataBridge([]);
      setQuoteLoadingBridge(false);
      return;
    }
    // POST to /api/lifi/routes using lifiApi
    try {
      const fromChainId = coinGeckoChainId(selectedChain) || 1;
      const toChainId = selectedBridgeToChainId || 1;
      const data = await postLifiRoutes({
        fromChainId,
        toChainId,
        fromAmount: fromAmountRaw,
        fromTokenAddress: String(fromTokenAddress),
        toTokenAddress: String(toTokenAddress),
      });
      if (!cancelQuotes.current) {
        setQuoteDataBridge(Array.isArray(data.routes) ? data.routes : []);
        setErrorMessageBridge((Array.isArray(data.routes) && data.routes.length > 0) ? null : t("No bridge routes found"));
      }
    } catch (e) {
      if (!cancelQuotes.current) {
        setErrorMessageBridge(t("Error fetching bridge routes"));
        setQuoteDataBridge([]);
      }
      setQuoteLoadingBridge(false);
      return;
    }
    if (!cancelQuotes.current) {
      setTokenAddress(String(fromTokenAddress));
      setTokenAddressSwapFor(String(toTokenAddress));
      const now = new Date();
      const formatted = now.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLastUpdatedBridge(formatted);
    }
    setQuoteLoadingBridge(false);
  };

  // Find the selected position from dropdown and update fields as if selected from table
  const handleCurrentPositionDropdownChange = async (event: any, value: TokenSearchItem | null) => {
    if (!value) {
      setSymbolOptionSwap(null);
      setSelectedToken(null);
      setSelectedChain("");
      setNewBalance("");
      onSelectedTokenChange?.(null, null);
      setSelectedTokenRowSwap(null);
      setSelectedTokenRowBridge(null);
      return;
    }

    let tokenWithIcon: TokenSearchItem | null = null;
    if (tokenIcons?.items) {
      tokenWithIcon = tokenIcons.items.find(
        (item) => item.id === value.id || item.sym?.toUpperCase() === value.sym?.toUpperCase()
      ) || null;
    }

    const tokenToSet = tokenWithIcon || value;
    setSymbolOptionSwap(tokenToSet);
    setSelectedToken(tokenToSet.sym);

    const matchedToken = filteredRows.find(token =>
      token.tokenName?.toUpperCase() === tokenToSet.sym?.toUpperCase()
    );
    if (matchedToken) {
      setSelectedChain(matchedToken.chain?.toUpperCase() || "");
      setNewBalance(matchedToken.balance?.toString() || "");
      onSelectedTokenChange?.(matchedToken.tokenName, matchedToken.chain);
      setSelectedTokenRowSwap(matchedToken);
      setSelectedTokenRowBridge(matchedToken);
    } else {
      setSelectedChain("");
      setNewBalance("");
      onSelectedTokenChange?.(tokenToSet.sym, null);
      setSelectedTokenRowSwap(null);
      setSelectedTokenRowBridge(null);
    }
  };

  const isWalletSelected = selectedWallet !== null;
  const noticeColor = theme.palette.mode === "dark" ? "#f1b036ff" : "#be7d04ff";

  return (
    <Grid
      id="new-position-section-root"
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.palette.mode === 'dark' ? '#2a2b36' : '#e5e7ef',
            borderRadius: '10px',
            p: '2px',
            width: { xs: '100%', sm: 'auto' },
            maxWidth: 256,
            minWidth: 176,
            marginBottom: 2,
            marginX: 'auto',
          }}
        >
          <Button
            onClick={() => setActiveTab('swap')}
            startIcon={<span style={{fontSize:14,marginRight:2,display:'flex',alignItems:'center'}}>⇄</span>}
            sx={{
              flex: 1,
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: 'none',
              background: activeTab === 'swap' ? '#1ec28b' : 'transparent',
              color: activeTab === 'swap' ? '#fff' : theme.palette.mode === 'dark' ? '#bdbdbd' : '#222',
              transition: 'background 0.2s',
              minWidth: 0,
              px: 2.4,
              py: 0.88,
              height: 32,
              '&:hover': {
                background: activeTab === 'swap' ? '#1ec28b' : 'rgba(30,194,139,0.08)',
                color: activeTab === 'swap' ? '#fff' : theme.palette.mode === 'dark' ? '#bdbdbd' : '#222',
              },
            }}
            disableElevation
          >
            {t('Swap')}
          </Button>
          <Button
            onClick={() => setActiveTab('bridge')}
            startIcon={<span style={{fontSize:14,marginRight:2,display:'flex',alignItems:'center'}}>⛓</span>}
            sx={{
              flex: 1,
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: 'none',
              background: activeTab === 'bridge' ? '#1ec28b' : 'transparent',
              color: activeTab === 'bridge' ? '#fff' : theme.palette.mode === 'dark' ? '#bdbdbd' : '#222',
              transition: 'background 0.2s',
              minWidth: 0,
              px: 2.4,
              py: 0.88,
              height: 32,
              ml: 0.8,
              '&:hover': {
                background: activeTab === 'bridge' ? '#1ec28b' : 'rgba(30,194,139,0.08)',
                color: activeTab === 'bridge' ? '#fff' : theme.palette.mode === 'dark' ? '#bdbdbd' : '#222',
              },
            }}
            disableElevation
          >
            {t('Bridge')}
          </Button>
        </Box>

      {isUnsupported && (
        <div className={styles.unsupportedChainNotice} style={{ margin: '16px auto', maxWidth: 420 }}>
          <InfoIcon sx={{ color: '#f1b036', mt: '2px', fontSize: 20 }} />
          <span>
            <strong>Bridge/Swap not supported for this token.</strong> Please select a bridgeable token to continue.
          </span>
        </div>
      )}
      <Grid item>
        {activeTab === "swap" ? (
          // NewSwapTab is now rendered for the Swap tab. The old implementation is preserved below in comments for easy restoration.
                      <>
                        <NewSwapTab
                          t={t}
                          symbolOptionSwap={symbolOptionSwap}
                          tokenIcons={tokenIcons}
                          handleCurrentPositionDropdownChange={handleCurrentPositionDropdownChange}
                          inputSearchSwap={inputSearchSwap}
                          setInputSearchSwap={setInputSearchSwap}
                          formatNumberWithCommas={formatNumberWithCommas}
                          newBalance={newBalance}
                          setNewBalance={setNewBalance}
                          selectedChain={selectedChain}
                          selectedTokenRow={selectedTokenRow}
                          setSelectedTokenRow={setSelectedTokenRowSwap}
                          balanceRaw={balanceRaw}
                          setShowNoQuotesMessage={setShowNoQuotesMessage}
                          onOptionChangeSwap={onOptionChangeSwap}
                          tokenIconsSwapFor={tokenIconsSwapFor}
                          symbolOptionSwapFor={symbolOptionSwapForSwap}
                          onOptionChangeSwapFor={(v) => onOptionChangeSwapFor(v, "swap")}
                          inputSearchSwapFor={inputSearchSwapForSwap}
                          setInputSearchSwapFor={setInputSearchSwapForSwap}
                          handleFetchQuotes={handleFetchQuotesSwap}
                          quoteLoading={quoteLoadingSwap}
                          lastUpdated={lastUpdatedSwap}
                          quoteData={quoteDataSwap}
                          errorMessage={errorMessageSwap}
                          setTokenIconsSwapFor={setTokenIconsSwapFor}
                          selectedBridgeToChainId={selectedBridgeToChainId}
                          setSelectedBridgeToChainId={setSelectedBridgeToChainId}
                          inputSearchBridgeToChain={inputSearchBridgeToChain}
                          setInputSearchBridgeToChain={setInputSearchBridgeToChain}
                          onClearBridgeToTokenAddress={onClearBridgeToTokenAddress}
                          chains={[]}
                          bridgeFromTokenDecimals={null}
                          isUnsupported={isUnsupported}
                        />
                        {/*
                        // --- OLD SWAP TAB IMPLEMENTATION ---
                        // To restore, replace the <NewSwapTab ... /> above with the code below.
                        // <Grid container spacing={2}> ... (full old Swap tab code) ... </Grid>
                        */}
                      </>
            /*<Grid container spacing={2}>
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
                        onChange={handleCurrentPositionDropdownChange}
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
                      {!symbolOptionSwapForSwap && (
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
                      value={symbolOptionSwapForSwap}
                      disabled={!selectedTokenRow}
                      onChange={(_e, newValue) => {
                        onOptionChangeSwapFor(newValue, "swap");
                        if (newValue) {
                          setInputSearchSwapForSwap(
                            newValue.name
                              ? `${newValue.sym.toUpperCase()} - ${newValue.name}`
                              : newValue.sym.toUpperCase()
                          );
                        }
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      disableClearable={false}
                      inputValue={
                        symbolOptionSwapForSwap
                          ? symbolOptionSwapForSwap.name
                            ? `${symbolOptionSwapForSwap.sym.toUpperCase()} - ${symbolOptionSwapForSwap.name}`
                            : symbolOptionSwapForSwap.sym.toUpperCase()
                          : inputSearchSwapForSwap
                      }
                      onInputChange={(_event, newInputValue, reason) => {
                        if (reason === 'input') {
                          onOptionChangeSwapFor(null, "swap");
                          setInputSearchSwapForSwap(newInputValue);
                        } else if (reason === 'clear') {
                          onOptionChangeSwapFor(null, "swap");
                          setInputSearchSwapForSwap('');
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
                                {symbolOptionSwapForSwap?.lURI ? (
                                  <InputAdornment position="start">
                                    <Avatar
                                      src={symbolOptionSwapForSwap.lURI}
                                      alt={symbolOptionSwapForSwap.sym}
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
                                textTransform: symbolOptionSwapForSwap ? 'uppercase' : 'none',
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
                          onClick={handleFetchQuotesSwap}
                          disabled= {!selectedTokenRow || !symbolOptionSwapForSwap || !newBalance || !selectedChain || !symbolOptionSwap}
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
                      </Box>
                         {quoteData.length > 0 && lastUpdatedSwap && (
                           <Typography sx={{ color: "#3acd40", fontSize: "0.875rem", marginTop: 1, textAlign: "right",}}>
                             {t("LastUpdate")}: {lastUpdatedSwap}
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
                      symbolOptionSwapForSwap &&
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
                {invalidQuote.length > 0 && lastUpdatedBridge && (
                  <Typography sx={{ color: theme.palette.mode === "dark" ? "#f14f36ff" : "#be3f04ff", fontSize: "0.75rem", marginTop: 1 }}>
                    {invalidQuoteError()}.
                  </Typography>
                )}
                {quoteData.length > 0 && lastUpdatedSwap && (
                  <Stack spacing={1} sx={{ mt: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <AccessTimeIcon sx={{ color: noticeColor, fontSize: "1rem", mt: "2px" }} />
                      <Typography sx={{ color: noticeColor, fontSize: "0.75rem" }}>
                        {t("MarketDataUpdated", { value: lastUpdatedSwap })}
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
            </Grid> */           
        ) : (
            <BridgeTab
              t={t}
              symbolOptionSwap={symbolOptionSwap}
              tokenIcons={tokenIcons}
              handleCurrentPositionDropdownChange={handleCurrentPositionDropdownChange}
              inputSearchSwap={inputSearchSwap}
              setInputSearchSwap={setInputSearchSwap}
              formatNumberWithCommas={formatNumberWithCommas}
              newBalance={newBalance}
              setNewBalance={setNewBalance}
              selectedChain={selectedChain}
              selectedTokenRow={selectedTokenRowBridge}
              setSelectedTokenRow={setSelectedTokenRowBridge}
              balanceRaw={balanceRaw}
              setShowNoQuotesMessage={setShowNoQuotesMessage}
              onOptionChangeSwap={onOptionChangeSwap}
              tokenIconsSwapFor={tokenIconsSwapFor}
              symbolOptionSwapFor={symbolOptionSwapForBridge}
              onOptionChangeSwapFor={(v) => onOptionChangeSwapFor(v, "bridge")}
              inputSearchSwapFor={inputSearchSwapForBridge}
              setInputSearchSwapFor={setInputSearchSwapForBridge}
              handleFetchQuotes={handleFetchQuotesBridge}
              quoteLoading={quoteLoadingBridge}
              lastUpdated={lastUpdatedBridge}
              quoteData={quoteDataBridge}
              errorMessage={errorMessageBridge}
              setTokenIconsSwapFor={setTokenIconsSwapFor}
              selectedBridgeToChainId={selectedBridgeToChainId}
              setSelectedBridgeToChainId={setSelectedBridgeToChainId}
              inputSearchBridgeToChain={inputSearchBridgeToChain}
              setInputSearchBridgeToChain={setInputSearchBridgeToChain}
              onClearBridgeToTokenAddress={onClearBridgeToTokenAddress}
              chains={[]}
              bridgeFromTokenDecimals={typeof selectedTokenRowBridge?.decimals === 'number' ? selectedTokenRowBridge.decimals : 18}
              isUnsupported={isUnsupported}
            />
        )}
      </Grid>
      </Box>
    </Grid>
  );
};

