import { useEffect, useRef, useState } from "react";

// material-ui
import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";
import { rfqApi } from "@/api/rfq-api/rfqApi";
import BellOutlined from "@ant-design/icons/BellOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Button, Divider, lighten, ListItemText, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "components/@extended/IconButton";
import Transitions from "components/@extended/Transitions";
import MainCard from "components/MainCard";
import { ThemeMode } from "config";
import moment from "moment";
import { useTranslation } from "react-i18next";

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",

  transform: "none",
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //
export const accountNumber = "EC_TEST";
export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const anchorRef = useRef<any>(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<HistoryDataParsed[]>([]);
  const { t } = useTranslation("Notification");

  useEffect(() => {
    rfqApi
      .getExecutionHistoryData({
        accountNumber,
        fromDate: moment().add(-1, "M").toDate(),
        toDate: moment().add(1, "d").toDate(),
      })
      .then(response => {
        setNotifications(response);
      });
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen: boolean) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? "background.default" : "grey.100";
  const errorBackground = theme.palette.mode === ThemeMode.DARK ? "#2A1215" : theme.palette.error.lighter;
  const successBackground = theme.palette.mode === ThemeMode.DARK ? "#162312" : theme.palette.success.lighter;

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: "text.primary", bgcolor: open ? iconBackColorOpen : "transparent" }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}>
        <Badge
          badgeContent={read}
          color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [matchesXs ? -5 : 0, 9],
              },
            },
          ],
        }}>
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position={matchesXs ? "top" : "top-right"}
            sx={{ overflow: "hidden" }}
            in={open}
            {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: 285,
                maxWidth: { xs: 285, md: 420 },
              }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {read > 0 && (
                        <Tooltip title="Mark as all read">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => setRead(0)}>
                            <CheckCircleOutlined style={{ fontSize: "1.15rem" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }>
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      "& .MuiListItemButton-root": {
                        py: 0.5,
                        "&.Mui-selected": { bgcolor: "grey.50", color: "text.primary" },
                        "& .MuiAvatar-root": avatarSX,
                        "& .MuiListItemSecondaryAction-root": { ...actionSX, position: "relative" },
                      },
                    }}>
                    <>
                      {notifications.slice(0, 3).map(notification => {
                        const isSuccess = notification.side === "Buy";
                        return (
                          <>
                            <ListItemButton
                              sx={{
                                backgroundColor: `${isSuccess ? successBackground : errorBackground} !important`,
                              }}
                              selected={read > 0}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    color: isSuccess
                                      ? theme.palette.success.main
                                      : lighten(theme.palette.error.main, 0.2),
                                    bgcolor: theme =>
                                      isSuccess ? theme.palette.success.lighter : theme.palette.error.lighter,
                                  }}>
                                  <CheckBoxIcon sx={{ width: "20px", height: "20px" }} />
                                </Avatar>
                              </ListItemAvatar>
                              <Stack
                                direction={"row"}
                                gap={6}>
                                <Stack>
                                  <Typography variant="h5">{t("TradeConfirmation")}</Typography>
                                  <Typography variant="body2">
                                    {" "}
                                    {t("FillBuySell", {
                                      side: notification.side,
                                      qty: notification.filledQty,
                                      pair: notification.symbol,
                                    })}
                                  </Typography>
                                  <Typography variant="body2">
                                    {" "}
                                    {t("Price", { price: notification.filledPrice || "--" })}
                                  </Typography>
                                </Stack>

                                <Stack
                                  width="110px"
                                  gap={1}
                                  height={"100%"}
                                  alignItems={"center"}>
                                  <Typography
                                    variant="caption"
                                    noWrap>
                                    {moment(notification.transactTime).format("MM/DD/YYYY HH:mm:ss")}
                                  </Typography>
                                  <Button
                                    disabled
                                    fullWidth
                                    sx={{
                                      padding: "2px 4px",
                                      fontSize: "0.8rem",
                                      textWrap: "nowrap",
                                    }}
                                    variant="contained">
                                    {t("TradeDetails")}
                                  </Button>
                                </Stack>
                              </Stack>
                            </ListItemButton>
                            <Divider />
                          </>
                        );
                      })}
                    </>
                    <ListItemButton sx={{ textAlign: "center", py: `${12}px !important` }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            color="primary">
                            {t("ViewAll")}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
