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
} from "components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js"
import { TourProvider, useTour, StepType } from "@reactour/tour"

const TOUR_ID = "profile_v1";

const StartTourButton = () => {
  const { setIsOpen, setCurrentStep } = useTour();
  return (
    <Button
      variant="contained"
      size="small"
      sx={{ 
        ml: 2, 
        textTransform: "none", 
        backgroundColor: "#109EEF",
        color: "white",
        "&:hover": {
          backgroundColor: "#0E8BD6"
        }
      }}
      onClick={() => {
        const savedStep = Number(localStorage.getItem(`EI_TOUR_${TOUR_ID}_STEP`) || 0);
        setCurrentStep(isNaN(savedStep) ? 0 : savedStep);
        setIsOpen(true);
      }}
    >
      Start Tour
    </Button>
  );
};

export default function ProfilePage() {
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
        popover: (base) => ({ ...base, borderRadius: 12, padding: 16, background: "#ffffff", color: "#1a1a1a" }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        badge: (base) => ({ ...base, display: "none" }),
      }}
    >
      <>
        <TourStateSync totalSteps={steps.length} />
        <ProfileContainer title={t("UserProfile")}>
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
              <WalletsContainer />
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
  const viewed = typeof window !== "undefined" ? localStorage.getItem(`EI_TOUR_${TOUR_ID}_VIEWED`) === "1" : true;
  useEffect(() => {
    try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_STEP`, String(currentStep)); } catch { /* noop */ }
    if (currentStep >= totalSteps - 1) {
      try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, "1"); } catch { /* noop */ }
    }
  }, [currentStep, totalSteps]);
  useEffect(() => {
    try { localStorage.setItem(`EI_TOUR_${TOUR_ID}_VIEWED`, isOpen ? "0" : "1"); } catch { /* noop */ }
  }, [isOpen]);
  useEffect(() => {
    const savedStep = Number(localStorage.getItem(`EI_TOUR_${TOUR_ID}_STEP`) || 0);
    if (!viewed) {
      if (!isNaN(savedStep)) setCurrentStep(savedStep);
      setIsOpen(true);
    }
  }, []);
  return null;
};