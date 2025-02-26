import { useState } from "react";
import { Box, Button, Divider, MenuItem, Select, SelectChangeEvent, TextField, Checkbox, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ExitTierTable from "./ExitTierTable";
import React from "react";


export default function CallOptionSet() {
  const [account, setAccount] = useState("");
  const [entryType, setEntryType] = useState<string>("Buy_Ask");
  const [subProfile, setSubProfile] = useState("");
  const { t } = useTranslation("CallsSection");
  const [offsetPercent, setOffsetPercent] = useState(10);
  const [isBreakUpEnabled, setIsBreakUpEnabled] = useState(false);
  const [amount, setAmount] = useState(30000);
  const [breakUp, setBreakUp] = useState(20);
  const isBuyAsk = entryType === "Buy_Ask";
  const isOffsetValid = offsetPercent >= 0;
  const shouldDisableLaddering = isBuyAsk && isOffsetValid;
  const shouldShowHint = isBuyAsk && isOffsetValid;
  const [useLaddering, setUseLaddering] = useState(false);
  const [tradeUnderlyingFound, setTradeUnderlyingFound] = useState(false);
  const [onlyTradeUnderlying, setOnlyTradeUnderlying] = useState(false);
  const [isSendTriggerChecked, setIsSendTriggerChecked] = useState(false);
  const [isBAMaxEnabled, setIsBAMaxEnabled] = useState(false);

  const handleEntryTypeChange = (event) => {
    const newEntryType = event.target.value;
    setEntryType(newEntryType);

    if (newEntryType === "Buy_Ask" && offsetPercent >= 0) {
      setUseLaddering(false);
    } 
  };

  const handleOffsetChange = (event) => {
    const newOffset = event.target.value === "" ? offsetPercent : parseFloat(event.target.value);
    setOffsetPercent(newOffset);

    if (entryType === "Buy_Ask" && newOffset >= 0) {
      setUseLaddering(false);
    } 
  };

  const handleBreakUpChange = (event) => {
    const newBreakup = event.target.value === "" ? offsetPercent : parseFloat(event.target.value);
    setBreakUp(newBreakup);
  };

  const handleOnlyTradeUnderlyingChange = () => {
    setOnlyTradeUnderlying(!onlyTradeUnderlying);
    if (!onlyTradeUnderlying) {
      setTradeUnderlyingFound(true); 
    }
    else
    setTradeUnderlyingFound(false);
  };

  const handleTradeUnderlyingFoundChange = () => {
    setTradeUnderlyingFound(!tradeUnderlyingFound);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/,/g, "");
    if (!isNaN(Number(numericValue))) {
      setAmount(Number(numericValue));
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", p: 1.2 }}>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        {t("CallOptionSet")}
      </Typography>

      <Divider sx={{ mb: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />

      <Box sx={{ display: "flex", gap: 1.8, alignItems: "center", marginTop:"45px" }}>
        <Select
          value={account}
          onChange={(event: SelectChangeEvent) => setAccount(event.target.value)}
          displayEmpty
          sx={{ width: "200px", height: "40px", bgcolor: "gray",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <MenuItem value="" disabled>{t("Account")}</MenuItem>
        </Select>

        <Select
          value={subProfile}
          onChange={(event: SelectChangeEvent) => setSubProfile(event.target.value)}
          displayEmpty
          sx={{ width: "300px", height: "40px", bgcolor: "#2A9D8F", color: "white",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <MenuItem value="" disabled>{t("SelectSub-Profile")}</MenuItem>
        </Select>

        <Button variant="contained" 
          sx={{ 
            height: "40px", 
            bgcolor: "#2A9D8F", 
            color: "white", 
            textTransform: "none", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", 
            whiteSpace: "nowrap",
            overflow: "hidden",
            minWidth: "150px",
            maxWidth: "100%", }}>
              {t("CreateNewSub-Profile")}
        </Button>
        <Button variant="contained" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white",textTransform: "none",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("Save")}
        </Button>
        <Button variant="outlined" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white",textTransform: "none",boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("SaveCopy")}
        </Button>
      </Box>

      <Divider sx={{ my: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />

      <Box sx={{display: "flex", marginTop:"50px"}}>
        <Button variant="outlined" 
          sx={{ 
            height: "40px", bgcolor: "#2A9D8F", color: "white", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
              {t("SendOrder")}
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ width: "500px", 
                    bgcolor: "#2A2A2A", 
                    p: 3, 
                    borderRadius: 2, 
                    color: "white", 
                    marginTop: "25px",
                    border: "2px solid green", 
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
            <Typography variant="h5">{t("OptionDetails")}</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField 
              placeholder="Enter ticker"
              variant="outlined"
              InputLabelProps={{ shrink: false }} 
              sx={{ 
                bgcolor: "#1E1E1E", 
                input: { 
                  color: "white", 
                  padding: "10px 12px" 
                }, 
                "& .MuiOutlinedInput-root": { 
                  height: "40px", 
                  display: "flex", 
                  alignItems: "center" 
                } 
              }}/>

              <Typography sx={{ color: "white", minWidth: "80px" }}>{t("DTERange")}</Typography>
              <TextField 
                type="number"
                variant="outlined" 
                defaultValue={0}
                sx={{ 
                  bgcolor: "#1E1E1E", 
                  input: { color: "white", textAlign: "center" }, 
                  width: "60px", 
                  "& .MuiOutlinedInput-root": { height: "40px" } 
                }} 
              />

              <Typography sx={{ color: "white" }}>{t("to")}</Typography>
              <TextField 
                type="number"
                variant="outlined" 
                defaultValue={32}
                sx={{ 
                  bgcolor: "#1E1E1E", 
                  input: { color: "white", textAlign: "center" }, 
                  width: "60px", 
                  "& .MuiOutlinedInput-root": { height: "40px" } 
                }} 
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
                <Checkbox sx={{ color: "gray", p: 0 }} />
                <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                {t("RequireActiveBid")}
                </Typography>
              </Box>

                <Box sx={{ display: "flex", alignItems: "center",marginLeft:"auto" }}>
                <Checkbox checked={isBAMaxEnabled}
                  onChange={() => setIsBAMaxEnabled((prev) => !prev)}
                  sx={{ color: "gray" }} />
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                  {t("B/AMaxOn/Off")}
                  </Typography>
                  
                  <Typography sx={{ fontSize: "10px", fontStyle: "italic", color: isBAMaxEnabled ? "white" : "gray" }}>
                  {t("B/AMax(e.g 5 = 5%)")}
                  </Typography>
                  </Box>
                  <TextField 
                    placeholder="20"
                    variant="outlined"
                    type="number"
                    disabled={!isBAMaxEnabled}
                    InputLabelProps={{ shrink: false }} 
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      width: "60px",
                      marginLeft:"10px",
                      input: { 
                        color: isBAMaxEnabled ? "white" : "gray",
                        padding: "10px 12px" 
                      }, 
                      "& .MuiOutlinedInput-root": { 
                        height: "40px", 
                        display: "flex", 
                        alignItems: "center",
                        borderColor: "gray",
                        "&:hover": {
                          borderColor: "white",
                    },
                      } 
                    }} 
                  />
                </Box>
              </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ color: "white" }}>{t("MinContractAsk")}</Typography>
              <TextField 
                type="number"
                variant="outlined" 
                defaultValue={1.05}
                sx={{ 
                  bgcolor: "#1E1E1E", 
                  input: { color: "white", textAlign: "center" }, 
                  width: "70px", 
                  "& .MuiOutlinedInput-root": { height: "40px" } 
                }} />
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Checkbox sx={{ color: "gray", p: 0 }} />
                  <Typography sx={{ color: "white" }}>{t("TradeAsSet")}</Typography>
                </Box>
             </Box>
          </Box>
        </Box>

      <Box sx={{width: "500px", 
                bgcolor: "#2A2A2A", 
                p: 3, 
                borderRadius: 2, 
                color: "white", 
                marginTop: "25px",
                border: "2px solid green", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
        <h3>{t("OptionFilter")}</h3>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ color: "white", }}>{t("MinOpenInterest")}</Typography>
                  <TextField 
                    type="number"
                    variant="outlined" 
                    defaultValue={150}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "100px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                  </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "white" }}>{t("MinVolume")}</Typography>
                  <TextField 
                    type="number"
                    variant="outlined" 
                    defaultValue={10}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "100px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                </Box>                   
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}></Box> 
                <Typography sx={{ color: "white" }}>{t("B/ASpreadDiff")}</Typography>
                <TextField 
                      type="number"
                      variant="outlined" 
                      defaultValue={10}
                      sx={{ 
                        bgcolor: "#1E1E1E", 
                        input: { color: "white", textAlign: "center" }, 
                        width: "100px", 
                        "& .MuiOutlinedInput-root": { height: "40px" } 
                      }} 
                    /> 
                </Box>     
            </Box>
            </Box>
          <Box>
            <Box sx={{width: "450px", 
                bgcolor: "#2A2A2A", 
                p: 3, 
                borderRadius: 2, 
                color: "white", 
                height:"670px",
                marginTop: "25px",
                border: "2px solid green", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
          <h3>{t("EntryOrder")}</h3>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ color: "white", }}>{t("TotalDollarAmount")}</Typography>
                  <TextField 
                    variant="outlined" 
                    value={formatNumber(amount)}
                    onChange={handleChangeAmount}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "150px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                  </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "white" }}>{t("OIPercentCap")}</Typography>
                  <TextField 
                    type="number"
                    variant="outlined" 
                    defaultValue={10}
                    sx={{ 
                      bgcolor: "#1E1E1E", 
                      input: { color: "white", textAlign: "center" }, 
                      width: "110px", 
                      "& .MuiOutlinedInput-root": { height: "40px" } 
                    }} 
                  />
                </Box>                   
              </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "white" }}>{t("EntryType")}</Typography>
                  <Select
                    value={entryType}
                    onChange={handleEntryTypeChange}
                    displayEmpty
                    sx={{ width: "170px", height: "40px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
                  >
                    <MenuItem value="Buy_Bid" >{t("Buy_Bid")}</MenuItem>
                    <MenuItem value="Buy_Mid" >{t("Buy_Mid")}</MenuItem>
                    <MenuItem value="Buy_Ask" >{t("Buy_Ask")}</MenuItem>
                  </Select>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                  <Checkbox
                    checked={useLaddering}
                    onChange={() => setUseLaddering(!useLaddering)}
                    disabled={shouldDisableLaddering}
                    sx={{ color: "gray" }}
                  />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontSize: "13px", color: shouldDisableLaddering ? "gray" : "white" }}>
                        {t("UseLaddering")}
                      </Typography>
                      {shouldShowHint && (
                        <Typography sx={{ fontSize: "10px", fontStyle: "italic", color: "gray" }}>
                          {t("OffsetMustBe")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                </Box> 
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop:"20px" }}>
                <Typography sx={{ color: "white", }}>{t("OffsetPercent")}</Typography>
                <TextField
                  type="number"
                  value={offsetPercent}
                  onChange={handleOffsetChange}
                  sx={{
                    bgcolor: "#1E1E1E",
                    input: { color: "white", textAlign: "center" },
                    width: "100px",
                    "& .MuiOutlinedInput-root": { height: "40px" }
                  }}
                />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop:"20px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Checkbox 
                        checked={tradeUnderlyingFound} 
                        onChange={handleTradeUnderlyingFoundChange}
                        disabled={onlyTradeUnderlying}
                        sx={{ color: "gray", p: 0 }} 
                      />
                      <Typography sx={{
                         fontSize: "13px", color: onlyTradeUnderlying && tradeUnderlyingFound ? "gray" : "white", mt: 0.5
                          }}>
                        {t("TradeUnderlyingOptionFound")}
                      </Typography>
                    </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Checkbox 
                          checked={onlyTradeUnderlying} 
                          onChange={handleOnlyTradeUnderlyingChange}
                          sx={{ color: "gray", p: 0 }} 
                        />
                        <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                          {t("OnlyTradeUnderlying")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
                        <Checkbox sx={{ color: "gray", p: 0 }} />
                        <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                        {t("CancelResubmitNoPartialFill")}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start", flexDirection: "row" }}>
                      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        <Checkbox 
                          sx={{ color: "gray", p: 0 }} 
                          checked={isBreakUpEnabled}
                          onChange={() => setIsBreakUpEnabled((prev) => !prev)}
                        />
                        <Typography 
                          sx={{ fontSize: "13px", color: "white", mt: 0.5 }}
                        >
                          {t("BreakUpOrder")}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "15px" }}>
                        <Typography sx={{ fontSize: "13px", color: isBreakUpEnabled ? "white" : "gray", mt: 0.5 }}>
                          {t("OrderBreaks")}
                        </Typography>
                        <TextField 
                          placeholder="20"
                          type="number"
                          variant="outlined"
                          value={breakUp}
                          onChange={handleBreakUpChange}
                          disabled={!isBreakUpEnabled}
                          InputLabelProps={{ shrink: false }} 
                          sx={{ 
                            bgcolor: "#1E1E1E", 
                            width: "60px",
                            marginLeft: "10px",
                            input: { 
                              color: "white", 
                              padding: "10px 12px" 
                            }, 
                            "& .MuiOutlinedInput-root": { 
                              height: "40px", 
                              display: "flex", 
                              alignItems: "center",
                              opacity: isBreakUpEnabled ? 1 : 0.5
                            } 
                          }} 
                        />
                      </Box>
                    </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
                        <Checkbox sx={{ color: "gray", p: 0 }}
                        checked={isSendTriggerChecked}
                        onChange={(e) => setIsSendTriggerChecked(e.target.checked)} />
                        <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                        {t("SendTriggerExitOrder")}
                        </Typography>
                      </Box>
                      
                    </Box>
                  </Box>
              </Box>     
            </Box>
              <Box>
                  <Box sx={{width: "auto", 
                      bgcolor: "#2A2A2A", 
                      p: 3, 
                      borderRadius: 2, 
                      color: "white", 
                      height:"670px",
                      marginTop: "25px",
                      border: "2px solid green", 
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
                <Typography variant="h5">{t("EntryOrder")}</Typography>
                <ExitTierTable isSendTriggerChecked = {isSendTriggerChecked} /> 
                  </Box>
              </Box>
            </Box>
        </Box>
  );
}
