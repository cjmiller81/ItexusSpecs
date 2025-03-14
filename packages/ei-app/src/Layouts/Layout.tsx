import { getSidebarMenuItems } from "@/constants/sidebar"
import { useAppDispatch, useAppSelector } from "@/libs/redux/Store"
import { CssBaseline, useTheme } from "@mui/material"
import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import { fetchSubscriptionsAsync, getBillingAsync, Header, RootState, Sidebar, StyledDrawerHeader, toggleSideBar, toggleTheme, useOry, fetchProductAsync, setProduct } from "components"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import "react-toastify/dist/ReactToastify.css"

interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { sidebarOpened, mode } = useAppSelector(store => store.ui)
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const billing = useSelector((state: RootState) => state.billing)

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const billingData = await dispatch(getBillingAsync()).unwrap();
        if (billingData?.id) {
          const subscriptionsData = await dispatch(fetchSubscriptionsAsync(billingData.id)).unwrap();
          const activeSubscription = subscriptionsData
            ?.filter((sub) => sub.status === "active")
            ?.sort((a, b) => b.created - a.created)[0];

          if (activeSubscription?.items[0]?.price?.productId) {
            const productData = await dispatch(fetchProductAsync(activeSubscription.items[0].price.productId)).unwrap();
            dispatch(setProduct(productData));
          }
        }
      } catch (error) {
        console.error("Billing initialization error:", error);
      }
    };

    fetchBillingData();
  }, [dispatch]);

  const [sideBarOptions, setSideBarOptions] = useState(() => getSidebarMenuItems(theme, billing.product))

  useEffect(() => {
    setSideBarOptions(getSidebarMenuItems(theme, billing.product))
  }, [billing.product?.metadata])

  const { session, logOut } = useOry()
  const { t } = useTranslation("Header")

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
        title={t("ElanInsights")}
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
