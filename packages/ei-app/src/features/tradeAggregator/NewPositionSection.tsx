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
} from "@mui/material";
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
import MultiSelectDexDropdown, { Dex } from "./MultiSelectDexDropdown";
import { generateUniswapLink } from "@/helpers/UniswapLinksGenerator";
import SegmentedDexSwitch from "@/components/SegmentedDexSwitch";
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import NoRouteDialog from "./NoRouteDialog";
import { OneInchQuoteResponse } from "components";
import { useSubscription } from "@/hooks/useSubscription";

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

          if (isUniswap && tokenAddress && tokenAddressSwapFor && newBalance) {
            
            deepLink = generateUniswapLink({
              inputCurrency: tokenAddress,
              outputCurrency: tokenAddressSwapFor,
              exactAmount: Number(newBalance),
              exactField: "input",
              version: name,
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

  return (
    <Grid
      container
      direction="column"
      sx={{
        minHeight: "522px",
        borderRadius: "10px",
        boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgb(54, 54, 64)" : "transparent",
        padding: 2,
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
              backgroundColor: activeTab === "swap" ? "#1e88e5" : undefined,
              color: activeTab === "swap" ? "#fff" : undefined,
              "&:hover": {
                backgroundColor: activeTab === "swap" ? "#1565c0" : undefined,
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
              backgroundColor: activeTab === "bridge" ? "#1e88e5" : undefined,
              color: activeTab === "bridge" ? "#fff" : undefined,
              "&:hover": {
                backgroundColor: activeTab === "bridge" ? "#1565c0" : undefined,
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
                      noOptionsText={t("NoOptionsOnThisChain")}
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
                                Clear
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
                          variant="contained"
                          onClick={handleFetchQuotes}
                          disabled= {!selectedTokenRow || !symbolOptionSwapFor || !newBalance || !selectedChain || !symbolOptionSwap}
                          sx={{
                            backgroundColor: "#1e88e5",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#1565c0",
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
              <Grid item xs={12} sx={{ marginTop: 3 }}>
                <TableContainer
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
                            const isBest = index === 0;

                            return (
                              <TableRow
                                key={index}
                                sx={{
                                  ...(isBest && {
                                    borderLeft: "4px solid #1e88e5",
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
                                        color: "#1e88e5",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {dexKey}
                                    </a>
                                  ) : (
                                    dexKey
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
                                        backgroundColor: "#1e88e5",
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
                {invalidQuote.length > 0 && lastUpdated && (
                  <Typography sx={{ color: theme.palette.mode === "dark" ? "#f14f36ff" : "#be3f04ff", fontSize: "0.75rem", marginTop: 1 }}>
                    {invalidQuoteError()}.
                  </Typography>
                )}
                {quoteData.length > 0 && lastUpdated && (
                  <Typography sx={{ color: theme.palette.mode === "dark" ? "#f1b036ff" : "#be7d04ff", fontSize: "0.75rem", marginTop: 1 }}>
                    {t("MarketDataUpdatedAs", { value: lastUpdated })}
                  </Typography>
                )}
                <NoRouteDialog
                    open={noRouteOpen}
                    onClose={() => setNoRouteOpen(false)}
                  />
              </Grid> 
            </Grid>            
        ) : (
            <Typography sx={{ fontSize: "20px" }}> Coming soon...</Typography>
        )}
      </Grid> 
    </Grid>
  );
};
