import React, { ReactNode, useState } from "react";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import Avatar from "components/@extended/Avatar";
import IconButton from "components/@extended/IconButton";
import MainCard from "components/MainCard";
import ProfileTab from "./ProfileTab";

import { ThemeMode } from "config";
import useUser from "hooks/useUser";

import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import { useOry } from "components";

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const user = useUser();
  const { logOut } = useOry();

  const handleLogout = () => {
    logOut().then();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? "background.default" : "grey.100";

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: anchorEl ? iconBackColorOpen : "transparent",
          borderRadius: 1,
          "&:hover": { bgcolor: theme.palette.mode === ThemeMode.DARK ? "secondary.light" : "secondary.lighter" },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        aria-controls={anchorEl ? "profile-menu" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}>
        {user && (
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ p: 0.5 }}>
            <Avatar
              alt={user.name}
              src={user.avatar}
              size="sm"
            />
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize" }}>
              {user.name}
            </Typography>
          </Stack>
        )}
      </ButtonBase>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          sx: {
            pt: 0,
            pb: 0,
          },
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 252,
            minWidth: 240,
            maxWidth: { xs: 290, md: 320 },
            boxShadow: theme.customShadows.z1,
            backgroundColor: theme.palette.grey[50],
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <MainCard
          elevation={0}
          border={false}
          content={false}>
          <CardContent sx={{ px: 2.5, pt: 3 }}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center">
              <Grid item>
                {user && (
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center">
                    <Avatar
                      alt={user.name}
                      src={user.avatar}
                    />
                    <Stack>
                      <Typography variant="h6">{user.name}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary">
                        UI/UX Designer
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Grid>
              <Grid item>
                <Tooltip title="Logout">
                  <IconButton
                    size="large"
                    sx={{ color: "text.primary" }}
                    onClick={handleLogout}>
                    <LogoutOutlined />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <ProfileTab handleLogout={handleLogout} />
          </Box>
        </MainCard>
      </Menu>
    </Box>
  );
}
