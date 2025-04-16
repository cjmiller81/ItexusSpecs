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
import SearchIcon from '@mui/icons-material/Search';
import { Asset } from "@/models/Wallet/asset";

interface NewPositionSectionProps {
    selectedWallet: Wallet | null;
    onSelectedTokenChange?: (tokenInfo: any) => void; 
  }

export const NewPositionSection: React.FC<NewPositionSectionProps> = ({ selectedWallet, onSelectedTokenChange })=> {
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");
  const [selectedChain, setSelectedChain] = useState("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);
  const [symbolOptionSwap, setSymbolOptionSwap] = useState<string>("");
  const [symbolOptionSwapFor, setSymbolOptionSwapFor] = useState<LookUpOption | null>(null);
  const [inputSearchSwapFor, setInputSearchSwapFor] = useState("");
  const [tableData, setTableData] = useState<any[]>([]); 
  const [useMax,setUseMax] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  const LookupPageSize = 10;

  useEffect(() => {
    fetchTableData();
  }, [symbolOptionSwap, symbolOptionSwapFor, selectedChain, selectedWallet]);

  const maxBalance = selectedWallet?.chainAssets
  .find(asset => asset.chainName.toUpperCase() === selectedChain.toUpperCase())
  ?.walletAssets.find(token => token.tokenName.toUpperCase() === symbolOptionSwap.toUpperCase())
  ?.balance || "";

  useEffect(() => {
    if (!symbolOptionSwap || !selectedChain || !selectedWallet) {
      setSelectedToken(null);
      return;
    }
  
    const extractSymbol = (label: string) => label.split(" ")[0].toUpperCase();
    const selectedSymbol = extractSymbol(symbolOptionSwap);
    const selectedChainUpper = selectedChain.toUpperCase();
  
    const matchedChain = selectedWallet.chainAssets.find(
      chainAsset => chainAsset.chainName.toUpperCase() === selectedChainUpper
    );
  
    const matchedToken = matchedChain?.walletAssets.find(
      token => token.tokenName.toUpperCase() === selectedSymbol
    );
  
    if (matchedToken) {
      setSelectedToken(matchedToken.tokenName);
      onSelectedTokenChange?.(matchedToken.tokenName);
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

  const onOptionChangeSwapFor = (value: any) => {
    setSymbolOptionSwapFor(value); 
  };

  const onInputChangeSwapFor = (value: string) => {
    setInputSearchSwapFor(value); 
  };

  const dexComparisons = [
    {
      dex: 'Uniswap V3',
      volume: '$1.7B',
      price: '1.0033',
      gasFee: '$16.57'
    },
    {
      dex: 'SushiSwap',
      volume: '$532.8M',
      price: '0.9992',
      gasFee: '$15.74'
    },
    {
      dex: 'PancakeSwap',
      volume: '$712.1M',
      price: '1.0015',
      gasFee: '$14.91'
    },
    {
      dex: 'Curve',
      volume: '$426.2M',
      price: '0.9975',
      gasFee: '$19.88'
    },
    {
      dex: 'Balancer V2',
      volume: '$655.7M',
      price: '1.0062',
      gasFee: '$18.23'
    }
  ];

  const formatNumberWithCommas = (value: string) => {
    const [intPart, decimalPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  const fetchTableData = () => {
    if (symbolOptionSwap && selectedChain && selectedWallet) {
      const extractSymbol = (label: string) => label.split(" ")[0].toUpperCase();
      const selectedSymbol = extractSymbol(symbolOptionSwap);
      const selectedChainUpper = selectedChain.toUpperCase();
  
      const hasTokenAndChain = selectedWallet.chainAssets.some(chainAsset => {
        const chainMatches = chainAsset.chainName.toUpperCase() === selectedChainUpper;
        if (!chainMatches) return false;
  
        return chainAsset.walletAssets.some(
          token => token.tokenName.toUpperCase() === selectedSymbol
        );
      });
  
      setTableData(hasTokenAndChain ? dexComparisons : []);
    } else {
      setTableData([]);
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
                <Grid item xs={2}>
                <Typography sx={{ marginBottom: "4px" }}>{t("TokenPosition")}</Typography>
                  <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                    <Select
                      value={symbolOptionSwap}
                      onChange={(e) => setSymbolOptionSwap(e.target.value)}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'lightgray' }}>
                              <SearchIcon fontSize="small" sx={{ marginRight: 1 }} />
                              {t("Search")}
                            </Box>
                          );
                        }
                        return selected;
                      }}
                      sx={{
                        height: "53px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MenuItem disabled value="">
                        {t("Search")}
                      </MenuItem>

                      {tokenSymbols.map((symbol, idx) => (
                        <MenuItem key={idx} value={symbol}>
                          {symbol}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={3.4}>
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

                <Grid item xs={2.7}>
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
                        if (!isNaN(numericValue) && numericValue <= max) {
                          setNewBalance(input);
                        }

                        if (input === "" || input === "." || input.endsWith(".")) {
                          setNewBalance(input);
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

                <Grid item xs={3.9}>
                    <StyledSymbolLookup
                    pageSize={LookupPageSize}
                    onFetchPage={pageNumber => fetchLookupPage(pageNumber, inputSearchSwapFor)}
                    tooltip={t("SwapFor")}
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
            </Grid>
        ) : (
            <Typography sx={{ color: "gray" }}></Typography>
        )}
      </Grid>

      {symbolOptionSwap && symbolOptionSwapFor && selectedChain && (
        <Grid item xs={12} sx={{ marginTop: 3 }}>
            <TableContainer component={Paper} 
            sx={{
                border: "1px solid gray", 
                borderRadius: "4px", 
              }}>
            <Table sx={{ color: "blue" }}>
                <TableHead>
                <TableRow>
                    <TableCell>{t("DEX")}</TableCell>
                    <TableCell>{t("Volume")}</TableCell>
                    <TableCell>{t("Price")}</TableCell>
                    <TableCell>{t("EstGasFees")}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "#192132" }}>
                {tableData.map((row, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{ color: "#539eec" }}>{row.dex}</TableCell>
                    <TableCell>{row.volume}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.gasFee}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </Grid>
        )}
    </Grid>
  );
};
