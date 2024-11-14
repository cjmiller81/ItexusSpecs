import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Theme, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Localization from "./Localization";
import Notification from "./Notification";
import Profile from "./Profile";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import SupportButton from "Layouts/DashboardLayout/Header/HeaderContent/SupportButton";
import { MenuOrientation, ThemeMode } from "config";
import useConfig from "hooks/useConfig";
import DrawerHeader from "Layouts/DashboardLayout/Drawer/DrawerHeader";
import DateTimeWidget from "Layouts/DashboardLayout/Header/HeaderContent/DateTimeWidget";
import ConnectionStatus from "Layouts/DashboardLayout/Header/HeaderContent/ConnectionStatus";
import TradingSwitch from "Layouts/DashboardLayout/Header/HeaderContent/TradingSwitch";
import { setTradingEnabled } from "features/trading/rfq/slices/rfqSlice";
import { useAppDispatch, useAppSelector } from "libs/redux/Store";
import { fetchConnectionStatus } from "Layouts/DashboardLayout/Header/HeaderContent/statusConnectionSlice";

export default function HeaderContent() {
  const dispatch = useAppDispatch();
  const { menuOrientation, mode, onChangeMode } = useConfig();
  const isPad = useMediaQuery("(max-width: 850px)");
  const isMobile = useMediaQuery("(max-width: 480px)");

  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = event => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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

  const renderMobileLayout = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%">
      <Box>
        <DrawerHeader open={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        width="100%">
        <Box
          display="flex"
          justifyContent="center"
          flexGrow={1}>
          <ConnectionStatus isConnected={isConnected} />
          <DateTimeWidget />
          <TradingSwitch
            setIsTradingEnabled={handleToggle}
            isTradingEnabled={isTradingEnabled}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          width="auto">
          <IconButton
            onClick={handleMenuOpen}
            aria-label="menu"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              backgroundColor:
                theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300],
            }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          width: "100vw",
          left: 0,
          top: "49px",
          p: 0,
          "& .MuiPaper-root": {
            width: "100%",
            justifyContent: "flex-end !important",
            display: "flex",
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end !important",
            width: "100%",
          }}>
          <MenuItem
            sx={{ padding: isMobile ? 0.6 : 1 }}
            onClick={e => {
              e.stopPropagation();
            }}>
            <SupportButton />
          </MenuItem>

          <MenuItem
            sx={{ padding: isMobile ? 0.6 : 1 }}
            onClick={e => {
              e.stopPropagation();
            }}>
            {localization}
          </MenuItem>

          <MenuItem
            sx={{ padding: isMobile ? 0.6 : 1 }}
            onClick={e => {
              e.stopPropagation();
            }}>
            <Notification />
          </MenuItem>

          <MenuItem
            sx={{ padding: isMobile ? 0.6 : 1 }}
            onClick={e => {
              e.stopPropagation();
              handleThemeToggle();
            }}>
            <ThemeSwitcher ml={1} />
          </MenuItem>

          <MenuItem
            sx={{ padding: isMobile ? 0.6 : 1 }}
            onClick={handleMenuClose}>
            <Profile />
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );

  return isPad ? renderMobileLayout() : renderDesktopLayout();
}
