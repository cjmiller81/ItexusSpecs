import React, { FC, useState } from "react";
import { Box, BoxProps, styled } from "@mui/system";
import { Switch, Typography } from "@mui/material";
import useConfig from "@/hooks/useConfig";
import { useTranslation } from "react-i18next";
import { ThemeMode } from "@/config";
import { grey } from "@mui/material/colors";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 91,
  height: 34,
  "& .MuiSwitch-switchBase": {
    marginRight: 1,
    padding: 0,
    transform: "translateX(0px)",
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.primary,
    },
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(55px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          "#000000",
        )}" d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: grey[800],
      },
    },
  },

  "& .MuiSwitch-thumb": {
    backgroundColor: "white",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#000000",
      )}" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0z"/></svg>')`,
    },
  },
}));

const SwitchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
}));

const ThemeSwitcher: FC<BoxProps> = props => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { mode, onChangeMode } = useConfig();
  const { t } = useTranslation("ThemeSwitcher");

  const onChange = () => {
    setIsDarkMode(!isDarkMode);
    onChangeMode(mode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);
  };
  return (
    <SwitchContainer
      {...props}
      sx={{
        "& .MuiSwitch-root": {
          margin: "0px !important",
        },
      }}>
      <Box sx={{ position: "relative" }}>
        <Typography
          onClick={onChange}
          position="absolute"
          zIndex={1}
          right={0}
          variant="button"
          fontSize="8px"
          display={isDarkMode ? "none" : "inherit"}
          top="50%"
          marginRight="3px"
          fontFamily="revert"
          fontWeight="900"
          sx={{ pr: "4px", transform: "translateY(-50%)", userSelect: "none", cursor: "pointer" }}>
          {t("Light")}
        </Typography>
        <Typography
          onClick={onChange}
          position="absolute"
          zIndex={1}
          variant="button"
          fontSize="8px"
          marginRight="3px"
          fontWeight="900"
          display={!isDarkMode ? "none" : "inherit"}
          top="50%"
          fontFamily="revert"
          sx={{ pl: "4px", transform: "translateY(-50%)", userSelect: "none", cursor: "pointer" }}>
          {t("Dark")}
        </Typography>
        <MaterialUISwitch
          checked={isDarkMode}
          onChange={onChange}
        />
      </Box>
    </SwitchContainer>
  );
};

export default ThemeSwitcher;
