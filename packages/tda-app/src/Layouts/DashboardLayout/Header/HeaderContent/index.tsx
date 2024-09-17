import { useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RfqState, setTradingEnabled } from "features/trading/rfq/slices/rfqSlice";

export default function HeaderContent() {
  const dispatch = useDispatch();
  const { menuOrientation, mode, onChangeMode } = useConfig();

  const isTradingEnabled = useSelector((state: { rfq: RfqState }) => state.rfq.isTradingEnabled);

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const isConnected = true;

  const localization = useMemo(() => <Localization />, []);

  const handleThemeToggle = () => {
    onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  const handleToggle = () => {
    dispatch(setTradingEnabled(!isTradingEnabled));
  };

  return (
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
}
