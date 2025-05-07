import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  useTheme,
  Typography,
  FormControl,
  MenuItem,
  Select,
  TextField,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  TableBody,
  Paper,
  Box,
  Checkbox,
  Tooltip,
  InputAdornment,
  IconButton
} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from "react-i18next";
import { StyledSymbolLookup } from "../MyWallets/HistoricalWalletsWorth";
import fetchLookupPage from "../Common/fetchLookupPage";
import { LookUpOption } from "components/src/components/common/inputs/AppSymbolLookup/SymbolsLookup";
import { Wallet } from "@/models/Wallet/Wallet";
import RefreshIcon from '@mui/icons-material/Refresh';
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { useSelector } from "react-redux";
import { RootState } from "@/libs/redux/RootReducer";
import { useAppDispatch } from "@/libs/redux/Store";
import { fetchGas, fetchQuote, fetchQuoteParameters, fetchToken } from "../../../../components/src/slices/dexSlice";
import { dexWebsites } from "@/constants/dexWebsites";

interface NewPositionSectionProps {
    selectedWallet: Wallet | null;
    onSelectedTokenChange?: (tokenInfo: any, chainInfo: any) => void;
    filteredRows: WalletBalance[]; 
  }

export const NewPositionSection: React.FC<NewPositionSectionProps> = ({ selectedWallet, onSelectedTokenChange, filteredRows })=> {
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");
  const [selectedChain, setSelectedChain] = useState("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [symbolOptionSwap, setSymbolOptionSwap] = useState<LookUpOption | null>(null);
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<LookUpOption | null>(null);
  const [inputSearchSwapFor, setInputSearchSwapFor] = useState("");
  const [inputSearchSwap, setInputSearchSwap] = useState("");
  const [useMax,setUseMax] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const LookupPageSize = 10;
  const extractSymbol = (label: string) => label.split(" ")[0].toUpperCase();
  const [quoteData, setQuoteData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { data, error, quote, quoteError} = useSelector((state: RootState) => state.dex);
  const [errorQuote, setErrorQuote] = useState<string | null>(null);
  const [errorQuoteParametrs, setErrorQuoteParametrs] = useState<string | null>(null);
  const [tokenAddress,setTokenAddress] = useState<string | null>(null);
  const [tokenAddressSwapFor,setTokenAddressSwapFor] = useState<string | null>(null);
  const balanceRaw = filteredRows.find(token => token.tokenName?.toUpperCase() === extractSymbol(symbolOptionSwap?.label ?? "")
  .toUpperCase()&& token.chain?.toUpperCase() === selectedChain.toUpperCase())?.balance;

const maxBalance = balanceRaw !== undefined && balanceRaw !== null
  ? balanceRaw.toFixed(5)
  : "0.0000";

  useEffect(() => {
    setErrorQuote(quoteError);
    setErrorQuoteParametrs(error)
  },[error,quoteError])

  useEffect(() => {
    const fetchProtocolsAndTokens = async () => {
      if (quote && symbolOptionSwap && symbolOptionSwapFor) {
        let result = 0;
        let chainPrice = 0;

        try {

          const coinGeckoChainId = (chain: string) => {
            switch (chain.toLowerCase()) {
              case "ethereum":
              case "optimism":
              case "arbitrum":
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

          const chainPosition = await dispatch(fetchToken({ id: coinGeckoChainId(selectedChain) })).unwrap();
          chainPrice = Number(chainPosition.price.toString());
          const tokenPosition = await dispatch(fetchToken({ id: symbolOptionSwap.id })).unwrap();
          const swapForToken = await dispatch(fetchToken({ id: symbolOptionSwapFor.id })).unwrap();
          
          result = parseFloat(tokenPosition.price.toString()) / parseFloat(swapForToken.price.toString());
          
        } catch (err) {
          console.error("Error fetching tokens:", err);
        }

        let baseFee: any = 0;

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
        
          const response = await dispatch(fetchGas({ chainName: selectedChain }));
          
          if (selectedChain.toUpperCase() !== "BNB CHAIN") {
            baseFee = response.payload.baseFee;
          } else {
            baseFee = response.payload.standard;
          }
        } catch (err) {
          console.error("Error fetching gas:", err);
        }
        
        const processedData = quote.protocols.map((protocolGroup: any[][]) => {
          const firstProtocol = protocolGroup[0];
          const names = firstProtocol.map((step: any) => step.name).filter(Boolean);
          return {
            name: names[0],
            gas: parseFloat(((quote.gas * baseFee) / 1e18).toFixed(6)),
            price: result.toFixed(4),
            gasUSD: parseFloat((((quote.gas * baseFee) / 1e18) * chainPrice).toFixed(3))
          };
        });
        setQuoteData(processedData);        
      }
    };
  
    fetchProtocolsAndTokens();
  }, [quote]);

  useEffect(() => {
    if (
      data &&
      data.fromTokenAddress &&
      data.toTokenAddress &&
      data.amount > 0
    ) {
      const timer = setTimeout(() => {
        dispatch(fetchQuote({
          chainName: data.chainName,
          fromTokenAddress: data.fromTokenAddress,
          toTokenAddress: data.toTokenAddress,
          amount: data.amount,
        }));
      }, 1000); 
  
      return () => clearTimeout(timer);
    }
  }, [data, dispatch]);
  

  useEffect(() => {
    if (!symbolOptionSwap || !selectedChain || !selectedWallet) {
      setSelectedToken(null);
      return;
    }
  
    const selectedSymbol = extractSymbol(symbolOptionSwap.label);
    const selectedChainUpper = selectedChain.toUpperCase();
  
    const matchedToken = selectedWallet.chainAssets
      .find(chainAsset => chainAsset.chainName.toUpperCase() === selectedChainUpper)
      ?.tokenDetails.find(token => token.sym.toUpperCase() === selectedSymbol);
  
    if (matchedToken) {
      setSelectedToken(matchedToken.sym || null);
      onSelectedTokenChange?.(matchedToken.sym, selectedChain);
    } else {
      setSelectedToken(null);
      onSelectedTokenChange?.(null,null);
    }
  }, [symbolOptionSwap, selectedChain, selectedWallet]);

  useEffect(() => {
    if (useMax) {
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

  const onOptionChangeSwapFor = (value: any) => {
    setSymbolOptionSwapFor(value); 
  };

  const onInputChangeSwapFor = (value: string) => {
    setInputSearchSwapFor(value); 
  };

  const onOptionChangeSwap = (value: any) => {
    setSymbolOptionSwap(value); 
  };

  const onInputChangeSwap = (value: string) => {
    setInputSearchSwap(value); 
  };

  const getGasTokenSymbol = (chain: string): string => {
    const chainMap: Record<string, string> = {
      "ETHEREUM": "ETH",
      "OPTIMISM": "ETH",
      "ARBITRUM": "ETH",
      "BNB CHAIN": "BNB",
      "POLYGON": "MATIC",
      "AVALANCHE": "AVAX",
    };
    return chainMap[chain.toUpperCase()] || "";
  };  

  const generateErrorMessage = () => {
    const errors: string[] = [];
  
    const selectedSymbol = extractSymbol(symbolOptionSwap?.label ?? "").toUpperCase();
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
              tokenPositionSymbol: extractSymbol(symbolOptionSwap.label),
              chainName: selectedChain,
              qty: Number(newBalance),
              swapForSymbol: extractSymbol(symbolOptionSwapFor.label),
              tokenPositionId: symbolOptionSwap.id,
              swapForId: symbolOptionSwapFor.id,
            })
          );
    
          if (fetchQuoteParameters.fulfilled.match(result)) {
            const data = result.payload;
            if (data?.fromTokenAddress && data?.toTokenAddress) {
              setTokenAddress(data.toTokenAddress);
              setTokenAddressSwapFor(data.fromTokenAddress);
            } else {
              setTokenAddress(null);
              setTokenAddressSwapFor(null);
            }
          } else {
            setTokenAddress(null);
            setTokenAddressSwapFor(null);
            console.error("Ошибка API:", result);
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

  const tokenSymbols = Array.from(
    new Set(
      selectedWallet?.chainAssets.flatMap((chainAsset) =>
        chainAsset.tokenDetails.map((token) => token.sym.toUpperCase())
      )
    )
  ) || [];  

  return (
    <Grid
      container
      direction="column"
      sx={{
        minHeight: "475px",
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

        {false && (
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
        )}
      </Grid>

      <Grid item>
        {activeTab === "swap" ? (
            <Grid container spacing={2}>
                <Grid item xs={3.7}>
                  <Box>
                    <StyledSymbolLookup
                        pageSize={LookupPageSize}
                        onFetchPage={pageNumber => fetchLookupPage(pageNumber, inputSearchSwap)}
                        loading={lookupLoading}
                        disableListWrap
                        value={symbolOptionSwap}
                        onChange={(_event, value) => onOptionChangeSwap(value)}
                        autoComplete={true}
                        onInputChange={(_event, value) => onInputChangeSwap(value)} 
                        filterOptions={x => x}
                        inputValue={inputSearchSwap}
                        label={t("TokenPosition")}
                        />

                      <Typography sx={{ marginTop: "15px" }}>{t("TokensAddress")}</Typography>
                      <TextField
                        value={tokenAddress ?? ''}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { fontSize: '0.6rem' },
                          readOnly: true,
                          endAdornment: tokenAddress && tokenAddressSwapFor && errorMessage === null ? (
                            <InputAdornment position="end">
                              <Tooltip title={t("Copy")}>
                                <IconButton
                                  onClick={() => {
                                    navigator.clipboard.writeText(tokenAddress);
                                  }}
                                  edge="end"
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ) : null,
                        }}
                        sx={{ marginTop: "15px" }}
                      />

                  </Box>
                </Grid>

                <Grid item xs={2.2}>
                    <Typography sx={{ marginBottom: "4px" }}>{t("Chain")}</Typography>
                    <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                        <Select
                            labelId="chain-select-label"
                            value={selectedChain}
                            onChange={e => setSelectedChain(e.target.value)}
                            sx={{
                                height: "53px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            displayEmpty
                            renderValue={selected => selected || ""}
                        >
                            <MenuItem disabled value=""></MenuItem>
                            <MenuItem value="ETHEREUM">ETHEREUM</MenuItem>
                            <MenuItem value="BNB CHAIN">BNB CHAIN</MenuItem>
                            <MenuItem value="OPTIMISM">OPTIMISM</MenuItem>
                            <MenuItem value="POLYGON">POLYGON</MenuItem>
                            <MenuItem value="AVALANCHE">AVALANCHE</MenuItem>
                            <MenuItem value="ARBITRUM">ARBITRUM</MenuItem>
                            <MenuItem value="ABSTRACTIONS">ABSTRACTIONS</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={2.2}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginBottom: "4px" }}>
                    <Typography>{t("Qty")}</Typography>

                    <Box display="flex" alignItems="center">
                      <Checkbox
                        size="small"
                        sx={{ padding: 0, marginRight: 1 }}
                        checked={useMax} 
                        onChange={() => setUseMax(prev => !prev)}
                      />
                      <Typography>{t("UseMax")}</Typography>
                    </Box>
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
                          if (!isNaN(numericValue) && numericValue <= max) {
                            setNewBalance(input);
                          }
                    
                          if (input === "" || input === "." || input.endsWith(".")) {
                            setNewBalance(input);
                          }
                        }
                      }
                    }}                    
                    type="text"
                    fullWidth
                    disabled={useMax}
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
                    <StyledSymbolLookup
                    pageSize={LookupPageSize}
                    onFetchPage={pageNumber => fetchLookupPage(pageNumber, inputSearchSwapFor)}
                    loading={lookupLoading}
                    disableListWrap
                    value={symbolOptionSwapFor}
                    onChange={(_event, value) => onOptionChangeSwapFor(value)}
                    autoComplete={true}
                    onInputChange={(_event, value) => onInputChangeSwapFor(value)} 
                    filterOptions={x => x}
                    inputValue={inputSearchSwapFor}
                    label={t("SwapFor")}
                    />
                    <Typography sx={{ marginTop: "15px" }}>{t("SwapForPositionAddress")}</Typography>
                    <TextField
                        value={tokenAddressSwapFor ?? ''}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { fontSize: '0.6rem' },
                          readOnly: true,
                          endAdornment: tokenAddress && tokenAddressSwapFor && errorMessage === null ? (
                            <InputAdornment position="end">
                              <Tooltip title={t("Copy")}>
                                <IconButton
                                  onClick={() => {
                                    navigator.clipboard.writeText(tokenAddressSwapFor);
                                  }}
                                  edge="end"
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ) : null,
                        }}
                        sx={{ marginTop: "15px" }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center">
                  {(errorMessage || error || quoteError) && (
                    <Grid item>
                      <Typography sx={{ color: "red", fontSize: "0.875rem", whiteSpace: "pre-line" }}>
                        {errorMessage}
                        { !errorMessage && errorQuoteParametrs && (errorMessage ? `\n${errorQuoteParametrs}` : errorQuoteParametrs)}
                        {!errorMessage && errorQuoteParametrs === null && errorQuote && t("SwapSearchError")}
                      </Typography>
                    </Grid>
                    )}
                <Grid item xs />
                  <Grid item>
                  <Box display="flex" flexDirection="column" alignItems="flex-end">
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={handleFetchQuotes}
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
                    >
                      {t("RefreshQuotes")}
                    </Button>
                    </Box>
                    {quoteData.length > 0 && lastUpdated && (
                  <Typography sx={{ color: "#3acd40", fontSize: "0.875rem", marginTop: 1 }}>
                    {t("LastUpdate")}: {lastUpdated}
                  </Typography>
                )}
                  </Grid>
                </Grid>       
              </Grid>
            </Grid>
        ) : (
            <Typography sx={{ color: "gray" }}></Typography>
        )}
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
            <TableHead>
              <TableRow>
                <TableCell>{t("DEX")}</TableCell>
                <TableCell>{t("Price")}</TableCell>
                <TableCell>
                  {t("EstGasFees", {
                    value: getGasTokenSymbol(selectedChain)
                      ? `(${getGasTokenSymbol(selectedChain)})`
                      : "",
                  })}
                </TableCell>
                <TableCell>{t("EstGasFeesUSD")}</TableCell>
              </TableRow>
            </TableHead>

            {symbolOptionSwap &&
              symbolOptionSwapFor &&
              selectedChain &&
              quoteData &&
              !errorMessage &&
              !quoteError && (
                <TableBody sx={{ backgroundColor: "#192132" }}>
                  {quoteData.map((row, index) => {
                    const dexKey = Array.isArray(row.name) ? row.name[0] : row.name;
                    const dexUrl = dexWebsites[dexKey];

                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "#539eec" }}>
                          {dexUrl ? (
                            <a
                              href={dexUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#539eec", textDecoration: "underline" }}
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
