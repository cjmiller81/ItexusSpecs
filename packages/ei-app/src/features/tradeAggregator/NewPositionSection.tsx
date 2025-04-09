import { useState } from "react";
import {
  Grid,
  Button,
  useTheme,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  TextField
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { StyledSymbolLookup } from "../MyWallets/HistoricalWalletsWorth";
import fetchLookupPage from "../Common/fetchLookupPage";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { setCompareOption } from "@/libs/redux/Slices/MarketCapEqualWeightChartSlice";

export const NewPositionSection = () => {
  const theme = useTheme();
  const { t } = useTranslation("NewPositionSection");
  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");
  const { symbolOption } = useAppSelector(state => state.marketCapEqualWeightChart);
  const dispatch = useAppDispatch();
  const [selectedChain, setSelectedChain] = useState("");
  const [newBalance, setNewBalance] = useState<string>("");
  const [inputSearch, setInputSearch] = useState("");
  const [lookupLoading, setLookupLoading] = useState<boolean>(false);

  const LookupPageSize = 10;

  const onOptionChange = (value: any) => {
    dispatch(setCompareOption({ compareToOption: value }));
  };

  return (
    <Grid
      container
      direction="column"
      sx={{
        minHeight: "300px",
        borderRadius: "10px",
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
                <Grid item xs={3}>
                    <StyledSymbolLookup
                    pageSize={LookupPageSize}
                    onFetchPage={pageNumber => fetchLookupPage(pageNumber, inputSearch)}
                    tooltip={t("Token")}
                    loading={lookupLoading}
                    disableListWrap
                    value={symbolOption}
                    onChange={(_event, value) => onOptionChange(value)}
                    autoComplete={true}
                    onInputChange={(_event, value) => {
                        setInputSearch(value);
                    }}
                    filterOptions={x => x}
                    inputValue={inputSearch}
                    label={t("Token")}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography sx={{marginBottom:"4px"}}>{t("Chain")}</Typography>
                    <FormControl fullWidth size="small" sx={{ marginBottom: 2 }}>
                        <InputLabel
                            id="chain-select-label"
                            shrink={false}
                            sx={{
                                marginTop:"8px",
                                fontSize: "14px",
                            }}
                        >
                            {t("Chain")}
                        </InputLabel>
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
                            <MenuItem disabled value="">
                            </MenuItem>
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
                <Grid item xs={3}> 
                <Typography sx={{marginBottom:"4px"}}>{t("Qty")}</Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        value={newBalance}
                        onChange={e => setNewBalance(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ marginBottom: 2, 
                            '& .MuiInputBase-root': {
                                height: "53px",
                            },
                            '& .MuiInputLabel-root': {
                                marginTop:"8px"
                            },
                        }}
                    />
                </Grid>
            </Grid>
        ) : (
            <Typography sx={{ color: "gray" }}>{t("NoContent")}</Typography>
        )}
        </Grid>      
    </Grid>
  );
};
