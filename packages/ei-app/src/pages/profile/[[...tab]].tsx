import { TabContext, TabPanel } from "@mui/lab"
import TabList from "@mui/lab/TabList"
import { Box, Tab, styled, Button, Typography } from "@mui/material"
import {
  BillingContainer,
  ProfileContainer,
  ProfileDetails,
  ProfilePicture,
  SecurityContainer,
  WalletsContainer,
  addError,
  profileService,
  useAppDispatch,
  useOry,
  updateTourStatusAsync,
  fetchReactourSettingsAsync,
  useAppSelector,
} from "components"
import { useLifiChainMap } from "@/common/lifiChainContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"
import { TourProvider, useTour, StepType } from "@reactour/tour"
import { AnimatedStartTourButton } from "../../components/AnimatedStartTourButton"

const TOUR_ID = "profile_v1";
const TOUR_NAME = "profile";

const StartTourButton = () => {
  return (
    <AnimatedStartTourButton
      tourId={TOUR_ID}
      sx={{ ml: 2 }}
    />
  );
};

export default function ProfilePage() {
  const { lifiChainMap } = useLifiChainMap();
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false)
  const [isProfileDetailsUpdating, setIsProfileDetailsUpdating] = useState<boolean>(false)
  const { onUpdateAvatar, session, onUpdateProfile } = useOry()
  const dispatch = useAppDispatch()
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
  const router = useRouter()
  const routeParams = (router.query.tab as string[]) || undefined

  const [value, setValue] = useState<string>(
    routeParams && (router.query.tab as string[]).length ? routeParams[0] : "details",
  )
  const { t } = useTranslation("ProfilePage")

  const steps: StepType[] = [
    {
      selector: "#profile-header-tabs",
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("YourProfileSection")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("ManageYourAccountSettings")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: '[data-tour="profile-tab-details"]',
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("CustomizeYourExperience")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("PersonalizeYourDashboardSubscribeForFullToolsAccess")}</Typography>
        </Box>
      ),
      position: "right"
    },
    {
      selector: '[data-tour="profile-tab-wallets"]',
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("ConnectedWallets")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("ViewManageYourConnectedCryptoWallets")}</Typography>
        </Box>
      ),
      position: "bottom"
    },
    {
      selector: '[data-tour="profile-tab-billing"]',
      content: () => (
        <Box sx={{ color: "#1a1a1a" }}>
          <Typography variant="h6" sx={{ mb: 1, color: "#1a1a1a" }}>{t("SubscriptionStatus")}</Typography>
          <Typography sx={{ color: "#4a5568" }}>{t("ViewYourCurrentSubscriptionTierAvailableFeatures")}</Typography>
        </Box>
      ),
      position: "bottom"
    }
  ];

  useEffect(() => {
    router.push(
      {
        pathname: `${value}`,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }, [value])

  const handleChange = (newValue: string) => {
    //eslint-disable-next-line no-unused-vars
    setValue(newValue)
  }

  const onAvatarChanged = async (file: File) => {
    setIsAvatarUploading(true)
    profileService
      .uploadAvatart(file)
      .then(url => onUpdateAvatar(url))
      .catch((error: any) => {
        const reason = error?.response?.data?.error?.reason
        if (reason) dispatch(addError({ message: reason }))
        else dispatch(addError({ message: t("AvatarUploadingError") }))
      })
      .finally(() => setIsAvatarUploading(false))
  }

  const onChangeDetails = (firstName: string, lastName: string) => {
    setIsProfileDetailsUpdating(true)
    onUpdateProfile(firstName, lastName)
      .then()
      .catch((error: any) => {
        const reason = error?.response?.data?.error?.reason
        if (reason) dispatch(addError({ message: reason }))
        else dispatch(addError({ message: t("ProfileUpdatingError") }))
      })
      .finally(() => setIsProfileDetailsUpdating(false))
  }

  return (
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
        <ProfileContainer>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t("UserProfile")}
            </Typography>
            <StartTourButton />
          </Box>
          <TabContext value={value}>
            <StyledTabList
              onChange={(_event, newValue) => handleChange(newValue)}
              id="profile-header-tabs"
            >
              <Tab
                label={t("PROFILE")}
                value="details"
                data-tour="profile-tab-details"
              />
              <Tab
                label={t("SECURITY")}
                value="security"
              />
              <Tab
                label={t("WALLETS")}
                value="wallets"
                data-tour="profile-tab-wallets"
              />
              <Tab
                label={t("BILLING")}
                value="billing"
                data-tour="profile-tab-billing"
              />
            </StyledTabList>
            <TabPanel value="details">
              <StyledProfileBox>
                <ProfilePicture
                  defaultAvatarSrc="/defaultAvatar.png"
                  onAvatarChanged={onAvatarChanged}
                  avatarUrl={session?.identity?.traits.avatarUrl}
                  isAvatarUploading={isAvatarUploading}
                  sx={{ width: "30%", minWidth: "200px" }}
                />
                <ProfileDetails
                  onUpdateProfile={onChangeDetails}
                  loadingCnangeDetails={isProfileDetailsUpdating}
                  sx={{ width: "100%" }}
                />
              </StyledProfileBox>
            </TabPanel>
            <TabPanel value="security">
              <SecurityContainer />
            </TabPanel>
            <TabPanel value="wallets">
              <WalletsContainer lifiChainMap={lifiChainMap} />
            </TabPanel>
            <TabPanel value="billing">
              <Elements stripe={stripePromise}>
                <BillingContainer />
              </Elements>
            </TabPanel>
          </TabContext>
        </ProfileContainer>
      </>
    </TourProvider>
  )
}

const StyledProfileBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}))

const StyledTabList = styled(TabList)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    " .MuiButtonBase-root": {
      minWidth: "20px",
      padding: "8px 12px",
    },
  },
}))

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