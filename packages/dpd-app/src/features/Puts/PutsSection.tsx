import { useEffect, useState } from "react";
import { Box, Button, Divider, MenuItem, Select, SelectChangeEvent, TextField, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { ExitTier, SubProfile } from "@/models/SubProfile";
import { optionTradeService } from "@/services/optionTradeService";
import { deleteSubProfile, fetchSubProfiles, updateSubProfile } from "@/slices/optionTradeSlice";
import ExitTierTable from "../Calls/ExitTierTable";
import { scanSchwab } from "@/slices/dpdOptionsScanSlice";
import { connectedAccount } from "../strategies/userProfileSlice";

export default function PutOptionSet() {
  const [account, setAccount] = useState<connectedAccount>();
  const [entryType, setEntryType] = useState<string>("Buy_Ask");
  const { t } = useTranslation("CallsSection");
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [isBreakUpEnabled, setIsBreakUpEnabled] = useState(false);
  const [amount, setAmount] = useState(30000);
  const [breakUp, setBreakUp] = useState(3);
  const isBuyAsk = entryType === "Buy_Ask";
  const isOffsetValid = offsetPercent >= 0;
  const shouldDisableLaddering = isBuyAsk && isOffsetValid;
  const shouldShowHint = isBuyAsk && isOffsetValid;
  const [useLaddering, setUseLaddering] = useState(false);
  const [tradeUnderlyingFound, setTradeUnderlyingFound] = useState(false);
  const [onlyTradeUnderlying, setOnlyTradeUnderlying] = useState(false);
  const [isSendTriggerChecked, setIsSendTriggerChecked] = useState(false);
  const [isBAMaxEnabled, setIsBAMaxEnabled] = useState(false);
  const [newSubProfileOpen, setNewSubProfileOpen] = useState(false);
  const [updateSubProfileOpen, setUpdateSubProfileOpen] = useState(false);
  const { connectedAccounts } = useAppSelector(state => state.userProfile);
  const [bidAskMax, setBidAskMax] = useState<number | "">(20);
  const [loading, setLoading] = useState(false);
  const [dteMin, setDteMin] = useState<number>(0);
  const [dteMax, setDteMax] = useState<number>(32);
  const [minContractAsk, setMinContractAsk] = useState<number>(0.05);
  const [cancelAndResubmitOnPartial, setCancelAndResubmitOnPartial] = useState<boolean>(false);
  const [minOpenInterest, setMinOpenInterest] = useState<number>(150);
  const [minVolume, setMinVolume] = useState<number>(10);
  const [oiCapPercent, setOiCapPercent] = useState<number>(500);
  const [requireActiveBid, setRequireActiveBid] = useState<boolean>(false);
  const [ticker, setTicker] = useState<string>("");
  const [tradeAsSet, setTradeAsSet] = useState<boolean>(false);
  const [baSpreadDiff, setBaSpreadDiff] = useState<number>(10);
  const [exitTiers, setExitTiers] = useState<ExitTier[]>([]);
  const [subProfile, setSubProfile] = useState<string>("");
  const dispatch = useAppDispatch();
  const { subProfiles } = useAppSelector((state) => state.optionTrade);
  const [selectedSubProfile, setSelectedSubProfile] = useState<SubProfile | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [isSaveCopyEnabled, setIsSaveCopyEnabled] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setAccount(undefined);
    setEntryType("Buy_Ask");
    setOffsetPercent(0);
    setIsBreakUpEnabled(false);
    setAmount(30000);
    setBreakUp(3);
    setUseLaddering(false);
    setTradeUnderlyingFound(false);
    setOnlyTradeUnderlying(false);
    setIsSendTriggerChecked(false);
    setIsBAMaxEnabled(false);
    setBidAskMax(20);
    setDteMin(0);
    setDteMax(32);
    setMinContractAsk(0.05);
    setCancelAndResubmitOnPartial(false);
    setMinOpenInterest(150);
    setMinVolume(10);
    setOiCapPercent(500);
    setRequireActiveBid(false);
    setTicker("");
    setTradeAsSet(false);
    setBaSpreadDiff(10);
    setExitTiers([]);
    setSubProfile("");
    setSelectedSubProfile(null);
  };

  useEffect(() => {
    dispatch(fetchSubProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSubProfile) {
      const edited = isProfileEdited(selectedSubProfile);
      if (edited) {
        setIsSaveCopyEnabled(true);
        setIsSaveEnabled(true);
        if (selectedSubProfile.exitTiers && selectedSubProfile.exitTiers.length > 0) {
          setIsSendTriggerChecked(true);
        }
        
      } else {
        setIsSaveCopyEnabled(false);
        setIsSaveEnabled(false);
      }
    }
  }, [
    selectedSubProfile,
    cancelAndResubmitOnPartial,
    dteMax,
    dteMin,
    offsetPercent,
    entryType,
    useLaddering,
    minContractAsk,
    minOpenInterest,
    minVolume,
    oiCapPercent,
    onlyTradeUnderlying,
    requireActiveBid,
    isBAMaxEnabled,
    bidAskMax,
    ticker,
    amount,
    tradeUnderlyingFound,
    isBreakUpEnabled,
    breakUp,
    tradeAsSet,
    baSpreadDiff,
    account,
    exitTiers,
  ]);

  useEffect(() => {
    if (selectedSubProfile) {
      setSubProfile(selectedSubProfile.name);
      setCancelAndResubmitOnPartial(selectedSubProfile.cancelAndResubmitOnPartial);
      setDteMax(selectedSubProfile.dteMax);
      setDteMin(selectedSubProfile.dteMin);
      setOffsetPercent(selectedSubProfile.entryOffsetPercent);
      setEntryType(selectedSubProfile.entryType);
      setUseLaddering(selectedSubProfile.useLaddering);
      setMinContractAsk(selectedSubProfile.minContractAsk);
      setMinOpenInterest(selectedSubProfile.minOpenInterest);
      setMinVolume(selectedSubProfile.minVolume);
      setOiCapPercent(selectedSubProfile.oiCapPercent);
      setOnlyTradeUnderlying(selectedSubProfile.onlyTradeUnderlying);
      setRequireActiveBid(selectedSubProfile.requireActiveBid);
      setIsBAMaxEnabled(selectedSubProfile.useBidAskMax);
      setBidAskMax(selectedSubProfile.bidAskMax || 0);
      setTicker(selectedSubProfile.ticker);
      setAmount(selectedSubProfile.totalDollarAmount);
      setTradeUnderlyingFound(selectedSubProfile.tradeUnderlying);
      setIsBreakUpEnabled(selectedSubProfile.breakUpOrder);
      setBreakUp(selectedSubProfile.orderBreaks);
      setTradeAsSet(selectedSubProfile.tradeAsSet);
      setBaSpreadDiff(selectedSubProfile.baSpreadDiff);
      setAccount(selectedSubProfile.account);
      setExitTiers(selectedSubProfile.exitTiers);
    }
  }, [selectedSubProfile]);

  const isProfileEdited = (original: SubProfile | null): boolean => {
    if (!original) return false;
    return (
      original.cancelAndResubmitOnPartial !== cancelAndResubmitOnPartial ||
      original.dteMax !== dteMax ||
      original.dteMin !== dteMin ||
      original.entryOffsetPercent !== offsetPercent ||
      original.entryType !== entryType ||
      original.useLaddering !== useLaddering ||
      original.minContractAsk !== minContractAsk ||
      original.minOpenInterest !== minOpenInterest ||
      original.minVolume !== minVolume ||
      original.oiCapPercent !== oiCapPercent ||
      original.onlyTradeUnderlying !== onlyTradeUnderlying ||
      original.requireActiveBid !== requireActiveBid ||
      original.useBidAskMax !== isBAMaxEnabled ||
      original.bidAskMax !== bidAskMax ||
      original.ticker !== ticker ||
      original.totalDollarAmount !== amount ||
      original.tradeUnderlying !== tradeUnderlyingFound ||
      original.breakUpOrder !== isBreakUpEnabled ||
      original.orderBreaks !== breakUp ||
      original.tradeAsSet !== tradeAsSet ||
      original.baSpreadDiff !== baSpreadDiff ||
      original.account !== account ||
      JSON.stringify(original.exitTiers) !== JSON.stringify(exitTiers)
    );
  };  
  
  const handleExitTiersChange = (newExitTiers: ExitTier[]) => {
    setExitTiers(newExitTiers);
  };

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
  const handleSaveSubProfile = async () => {
    if (!subProfile.trim()) return;

    setLoading(true);
    try {
      const subProfileRequest: SubProfile = {
        name: subProfile,
        cancelAndResubmitOnPartial: cancelAndResubmitOnPartial, 
        dteMax: dteMax, 
        dteMin: dteMin, 
        entryOffsetPercent: offsetPercent,
        entryType: entryType,
        useLaddering: useLaddering, 
        maxDelta: 0,
        minContractAsk: minContractAsk,
        minDelta: 0, 
        minOpenInterest: minOpenInterest,
        minVolume: minVolume, 
        oiCapPercent: oiCapPercent,
        onlyTradeUnderlying: onlyTradeUnderlying,
        optionType: "PUT",
        requireActiveBid: requireActiveBid,
        useBidAskMax: isBAMaxEnabled,
        bidAskMax: bidAskMax? bidAskMax : 0,
        ticker: ticker,
        totalDollarAmount: amount,
        tradeUnderlying: tradeUnderlyingFound,
        breakUpOrder: isBreakUpEnabled,
        orderBreaks: breakUp,
        tradeAsSet: tradeAsSet,
        baSpreadDiff: baSpreadDiff,
        account: account,
        exitTiers: isSendTriggerChecked ? exitTiers : [],
      };

      await optionTradeService.createSubProfile(subProfileRequest );
      dispatch(fetchSubProfiles());
      handleClickNewSubProfileClose();
    } catch (error) {
      console.error("Error creating sub-profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
    setBidAskMax(newValue);
  };

  const handleEnableToggle = () => {
    if (isBAMaxEnabled && bidAskMax === "") {
      setBidAskMax(20);
    }
  };

  const handleBreakUpChange = (event) => {
    const newValue = event.target.value === "" ? breakUp : parseFloat(event.target.value);
  
    if (newValue >= 0) {
      setBreakUp(newValue);
    }
  };
  
  const handleDeleteSubProfile = (profileName: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>,) => {
    event.stopPropagation();
    setProfileToDelete(profileName);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete) {
      try {
        await dispatch(deleteSubProfile(profileToDelete));
        dispatch(fetchSubProfiles());
        resetForm();
      } catch (error) {
        console.error("Failed to delete subProfile:", error);
      } finally {
        setConfirmOpen(false);
        setProfileToDelete(null);
      }
    }
  };

  const handleConfirmUpdate = async () => {
    if (!subProfile.trim()) return;

    setLoading(true);
    try {
      const subProfileRequest: SubProfile = {
        name: subProfile,
        cancelAndResubmitOnPartial: cancelAndResubmitOnPartial, 
        dteMax: dteMax, 
        dteMin: dteMin, 
        entryOffsetPercent: offsetPercent,
        entryType: entryType,
        useLaddering: useLaddering, 
        maxDelta: 0,
        minContractAsk: minContractAsk,
        minDelta: 0, 
        minOpenInterest: minOpenInterest,
        minVolume: minVolume, 
        oiCapPercent: oiCapPercent,
        onlyTradeUnderlying: onlyTradeUnderlying,
        optionType: "PUT",
        requireActiveBid: requireActiveBid,
        useBidAskMax: isBAMaxEnabled,
        bidAskMax: bidAskMax? bidAskMax : 0,
        ticker: ticker,
        totalDollarAmount: amount,
        tradeUnderlying: tradeUnderlyingFound,
        breakUpOrder: isBreakUpEnabled,
        orderBreaks: breakUp,
        tradeAsSet: tradeAsSet,
        baSpreadDiff: baSpreadDiff,
        account: account,
        exitTiers: isSendTriggerChecked ? exitTiers : [],
      };

      await dispatch(updateSubProfile(subProfileRequest));
      await dispatch(fetchSubProfiles()); 
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`${t("UpdatingError")}: ${message}`);
    } finally {
      setUpdateSubProfileOpen(false);
    }
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

   const handleSendOrder = async () => {
      try {
        const subProfileRequest: SubProfile = {
          name: subProfile,
          cancelAndResubmitOnPartial: cancelAndResubmitOnPartial, 
          dteMax: dteMax, 
          dteMin: dteMin, 
          entryOffsetPercent: offsetPercent,
          entryType: entryType,
          useLaddering: useLaddering, 
          maxDelta: 0,
          minContractAsk: minContractAsk,
          minDelta: 0, 
          minOpenInterest: minOpenInterest,
          minVolume: minVolume, 
          oiCapPercent: oiCapPercent,
          onlyTradeUnderlying: onlyTradeUnderlying,
          optionType: "PUT",
          requireActiveBid: requireActiveBid,
          useBidAskMax: isBAMaxEnabled,
          bidAskMax: bidAskMax ? bidAskMax : 0,
          ticker: ticker,
          totalDollarAmount: amount,
          tradeUnderlying: tradeUnderlyingFound,
          breakUpOrder: isBreakUpEnabled,
          orderBreaks: breakUp,
          tradeAsSet: tradeAsSet,
          baSpreadDiff: baSpreadDiff,
          account: account,
          exitTiers: isSendTriggerChecked ? exitTiers : [],
        };
  
        const response = await dispatch(scanSchwab(subProfileRequest)).unwrap();
      } catch (error) {
        console.error("Error sending order:", error);
      }
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
  const handleSelectSubProfile = (event: SelectChangeEvent) => {
    const selectedName = event.target.value;
    setSubProfile(selectedName);
    const profile = subProfiles.find((profile) => profile.name === selectedName);
    setSelectedSubProfile(profile || null);
  }

  const handleClickNewSubProfileClose = () => {
    setNewSubProfileOpen(false);
    setSubProfile("");
  }

  const handleClickNewSubProfileOpen = () => {
    setNewSubProfileOpen(true);
  }

  const handleClickUpdateSubProfileOpen = () => {
    setUpdateSubProfileOpen(true);
  }

  const handleAccountChange = (event: SelectChangeEvent) => {
      const selectedAccountNumber = event.target.value;
      const selectedAccount = connectedAccounts.find(acc => acc.accountNumber === selectedAccountNumber);
      setAccount(selectedAccount);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", p: 1.2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        {t("PutOptionSet")}
      </Typography>

      <Divider sx={{ mb: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />

      <Box sx={{ display: "flex", gap: 1.8, alignItems: "center", marginTop: "45px" }}>
        <Select
          value={account?.accountNumber ||""}
          onChange={handleAccountChange}
          displayEmpty
          sx={{ width: "200px", height: "40px", bgcolor: "gray", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}
        >
          <MenuItem value="" disabled>{t("Account")}</MenuItem>
          {
            connectedAccounts.map(acc => (<MenuItem value={acc.accountNumber} key={acc.accountNumber}>{acc.accountNumber}</MenuItem>))
          }
        </Select>

        <Select
          value={subProfile}
          onChange={handleSelectSubProfile}
          displayEmpty
          sx={{
            width: "300px",
            height: "40px",
            bgcolor: "#E27F78",
            color: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          }}
          renderValue={() => {
            return subProfile || t("SelectSub-Profile");
          }}
        >
          <MenuItem value="" disabled>
            {t("SelectSub-Profile")}
          </MenuItem>

          {subProfiles
            .filter((profile) => profile.optionType === "PUT")
            .map((profile) => (
              <MenuItem
                key={profile.account?.accountNumber}
                value={profile.name}
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography>{profile.name}</Typography>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={(e) => handleDeleteSubProfile(profile.name, e)}
                >
                  {t("Delete", { ns: "Common" })}
                </Button>
              </MenuItem>
            ))}
        </Select>

        <Button
        variant="contained"
        onClick={handleClickNewSubProfileOpen}
        sx={{
          height: "40px",
          bgcolor: "#E27F78",
          color: "white",
          textTransform: "none",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          minWidth: "150px",
          maxWidth: "100%",
        }}>
        {t("CreateNewSub-Profile")}
      </Button>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle> {t("PleaseConfirmDelete", { name: profileToDelete })}</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained">
            {t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateSubProfileOpen} onClose={() => setUpdateSubProfileOpen(false)}>
        <DialogTitle> {t("PleaseConfirmUpdate", { name: selectedSubProfile?.name })}</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={() => setUpdateSubProfileOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button onClick={handleConfirmUpdate} variant="contained">
            {t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newSubProfileOpen} onClose={handleClickNewSubProfileClose} fullWidth maxWidth="xs">
        <DialogTitle>{t("SaveSubProfileName")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            value={subProfile}
            onChange={(e) => setSubProfile(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ bgcolor: "gray", color: "white" }} onClick={handleClickNewSubProfileClose}>
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            disabled={!subProfile.trim()}
            onClick={handleSaveSubProfile}
          >
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>

        <Button variant="outlined" disabled={!isSaveEnabled}
        onClick={handleClickUpdateSubProfileOpen}
          sx={{
            height: "40px", bgcolor: isSaveEnabled ? "#E27F78" : "gray",
            color: "white", textTransform: "none", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
          {t("Save")}
        </Button>
        <Button variant="outlined" disabled={!isSaveCopyEnabled}
          onClick={handleClickNewSubProfileOpen}
          sx={{
            bgcolor: isSaveCopyEnabled ? "#E27F78" : "gray",
            height: "40px", color: "white", 
            textTransform: "none", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
          {t("SaveCopy")}
        </Button>
      </Box>

      <Divider sx={{ my: 4, width: "100vw", left: 0, position: "absolute", top: "auto" }} />

      <Box sx={{ display: "flex", marginTop: "50px" }}>
        <Button variant="outlined"
          sx={{
            height: "40px", bgcolor: "#E27F78", color: "white", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}
          onClick={handleSendOrder}>
          {t("SendOrder")}
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{
            width: "500px",
            bgcolor: "#2A2A2A",
            p: 3,
            borderRadius: 2,
            color: "white",
            marginTop: "25px",
            border: "2px solid rgb(143, 23, 15)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>{t("OptionDetails")}</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                placeholder="Enter ticker"
                variant="outlined"
                name="tickerInput"
                autoComplete="off"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                inputProps={{
                  autoComplete: "off",
                }}
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
                }}
              />
                <Typography sx={{ color: "white", minWidth: "80px" }}>{t("DTERange")}</Typography>
                <TextField
                  type="number"
                  variant="outlined"
                  value={dteMin}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= 0 && newValue < dteMax) {
                      setDteMin(newValue);
                    }
                  }}
                  sx={{
                    bgcolor: "#1E1E1E",
                    input: { color: "white", textAlign: "center", padding: "10px 12px", },
                    width: "75px",
                    "& .MuiOutlinedInput-root": { height: "40px" },
                  }}
                />

                <Typography sx={{ color: "white" }}>{t("to")}</Typography>
                <TextField
                  type="number"
                  variant="outlined"
                  value={dteMax}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= 0 && newValue > dteMin) {
                      setDteMax(newValue);
                    }
                  }}
                  sx={{
                    bgcolor: "#1E1E1E",
                    input: { color: "white", textAlign: "center", padding: "10px 12px", },
                    width: "75px",
                    "& .MuiOutlinedInput-root": { height: "40px" },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
                <Checkbox
                  checked={requireActiveBid}
                  onChange={(e) => setRequireActiveBid(e.target.checked)}
                  sx={{ color: "gray", p: 0 }}
                />
                <Typography sx={{ fontSize: "13px", color: "white", mt: 0.5 }}>
                    {t("RequireActiveBid")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
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
                    variant="outlined"
                    type="number"
                    value={bidAskMax}
                    onChange={handleChange}
                    disabled={!isBAMaxEnabled}
                    inputProps={{ min: 1, step: 1 }}
                    onFocus={handleEnableToggle}
                    sx={{
                      bgcolor: "#1E1E1E",
                      width: "67px",
                      marginLeft: "10px",
                      input: {
                        color: isBAMaxEnabled ? "white" : "gray",
                        padding: "10px 12px",
                        textAlign: "center",  
                      },
                      "& .MuiOutlinedInput-root.Mui-disabled": {
                        "& .MuiInputBase-input": {
                          color: "gray !important",
                          WebkitTextFillColor: "gray !important",
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        borderColor: "gray",
                        "&:hover": {
                          borderColor: "white",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ color: "white" }}>{t("MinContractAsk")}</Typography>
              <TextField
                type="number"
                variant="outlined"
                value={minContractAsk}
                onChange={(e) => setMinContractAsk(Number(e.target.value))}
                inputProps={{ step: 0.01 }}
                sx={{
                  bgcolor: "#1E1E1E",
                  input: { color: "white", textAlign: "center" },
                  width: "70px",
                  "& .MuiOutlinedInput-root": { height: "40px" },
                }}
              />
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Checkbox
                  checked={tradeAsSet}
                  onChange={(e) => setTradeAsSet(e.target.checked)}
                  sx={{ color: "gray", p: 0 }}
                />
                  <Typography sx={{ color: "white" }}>{t("TradeAsSet")}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{
            width: "500px",
            bgcolor: "#2A2A2A",
            p: 3,
            borderRadius: 2,
            color: "white",
            marginTop: "25px",
            border: "2px solid rgb(143, 23, 15)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>{t("OptionFilter")}</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "white", }}>{t("MinOpenInterest")}</Typography>
                  <TextField
                    type="number"
                    variant="outlined"
                    value={minOpenInterest}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      if (newValue >= 0) {
                        setMinOpenInterest(newValue);
                      }
                    }}
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
                  value={minVolume}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= 0) {
                      setMinVolume(newValue);
                    }
                  }}
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
                value={baSpreadDiff}
                onChange={(e) => setBaSpreadDiff(Number(e.target.value))}
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
          <Box sx={{
            width: "450px",
            bgcolor: "#2A2A2A",
            p: 3,
            borderRadius: 2,
            color: "white",
            height: "670px",
            marginTop: "25px",
            border: "2px solid rgb(143, 23, 15)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>{t("EntryOrder")}</Typography>
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
                  value={oiCapPercent}
                  onChange={(e) => setOiCapPercent(Number(e.target.value))}
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
                    sx={{
                      width: "170px",
                      height: "40px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                      color: "white",
                      "& .MuiSelect-icon": { color: "#fff",},
                    }}
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
                    sx={{
                      color: "gray",
                      "&.Mui-checked": {
                        color: "gray", 
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255, 255, 255, 0.33)", 
                      },
                    }}
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "20px" }}>
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: "20px" }}>
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
                <Checkbox
                  checked={cancelAndResubmitOnPartial}
                  onChange={(e) => setCancelAndResubmitOnPartial(e.target.checked)}
                  sx={{ color: "gray", p: 0 }}
                />
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
                        width: "70px",
                        marginLeft: "10px",
                        input: {
                          color: "white",
                          padding: "10px 12px",
                          textAlign: "center",
                        },
                        "& .MuiOutlinedInput-root.Mui-disabled": {
                          "& .MuiInputBase-input": {
                            color: "#bbb !important",
                            WebkitTextFillColor: "#bbb !important",
                          },
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
          <Box sx={{
            width: "auto",
            bgcolor: "#2A2A2A",
            p: 3,
            borderRadius: 2,
            color: "white",
            height: "670px",
            marginTop: "25px",
            border: "2px solid rgb(143, 23, 15)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
            <Typography variant="h5" sx={{ marginBottom: "10px" }}>{t("ExitTiers")}</Typography>
            <ExitTierTable
              isSendTriggerChecked={isSendTriggerChecked}
              onExitTiersChange={handleExitTiersChange}
              exitTiers={selectedSubProfile?.exitTiers}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
