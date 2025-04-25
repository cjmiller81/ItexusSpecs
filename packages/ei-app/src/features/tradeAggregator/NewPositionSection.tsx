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
  Checkbox
} from "@mui/material";
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
import { fetchQuote, fetchQuoteParameters } from "../../../../components/src/slices/dexSlice";

interface NewPositionSectionProps {
    selectedWallet: Wallet | null;
    onSelectedTokenChange?: (tokenInfo: any) => void;
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

  const balanceRaw = filteredRows.find(token => token.tokenName?.toUpperCase() === extractSymbol(symbolOptionSwap?.label ?? "").toUpperCase())
  ?.balance;

const maxBalance = balanceRaw !== undefined && balanceRaw !== null
  ? balanceRaw.toFixed(5)
  : "0.0000";

  useEffect(() => {
    setErrorQuote(quoteError);
    setErrorQuoteParametrs(error)
  },[error,quoteError])

  useEffect(() => {
    if (quote) {
      const processedData = quote.protocols.map((protocolGroup: any[][]) => {
        const firstProtocol = protocolGroup[0];
        const names = firstProtocol.map((step: any) => step.name).filter(Boolean);
        return {
          name: names[0],
          gas: quote.gas,
          volume: "",
          price: "",
        };
      });
      setQuoteData(processedData);
    }
  }, [quote]);  

  useEffect(() => {
    if (
      data &&
      data.fromTokenAddress &&
      data.toTokenAddress &&
      data.amount > 0
    ) {
      dispatch(fetchQuote({
        chainName: data.chainName,
        fromTokenAddress: data.fromTokenAddress,
        toTokenAddress: data.toTokenAddress,
        amount: data.amount,
      }));
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
      onSelectedTokenChange?.(matchedToken.sym);
    } else {
      setSelectedToken(null);
      onSelectedTokenChange?.(null);
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
    } else {
      setErrorMessage(null);
  
      if (symbolOptionSwap && symbolOptionSwapFor && selectedChain && newBalance) {
        
        dispatch(fetchQuoteParameters({
          tokenPositionSymbol: extractSymbol(symbolOptionSwap.label),
          chainName: selectedChain,
          qty: Number(newBalance),
          swapForSymbol: extractSymbol(symbolOptionSwapFor.label),
          tokenPositionId: symbolOptionSwap.id,
          swapForId: symbolOptionSwapFor.id,
        }));
      }
  
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
        minHeight: "377px",
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
                <TableCell>{t("EstGasFees")}</TableCell>
              </TableRow>
            </TableHead>

            {symbolOptionSwap && symbolOptionSwapFor && selectedChain && quoteData && !errorMessage && !quoteError && (
              <TableBody sx={{ backgroundColor: "#192132" }}>
                {quoteData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "#539eec" }}>
                      {Array.isArray(row.name) ? (
                        row.name[0]
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.gas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
