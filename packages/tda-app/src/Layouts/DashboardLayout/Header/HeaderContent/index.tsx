import { useMemo } from "react";
import Box from "@mui/material/Box";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Localization from "./Localization";
import Notification from "./Notification";
import Profile from "./Profile";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MenuOrientation, ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import DrawerHeader from "Layouts/DashboardLayout/Drawer/DrawerHeader";
import ConnectionStatus from "Layouts/DashboardLayout/Header/HeaderContent/ConnectionStatus";

export default function HeaderContent() {
  const { menuOrientation, mode, onChangeMode } = useConfig();
  const theme = useTheme();
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const isConnected = true;

  const localization = useMemo(() => <Localization />, []);

  const handleThemeToggle = () => {
    onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      <ConnectionStatus isConnected={isConnected} />
      <Box width="100%"></Box>
      {localization}
      <Notification />
      <ThemeSwitcher ml={1} />
      <Profile />
    </>
  );
}
