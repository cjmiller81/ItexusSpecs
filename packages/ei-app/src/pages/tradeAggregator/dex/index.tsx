import { CurrentPositionSection } from "@/features/tradeAggregator/CurrentPositionSection";
import { NewPositionSection } from "@/features/tradeAggregator/NewPositionSection";
import { Wallet } from "@/models/Wallet/Wallet";
import { WalletBalance } from "@/models/Wallet/WalletBalance";
import { enrichTokenPositions, EnrichedTokenPosition } from "../../../../../components/src/utils/enrichTokenPositions";
import { getLifiToken } from "../../../features/tradeAggregator/lifiApi";
import { useLifiChainMap } from "@/common/lifiChainContext";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import { PageAccessGuard } from "@/components/PageAccessGuard";
import { useTranslation } from "react-i18next";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { AnimatedStartTourButton } from "../../../components/AnimatedStartTourButton";
import { updateTourStatusAsync, fetchReactourSettingsAsync } from "components";
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store";

const TOUR_ID = "dex_aggregator_v1";
const TOUR_NAME = "dex_aggregator";

const StartTourButton = () => {
  return (
    <AnimatedStartTourButton 
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
    />
  );
};

const TourStateSync = ({ totalSteps }: { totalSteps: number }) => {
  const { setIsOpen, isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const reactourSettings = useAppSelector((state) => state.reactour.settings);

  useEffect(() => {
    const loadTourData = async () => {
      try {
        await dispatch(fetchReactourSettingsAsync()).unwrap();
      } catch (error) {
        console.error('Failed to fetch tour settings:', error);
      }
    };
    loadTourData();
  }, [dispatch]);

  useEffect(() => {
    if (!reactourSettings?.tours) return;
    
    const viewed = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_VIEWED`] === 1;
    
    if (!viewed && !isOpen && !tourWasOpened) {
      const stepFromDb = reactourSettings.tours[`EI_TOUR_${TOUR_ID}_STEP`] || 0;
      if (!isNaN(stepFromDb)) setCurrentStep(stepFromDb);
      setIsOpen(true);
    }
  }, [reactourSettings, isOpen, tourWasOpened, setCurrentStep, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    dispatch(updateTourStatusAsync({
      tourName: TOUR_NAME,
      update: { 
        step: currentStep,
        viewed: currentStep >= totalSteps - 1 ? true : undefined
      }
    }));
  }, [currentStep, totalSteps, isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen && tourWasOpened) {
      dispatch(updateTourStatusAsync({
        tourName: TOUR_NAME,
        update: { viewed: true }
      }));
    } else if (isOpen) {
      setTourWasOpened(true);
    }
  }, [isOpen, tourWasOpened, dispatch]);
  
  return null;
};

export default function Dex() {
  const { lifiChainMap } = useLifiChainMap();
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { t } = useTranslation("IndexModelingSection");
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [selectedChain, setSelectedChain] = useState<string | null>(null);
    const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
    const [filteredRows, setFilteredRows] = useState<WalletBalance[]>([]);
    const [selectedTokenRow, setSelectedTokenRow] = useState<EnrichedTokenPosition | null>(null);

    const steps: StepType[] = [
      {
        selector: "#dex_header",
        content: () => (
          <Box sx={{ color: "#1a1a1a" }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("DexAggregatorTourSectionTitle")}</Typography>
            <Typography sx={{ color: "#4a5568" }}>{t("DexAggregatorTourSectionText")}</Typography>
          </Box>
        ),
        position: "bottom"
      },
      {
        selector: "#wallet_dropdown",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourWalletChoiceText")}</Typography>
        ),
        position: "bottom"
      },
      {
        selector: "#manual_position_btn",
        content: () => (
          <Typography sx={{ color: "#1a1a1a" }}>{t("DexAggregatorTourManualPositionText")}</Typography>
        ),
        position: "right"
      },
      {
        selector: "#token_list",
        content: () => (
          <Typography sx={{ color: "#1a1a1a", whiteSpace: 'pre-line' }}>{t("DexAggregatorTourTokenTradeText")}</Typography>
        ),
        position: "right"
      }
    ];

    const handleSelectedTokenChange = (tokenInfo: any, chainInfo: any) => {
      setSelectedToken(tokenInfo || null);
      setSelectedChain(chainInfo?.name || chainInfo || null);
      setSelectedChainId(chainInfo?.id || null);
      
      if (!tokenInfo) {
        setSelectedTokenRow(null);
      }
    };

    const clearSelectedTokenAndChain = () => {
      setSelectedToken(null);
      setSelectedChain(null);
      setSelectedChainId(null);
      setSelectedTokenRow(null);
    };


    // When a token row is selected, fetch its address from /api/lifi/token and update selectedTokenRow
    const handleSelectedTokenRowChange = React.useCallback(async (tokenRow: WalletBalance | null) => {
      if (tokenRow && tokenRow.chainId !== undefined && lifiChainMap) {
        try {
          // Find the chain directly by ID from the map to avoid brittle name mapping
          const lifiChain = lifiChainMap.get(tokenRow.chainId);
          const [enriched] = enrichTokenPositions([tokenRow], lifiChainMap);
          
          if (!enriched || !lifiChain) {
            setSelectedTokenRow(null);
            return;
          }

          // Use the cached chain list to find the address. No more singular requests.
          const lifiToken = await getLifiToken(enriched.chainId, enriched.tokenName || '');
          
          // Combine data: priority to LiFi metadata (address, logo, etc.) but keep our balance/etc.
          setSelectedTokenRow({ 
            ...enriched, 
            chain: tokenRow.chain, // keep original display name
            tokenAddress: lifiToken?.address || enriched.tokenAddress,
            lifiChain: enriched.lifiChain,
            decimals: lifiToken?.decimals || enriched.decimals
          });
        } catch (e) {
          console.error("Error enriching token row:", e);
          setSelectedTokenRow(null);
        }
      } else {
        setSelectedTokenRow(null);
      }
    }, [lifiChainMap]);

    const handleWalletChange = (newWallet: Wallet | null) => {
        setSelectedWallet(newWallet);
        clearSelectedTokenAndChain();
      };


    // Synchronize selectedTokenRow with selectedToken/selectedChain dropdowns
    useEffect(() => {
      // CRITICAL: Only sync if we have a complete selection (symbol AND chainId)
      // This prevents partial updates from snapping the selection to Ethereum (Row 1)
      if (!selectedToken || !selectedChainId || !lifiChainMap) return;

        // If we are in the middle of clearing, don't try to restore
        if (selectedToken === null || selectedChain === null) return;

        const isMatch = selectedTokenRow && 
          selectedTokenRow.tokenName?.toLowerCase() === selectedToken.toLowerCase() &&
          (selectedChainId ? selectedTokenRow.chainId === selectedChainId : selectedTokenRow.chain?.toLowerCase() === selectedChain.toLowerCase());
          
        if (!isMatch) {
          const matchingRow = filteredRows.find(
            row => row.tokenName?.toLowerCase() === selectedToken.toLowerCase() && 
            (selectedChainId ? row.chainId === selectedChainId : row.chain?.toLowerCase() === selectedChain.toLowerCase())
          );
          if (matchingRow) {
            handleSelectedTokenRowChange(matchingRow);
          } else {
            // Create a virtual row for tokens not in the user's portfolio
            const virtualRow: any = {
              tokenName: selectedToken,
              chain: selectedChain,
              chainId: selectedChainId,
              balance: 0,
            };
            handleSelectedTokenRowChange(virtualRow);
          }
        }
    }, [selectedToken, selectedChain, selectedChainId, lifiChainMap, selectedWallet, filteredRows, handleSelectedTokenRowChange, selectedTokenRow]);
    
  return (
    <PageAccessGuard requiredPage="/tradeAggregator/dex">
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ 
          ...base, 
          borderRadius: 12, 
          padding: 16, 
          background: "#f7f5f2", 
          color: "#6b7280",
          fontSize: "0.95rem",
          lineHeight: 1.8
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        close: (base) => ({
          ...base,
          width: 14,
          height: 14,
          padding: '10px',
          boxSizing: 'content-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 10,
          right: 8,
          cursor: 'pointer',
        }),
      }}
      showBadge={false}
      components={{
        Content: (props: any) => {
          const step = steps[props.currentStep];
          // @ts-ignore - content() signature varies
          const content = typeof step?.content === 'function' ? step.content() : step?.content;
          
          return (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                <Box sx={{
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', 
                  color: '#fff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: "-2px"
                }}>
                  {(props.currentStep ?? 0) + 1}
                </Box>
                <Box sx={{ flex: 1, color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  {content || null}
                </Box>
              </Box>
            </Box>
          );
        },
        Navigation: ({ setCurrentStep, currentStep, steps, setIsOpen }) => (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: steps?.length || 0 }).map((_, i) => (
                <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: i <= currentStep ? '#3b82f6' : '#e2e8f0' }} />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {currentStep > 0 && (
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  sx={{ 
                    background: '#f7f5f2', 
                    color: '#4a5568', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: 'none', 
                    textTransform: 'none',
                    '&:hover': { background: '#f0ece5', boxShadow: 'none' } 
                  }}
                >
                  Prior
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  if (currentStep === (steps?.length || 0) - 1) {
                    setIsOpen(false);
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                sx={{ background: 'linear-gradient(45deg,#3b82f6,#06b6d4)', color: '#fff', boxShadow: 'none', textTransform: 'none' }}
              >
                {currentStep === (steps?.length || 0) - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <Box sx={{ padding: 2 }}>
          <Box display="flex" alignItems="center" sx={{marginBottom: "15px"}}>
            <Typography
              variant="h4"
              component="div"
              sx={{fontWeight: "bold" }}
              id="dex_header"
            >
              {t("TradeAggregatorDex")}
            </Typography>
            <StartTourButton />
          </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: "14px", marginBottom: 1 }}
            >
              {t("CurrentPosition")}
            </Typography>
            <CurrentPositionSection onWalletChange={handleWalletChange} selectedToken={selectedToken}
              selectedChainNewPosition={selectedChain}
              selectedChainId={selectedChainId}
              onFilteredRowsChange={setFilteredRows}
              onTokenChange={handleSelectedTokenRowChange}
              onClearTokenAndChain={clearSelectedTokenAndChain}/>
          </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: "14px", marginBottom: 1, marginLeft:"17px" }}
          >
            {t("NewPosition")}
          </Typography>
          <NewPositionSection 
            key={selectedWallet?.walletId || selectedWallet?.address || 'no-wallet'}
            selectedWallet={selectedWallet} 
            onSelectedTokenChange={handleSelectedTokenChange}
            filteredRows={lifiChainMap ? enrichTokenPositions(filteredRows, lifiChainMap) : []}
            selectedTokenRow={selectedTokenRow}
          />
        </Grid>
      </Grid>
        </Box>
      </>
    </TourProvider>
    </PageAccessGuard>
  );
}
