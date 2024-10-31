import { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Localization from "./Localization";
import Notification from "./Notification";
import Profile from "./Profile";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MenuOrientation, ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import DrawerHeader from "Layouts/DashboardLayout/Drawer/DrawerHeader";
import DateTimeWidget from "Layouts/DashboardLayout/Header/HeaderContent/DateTimeWidget";
import SupportButton from "Layouts/DashboardLayout/Header/HeaderContent/SupportButton";
import ConnectionStatus from "Layouts/DashboardLayout/Header/HeaderContent/ConnectionStatus";
import TradingSwitch from "Layouts/DashboardLayout/Header/HeaderContent/TradingSwitch";
import { setTradingEnabled } from "features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "libs/redux/Store";
import { fetchConnectionStatus } from "Layouts/DashboardLayout/Header/HeaderContent/statusConnectionSlice";

export default function HeaderContent() {
  const dispatch = useAppDispatch();
  const { menuOrientation, mode, onChangeMode } = useConfig();
  const isPad = useMediaQuery("(max-width: 1030px)");
  const isMobile = useMediaQuery("(max-width: 715px)");

  useEffect(() => {
    dispatch(fetchConnectionStatus());
  }, [dispatch]);

  const isTradingEnabled = useAppSelector(state => state.rfq.isTradingEnabled);
  const isConnected = useAppSelector(state => state.statusConnection.isConnected);

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const localization = useMemo(() => <Localization />, []);

  const handleThemeToggle = () => {
    onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  const handleToggle = () => {
    dispatch(setTradingEnabled(!isTradingEnabled));
  };

  // Render the desktop layout
  const renderDesktopLayout = () => (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      <ConnectionStatus isConnected={isConnected} />
      <DateTimeWidget />
      <TradingSwitch
        setIsTradingEnabled={handleToggle}
        isTradingEnabled={isTradingEnabled}
      />
      <Box width="100%"></Box>
      <SupportButton />
      {localization}
      <Notification />
      <ThemeSwitcher ml={1} />
      <Profile />
    </>
  );

  // Render the mobile layout
  const renderMobileLayout = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%">
      <Box>
        <DrawerHeader open={true} />
      </Box>
      <Box sx={{ display: isMobile ? "contents" : "flex", mb: 1.5 }}>
        <ConnectionStatus isConnected={isConnected} />
        <DateTimeWidget />
        <TradingSwitch
          setIsTradingEnabled={handleToggle}
          isTradingEnabled={isTradingEnabled}
        />
        <SupportButton />
      </Box>

      <Box sx={{ display: isMobile ? "contents" : "flex" }}>
        {localization}
        <Notification />
        <ThemeSwitcher />
        <Profile />
      </Box>
    </Box>
  );

  // Render the appropriate layout based on screen size
  return isPad ? renderMobileLayout() : renderDesktopLayout();
}
