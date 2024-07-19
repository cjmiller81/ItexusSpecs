import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar, Button, Typography, useTheme } from "@mui/material";
import { grey, orange } from "@mui/material/colors";
import { Box, Stack, darken, lighten } from "@mui/system";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardTile, DashboardTileProps } from "./DashboardTile";

type Props = Omit<DashboardTileProps, "children"> & {
  version: string;
};

export const UpdatesTile: FC<Props> = ({ title, icon, version, sx, ...props }) => {
  const { t } = useTranslation("UpdatesTile");
  const theme = useTheme();
  const fillGrey = theme.palette.mode === "light" ? grey[600] : grey[500];
  const fillOrange = theme.palette.mode === "light" ? orange[600] : darken(orange[800], 0.1);
  const [isNotifyHovered, setNotifyIsHovered] = useState(false);

  const handleNotifyMouseEnter = () => {
    setNotifyIsHovered(true);
  };

  const handleNotifyMouseLeave = () => {
    setNotifyIsHovered(false);
  };

  return (
    <DashboardTile
      title={title}
      icon={icon}
      sx={{
        ...sx,
        marginTop: "27px",
      }}
      {...props}>
      <Stack
        alignItems="center"
        gap={2}
        px={5}
        sx={{ height: 195, mt: 5 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          letterSpacing={0.5}
          color={fillGrey}>
          {t("CurrentVersion", { version: version })}
        </Typography>
        <Button
          sx={{
            py: 1.3,
            px: "10%",
            borderRadius: 2,
            "&.Mui-disabled": {
              backgroundColor: fillGrey,
              color: theme => theme.palette.getContrastText(fillGrey),
            },
          }}
          variant="contained"
          disabled>
          <Typography
            noWrap
            fontWeight="bold"
            letterSpacing={1}
            textOverflow={"ellipsis"}
            textTransform="none"
            variant="body1">
            {t("ViewNote")}
          </Typography>
        </Button>

        <Box position={"relative"}>
          <Button
            sx={{
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                animation: "none",
                boxShadow: theme.shadows[1],
              },
              py: 1,
              px: 6,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: isNotifyHovered ? theme.palette.primary.main : darken(theme.palette.primary.main, 0.1),
            }}
            onMouseEnter={handleNotifyMouseEnter}
            onMouseLeave={handleNotifyMouseLeave}
            variant="contained">
            <Typography
              fontWeight="bold"
              textTransform="none"
              variant="body1">
              {t("NotifyMe")}
            </Typography>
          </Button>
          <Avatar
            onMouseEnter={handleNotifyMouseEnter}
            onMouseLeave={handleNotifyMouseLeave}
            sx={{
              width: 50,
              height: 50,
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: -30,
              border: "2px solid",
              backgroundColor: isNotifyHovered ? lighten(fillOrange, 0.1) : fillOrange,
              borderColor: isNotifyHovered ? theme.palette.primary.main : darken(theme.palette.primary.main, 0.1),
              cursor: "pointer",
            }}>
            <NotificationsIcon sx={{ width: 35, height: 35, color: "white" }}></NotificationsIcon>
          </Avatar>
        </Box>
      </Stack>
    </DashboardTile>
  );
};
