import { useMemo } from "react";

// material-ui
import Box from "@mui/material/Box";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// project import
import Localization from "./Localization";
import MobileSection from "./MobileSection";
import Notification from "./Notification";
import Profile from "./Profile";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import { MenuOrientation, ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import DrawerHeader from "Layouts/DashboardLayout/Drawer/DrawerHeader";

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const { menuOrientation, mode, onChangeMode } = useConfig();
  const theme = useTheme();
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const localization = useMemo(() => <Localization />, []);

  const handleThemeToggle = () => {
    onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Box width="100%"></Box>}
      {!downLG && localization}
      {downLG && <Box sx={{ width: "100%", ml: 1 }} />}

      <Notification />
      {!downLG && <ThemeSwitcher ml={1} />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
