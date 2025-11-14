import { useEffect, useState } from "react";
import { Box, Button, Divider, MenuItem, Select, SelectChangeEvent, TextField, Checkbox, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";
import { ExitTier, SubProfile } from "@/models/SubProfile";
import { optionTradeService } from "@/services/optionTradeService";
import { deleteSubProfile, fetchSubProfiles, updateSubProfile } from "@/slices/optionTradeSlice";
import ExitTierTable from "../Calls/ExitTierTable";
import { Instrument, scanSchwab, SubProfiles } from "@/slices/dpdOptionsScanSlice";
import { connectedAccount } from "../strategies/userProfileSlice";
import OptionSettingsForm from "../OptionSettingsForm";
import { mapEntryTypeStringToEnum } from "@/common/mapEntryTypeStringToEnum";
import SchwabConnectButton from "@/common/SchwabConnectButton";
import { addError, addMessage } from "components";
import { monitorStrategyStatus } from "@/services/strategyMonitorService";

export default function StraddleOptionSet() {
  const [account, setAccount] = useState<connectedAccount>();
  const [entryType, setEntryType] = useState<string>("USE_ASK");
  const { t } = useTranslation("CallsSection");
  const [offsetPercent, setOffsetPercent] = useState(0);
  const [isBreakUpEnabled, setIsBreakUpEnabled] = useState(false);
  const [amount, setAmount] = useState(30000);
  const [breakUp, setBreakUp] = useState(3);
  const isBuyAsk = entryType === "USE_ASK";
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

  const buildInstrument = (symbol: string): Instrument | null =>
    symbol.trim()
      ? {
          symbol: symbol.trim().toUpperCase(),
          cusip: "",
          description: "",
          exchange: "",
          assetType: "",
        }
      : null;

  const resetForm = () => {
    setAccount(undefined);
          setEntryType("USE_ASK");
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
    minContractAsk,
    minVolume,
    requireActiveBid,
    isBAMaxEnabled,
    bidAskMax,
    ticker,
    amount,
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
      setTicker(selectedSubProfile.instruments?.symbol ?? "");
      setAmount(selectedSubProfile.totalDollarAmount);
      setTradeUnderlyingFound(selectedSubProfile.tradeUnderlying);
      setIsBreakUpEnabled(selectedSubProfile.breakUpOrder);
      setBreakUp(selectedSubProfile.orderBreaks);
      setTradeAsSet(selectedSubProfile.tradeAsSet);
      setBaSpreadDiff(selectedSubProfile.baSpreadDiff);
      const account = connectedAccounts.find(s => s.accountNumber === selectedSubProfile.account);
      setAccount(account);
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
      (original.instruments?.symbol || "") !== ticker ||
      original.totalDollarAmount !== amount ||
      original.tradeUnderlying !== tradeUnderlyingFound ||
      original.breakUpOrder !== isBreakUpEnabled ||
      original.orderBreaks !== breakUp ||
      original.tradeAsSet !== tradeAsSet ||
      original.baSpreadDiff !== baSpreadDiff ||
      original.account !== account?.accountNumber ||
      JSON.stringify(original.exitTiers) !== JSON.stringify(exitTiers)
    );
  };  
  
  const handleExitTiersChange = (newExitTiers: ExitTier[]) => {
    setExitTiers(newExitTiers);
  };

  const handleEntryTypeChange = (event) => {
    const newEntryType = event.target.value;
    setEntryType(newEntryType);

    if (newEntryType === "USE_ASK" && offsetPercent >= 0) {
      setUseLaddering(false);
    }
  };

  const handleOffsetChange = (event) => {
    const newOffset = event.target.value === "" ? offsetPercent : parseFloat(event.target.value);
    setOffsetPercent(newOffset);

    if (entryType === "USE_ASK" && newOffset >= 0) {
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
        optionType: "STRADDLE",
        requireActiveBid: requireActiveBid,
        useBidAskMax: isBAMaxEnabled,
        bidAskMax: bidAskMax? bidAskMax : 0,
        instruments: buildInstrument(ticker),
        ticker,
        totalDollarAmount: amount,
        tradeUnderlying: tradeUnderlyingFound,
        breakUpOrder: isBreakUpEnabled,
        orderBreaks: breakUp,
        tradeAsSet: tradeAsSet,
        baSpreadDiff: baSpreadDiff,
        account: account?.accountNumber || "",
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
        optionType: "STRADDLE",
        requireActiveBid: requireActiveBid,
        useBidAskMax: isBAMaxEnabled,
        bidAskMax: bidAskMax? bidAskMax : 0,
        instruments: buildInstrument(ticker),
        ticker,
        totalDollarAmount: amount,
        tradeUnderlying: tradeUnderlyingFound,
        breakUpOrder: isBreakUpEnabled,
        orderBreaks: breakUp,
        tradeAsSet: tradeAsSet,
        baSpreadDiff: baSpreadDiff,
        account: account?.accountNumber || "",
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

  const handleSendOrder = async (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
    
        if (!account || !ticker.trim()) {
          return; 
        }
      try {
        const entryTypeEnum = mapEntryTypeStringToEnum(entryType);
  
        const subProfileRequest: SubProfiles = {
          accountNumber: account.accountNumber,
          state: 0,
          strategySettings: {
            cancelAndResubmitOnPartial,
            dteMin,
            dteMax,
            entryOffsetPercent: offsetPercent,
            entryType: entryTypeEnum,
            exitTiers: isSendTriggerChecked ? exitTiers : [],
            maxDelta: 0,
            minContractAsk,
            minDelta: 0,
            minOpenInterest,
            minVolume,
            baSpreadDiff,
            oiCapPercent,
            optionType: "STRADDLE",
            requireActiveBid,
            ticker,
            totalDollarAmount: amount,
            tradeUnderlying: tradeUnderlyingFound,
            onlyTradeUnderlying,
            breakUpOrder: isBreakUpEnabled,
            orderBreaks: breakUp,
            tradeAsSet,
            instrument: buildInstrument(ticker)
          },
        };
  
        const response = await dispatch(scanSchwab(subProfileRequest)).unwrap();
        
        if (response && response.strategyId) {
          monitorStrategyStatus(
            account.accountNumber,
            response.strategyId,
            (status) => {
              dispatch(addMessage({ message: `Strategy state: ${status.state}` }));
            },
            (errorMsg) => {
              dispatch(addError({ message: errorMsg }));
            }
          );
        }
      } catch (error: any) {
        console.error("Error sending order:", error);
        
        if (error.status === 400) {
          dispatch(addError({ message: "Error submitting set!" }));
        } else {
          dispatch(addError({ message: error.message || "Failed to send order" }));
        }
      }
    };

  const handleAccountChange = (event: SelectChangeEvent) => {
        const selectedAccountNumber = event.target.value;
        const selectedAccount = connectedAccounts.find(acc => acc.accountNumber === selectedAccountNumber);
        setAccount(selectedAccount);
    };

  return (
    <Box sx={{ width: "100%", minHeight: "100%", bgcolor: "background.default", p: 1.2 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        {t("StraddleOptionSet")}
      </Typography>

      <Divider sx={{ mb: 4, width: "100%", left: 0, top: "auto" }} />

      <Box sx={{ display: "flex", gap: 1.8, alignItems: "center", marginTop: "45px" }}>
        <Select
          value={account?.accountNumber || ""}
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
            bgcolor: "#b8860b",
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
            .filter((profile) => profile.optionType === "STRADDLE")
            .map((profile) => (
              <MenuItem
                key={profile.account}
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
          bgcolor: "#b8860b",
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
            height: "40px", bgcolor: isSaveEnabled ? "#b8860b" : "gray",
            color: "white", textTransform: "none", 
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
          {t("Save")}
        </Button>
        <Button variant="outlined" disabled={!isSaveCopyEnabled}
          onClick={handleClickNewSubProfileOpen}
          sx={{
            bgcolor: isSaveCopyEnabled ? "#b8860b" : "gray",
            height: "40px", color: "white", 
            textTransform: "none", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
          }}>
          {t("SaveCopy")}
        </Button>
      </Box>

      <Divider sx={{ my: 4, width: "100%", left: 0, top: "auto" }} />

      <Box sx={{ display: "flex",
          alignItems: "center",
          marginTop: "50px", }}>
        <Tooltip
          title={t("AccountMustBeSelected")}
          placement="right"
          arrow
          open={!account}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 8],
                },
              },
            ],
          }}
        >
          <Box>
            <Button
              variant="outlined"
              sx={{
                height: "40px",
                bgcolor: account ? "#b8860b" : "rgba(255, 255, 255, 0.3)",
                color: "white",
                boxShadow: account ? "0px 4px 10px rgba(0, 0, 0, 0.5)" : "none",
                cursor: account ? "pointer" : "not-allowed",
              }}
              onClick={handleSendOrder}
              disabled={!account || !ticker}
            >
              {t("SendOrder")}
            </Button>
          </Box>
        </Tooltip>

        {connectedAccounts.length === 0 && (
          <Box sx={{ marginLeft: !account ? "200px" : "5px" }}>
            <SchwabConnectButton />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <OptionSettingsForm
          ticker={ticker}
          setTicker={setTicker}
          dteMin={dteMin}
          setDteMin={setDteMin}
          dteMax={dteMax}
          setDteMax={setDteMax}
          requireActiveBid={requireActiveBid}
          setRequireActiveBid={setRequireActiveBid}
          isBAMaxEnabled={isBAMaxEnabled}
          setIsBAMaxEnabled={setIsBAMaxEnabled}
          bidAskMax={bidAskMax}
          handleChange={handleChange}
          handleEnableToggle={handleEnableToggle}
          minContractAsk={minContractAsk}
          setMinContractAsk={setMinContractAsk}
          tradeAsSet={tradeAsSet}
          setTradeAsSet={setTradeAsSet}
          minOpenInterest={minOpenInterest}
          setMinOpenInterest={setMinOpenInterest}
          minVolume={minVolume}
          setMinVolume={setMinVolume}
          baSpreadDiff={baSpreadDiff}
          setBaSpreadDiff={setBaSpreadDiff}
          borderColor="#ffd700"
          t={t}
          onSubmit={handleSendOrder}
        />
        <Box>
          <Box sx={{
            width: "auto",
            bgcolor: "#2A2A2A",
            minHeight: "594px",
            p: 3,
            borderRadius: 2,
            color: "white",
            marginTop: "25px",
            border: "2px solid #ffd700",
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
                  disabled={true}
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
                    <MenuItem value="USE_BID" >{t("Use_Bid")}</MenuItem>
                    <MenuItem value="USE_MID" >{t("Use_Mid")}</MenuItem>
                    <MenuItem value="USE_ASK" >{t("Use_Ask")}</MenuItem>
                  </Select>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                  <Checkbox
                    checked={useLaddering}
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
                    disabled={true}
                    sx={{ color: "gray", p: 0 }}
                  />
                  <Typography sx={{
                    fontSize: "13px", color: "gray", mt: 0.5
                  }}>
                    {t("TradeUnderlyingOptionFound")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={onlyTradeUnderlying}
                    disabled={true}
                    sx={{ color: "gray", p: 0 }}
                  />
                  <Typography sx={{ fontSize: "13px", color: "gray", mt: 0.5 }}>
                    {t("OnlyTradeUnderlying")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-start" }}>
                <Checkbox
                  checked={cancelAndResubmitOnPartial}
                  disabled={true}
                  sx={{ color: "gray", p: 0 }}
                />
                  <Typography sx={{ fontSize: "13px", color: "gray", mt: 0.5 }}>
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
            height: "594px",
            marginTop: "25px",
            border: "2px solid #ffd700",
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
