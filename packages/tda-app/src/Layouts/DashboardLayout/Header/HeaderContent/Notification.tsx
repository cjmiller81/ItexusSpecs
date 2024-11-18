import { useEffect, useState } from "react";
import { rfqApi } from "@/api/rfq-api/rfqApi";
import BellOutlined from "@ant-design/icons/BellOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Badge,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { HistoryDataParsed } from "@/api/rfq-api/models/HistoryDataParsed";

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const Notification = () => {
  const theme = useTheme();
  const { t } = useTranslation("Notification");
  const [read, setRead] = useState(2);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Ensure anchorEl is typed correctly
  const [notifications, setNotifications] = useState<HistoryDataParsed[]>([]);
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    rfqApi
      .getExecutionHistoryData({
        accountNumber: "EC_TEST",
        fromDate: moment().add(-1, "M").toDate(),
        toDate: moment().add(1, "d").toDate(),
      })
      .then(response => {
        setNotifications(response);
      });
  }, []);

  const handleToggle = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget); // Toggle anchorEl with event target
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        color="secondary"
        onClick={handleToggle}
        aria-controls={anchorEl ? "notification-menu" : undefined}
        aria-haspopup="true">
        <Badge
          badgeContent={read}
          color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
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
            width: matchesXs ? 385 : 420,
            maxWidth: "100%",
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
        <Paper sx={{ p: 2, minWidth: 385, maxWidth: { xs: 285, md: 420 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Typography variant="h6">{t("Notification")}</Typography>
            {read > 0 && (
              <IconButton
                size="small"
                onClick={() => setRead(0)}>
                <CheckCircleOutlined style={{ fontSize: "1.15rem" }} />
              </IconButton>
            )}
          </Stack>

          <List sx={{ p: 0 }}>
            {notifications.slice(0, 3).map(notification => {
              const isSuccess = notification.side === "Buy";
              const backgroundColor = isSuccess ? theme.palette.success.lighter : theme.palette.error.lighter;

              return (
                <div key={notification.transactTime.toString()}>
                  {" "}
                  <ListItemButton sx={{ backgroundColor }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{ color: isSuccess ? theme.palette.success.main : theme.palette.error.main, ...avatarSX }}>
                        <CheckBoxIcon sx={{ width: "20px", height: "20px" }} />
                      </Avatar>
                    </ListItemAvatar>
                    <Stack
                      direction="row"
                      gap={2}
                      flexGrow={1}>
                      <Stack>
                        <Typography variant="h5">{t("TradeConfirmation")}</Typography>
                        <Typography variant="body2">
                          {t("FillBuySell", {
                            side: notification.side,
                            qty: notification.filledQty,
                            pair: notification.symbol,
                          })}
                        </Typography>
                        <Typography variant="body2">
                          {t("Price", { price: notification.filledPrice || "--" })}
                        </Typography>
                      </Stack>
                      <Stack alignItems="center">
                        <Typography
                          variant="caption"
                          noWrap>
                          {moment(notification.transactTime).format("MM/DD/YYYY HH:mm:ss")}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ mt: 1 }}
                          size="small">
                          {t("TradeDetails")}
                        </Button>
                      </Stack>
                    </Stack>
                  </ListItemButton>
                  <Divider />
                </div>
              );
            })}
          </List>

          <MenuItem
            onClick={handleClose}
            sx={{ justifyContent: "center", py: 1 }}>
            <Typography
              variant="h6"
              color="primary">
              {t("ViewAll")}
            </Typography>
          </MenuItem>
        </Paper>
      </Menu>
    </div>
  );
};

export default Notification;
