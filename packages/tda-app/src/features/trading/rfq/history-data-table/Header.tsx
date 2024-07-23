import DownloadOutlined from "@ant-design/icons/DownloadOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box, styled } from "@mui/system";
import { LocalizationProvider, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { DateRange, DateRangeValidationError } from "@mui/x-date-pickers-pro/models";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersShortcutsItem } from "@mui/x-date-pickers/PickersShortcuts";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const TableHeader = ({
  handleDownloadCsv,
  fromDate,
  toDate,
  handleHistory,
  handleToDateChange,
  handleFromDateChange,
}: {
  handleDownloadCsv: () => void;
  handleHistory: () => void;
  fromDate: Date | null;
  toDate: Date | null;
  handleToDateChange: (date: Date | null) => void;
  handleFromDateChange: (date: Date | null) => void;
}) => {
  const { t } = useTranslation("ProfilePage");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDateChange = (
    newValue: DateRange<dayjs.Dayjs>,
    shortcuts: PickerChangeHandlerContext<DateRangeValidationError>,
  ) => {
    let newFromDate = newValue[0] ? newValue[0].toDate() : null;
    let newToDate = newValue[1] ? newValue[1].toDate() : null;

    if (newFromDate && fromDate && newFromDate < fromDate && !shortcuts.hasOwnProperty("shortcut")) {
      newToDate = null;
    }

    handleFromDateChange(newFromDate);
    handleToDateChange(newToDate);

    if (newFromDate && newToDate) {
      handleMenuClose();
    }
  };

  const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
      label: "This Week",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("week"), today.endOf("week")];
      },
    },
    {
      label: "Last Week",
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, "day");
        return [prevWeek.startOf("week"), prevWeek.endOf("week")];
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, "day"), today];
      },
    },
    {
      label: "Current Month",
      getValue: () => {
        const today = dayjs();
        return [today.startOf("month"), today.endOf("month")];
      },
    },
    { label: "Reset", getValue: () => [null, null] },
  ];

  return (
    <HeaderContainer>
      <Box>
        <Button
          onClick={handleMenuOpen}
          sx={{
            color: theme.palette.grey[700],
            border: "1px solid",
            borderColor: theme.palette.grey[500],
            alignItems: "center",
            "&:hover": {
              borderColor: theme.palette.grey[100],
              color: theme.palette.grey[700],
              border: "1px solid",
              backgroundColor: theme.palette.grey[100],
            },
          }}
          variant="outlined">
          <span style={{ flex: 1, textAlign: "center", fontSize: 14 }}>
            {fromDate && toDate
              ? `${dayjs(fromDate).format("MM/DD/YYYY")}\u00A0—\u00A0${dayjs(toDate).format("MM/DD/YYYY")}`
              : "Select Date Range"}
          </span>
          <InsertInvitationIcon sx={{ ml: 1, color: theme.palette.grey[600], marginLeft: 0 }} />
        </Button>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}>
          <MenuItem>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateRangePicker
                slotProps={{
                  shortcuts: {
                    items: shortcutsItems,
                  },
                  actionBar: { actions: [] },
                }}
                calendars={2}
                value={[dayjs(fromDate), dayjs(toDate)]}
                onChange={(newValue, selectedShortcut) => handleDateChange(newValue, selectedShortcut)}
              />
            </LocalizationProvider>
          </MenuItem>
        </Menu>
      </Box>
      <Button
        sx={{ minWidth: "150px" }}
        variant="contained"
        disabled={!(fromDate && toDate)}
        onClick={handleHistory}>
        Run History
      </Button>
      <HistoryRoundedIcon
        onClick={handleHistory}
        sx={{
          cursor: "pointer",
          "&:hover": {
            color: "primary.main",
          },
          ml: theme => theme.spacing(0.5),
        }}
      />
      <Button
        onClick={handleDownloadCsv}
        sx={{ display: "flex", gap: 0.5, alignItems: "center", padding: "0 1" }}>
        <DownloadOutlined style={{ cursor: "pointer", fontSize: 20 }} />
        <Typography>{t("Export")}</Typography>
      </Button>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
}));
