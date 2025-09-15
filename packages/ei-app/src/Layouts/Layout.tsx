import { getSidebarMenuItems } from "@/constants/sidebar"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { CssBaseline, useTheme } from "@mui/material"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import { fetchSubscriptionsAsync, getBillingAsync, Header, RootState, Sidebar, StyledDrawerHeader, toggleSideBar, toggleTheme, useOry, fetchProductAsync, setProduct, createBillingAsync } from "components"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useSubscription } from "@/hooks/useSubscription"
import "react-toastify/dist/ReactToastify.css"

interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { sidebarOpened, mode } = useAppSelector(store => store.ui)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const billing = useSelector((state: RootState) => state.billing)
  const currentPlan = (billing.product?.name?.split(" ")[0]) ?? null;
  const { hasPageAccess } = useSubscription()
  const [sideBarOptions, setSideBarOptions] = useState(() => getSidebarMenuItems(theme, hasPageAccess))

  useEffect(() => {
    setSideBarOptions(getSidebarMenuItems(theme, hasPageAccess))
  }, [theme, billing.product?.metadata, billing.subscriptions])

  const { session, logOut } = useOry()
  const { t } = useTranslation("Header")
  const isDarkMode = mode === 'dark';
  const logoSrc = isDarkMode ? "/ElanInsightsLight.png" : "/ElanInsights.png"

  // Load billing data first, then subscriptions
  useEffect(() => {
    const loadBillingData = async () => {
      try {
        let billingData = await dispatch(getBillingAsync()).unwrap();
        
        if (!billingData) {
          await dispatch(createBillingAsync());
          billingData = await dispatch(getBillingAsync()).unwrap();
        }
        
        if (billingData?.id) {
          
          // Load subscriptions first
          const subscriptionsData = await dispatch(fetchSubscriptionsAsync(billingData.id)).unwrap();
          
          // Load product data if we have an active subscription
          if (subscriptionsData && subscriptionsData.length > 0) {
            const activeSubscription = subscriptionsData
              ?.filter((sub) => sub.status === "active")
              ?.sort((a, b) => b.created - a.created)[0];
              
            if (activeSubscription?.items?.data?.[0]?.price?.product) {
              await dispatch(fetchProductAsync(activeSubscription.items.data[0].price.product));
            }
          }
        } else {
        }
      } catch (error) {
        console.error('❌ Error loading billing:', error);
      }
    };
    
    loadBillingData();
  }, [dispatch]);

  return (
    <StyledRoot sx={{ width: "100%" }}>
      <Header
        logOut={logOut}
        defaultAvatar="/defaultAvatar.png"
        avatarUrl={session?.identity?.traits.avatarUrl}
        mode={mode}
        toggleTheme={() => dispatch(toggleTheme())}
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open: open }))}  
        title={
          <img
            id="ei-logo"
            src={logoSrc}
            alt="ElanInsights"
            style={{ height: 20, marginTop: "10px", objectFit: "contain" }}
          />}
      />
      <Sidebar
        key={billing.product?.id}
        sidebarItems={sideBarOptions}
        open={sidebarOpened}
        toggleSide={open => dispatch(toggleSideBar({ open: open }))}  
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <StyledDrawerHeader />
        <CssBaseline />
        {children}
      </Box>
    </StyledRoot>
  )
}

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "inherit",
  },
}));
