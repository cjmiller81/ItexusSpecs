import { PdfLogo } from "@/components/logo/PdfLogo";
import { SvgLogo } from "@/components/logo/SvgLogo";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, styled } from "@mui/system";
import { LocalizationProvider, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { DateRange, DateRangeValidationError } from "@mui/x-date-pickers-pro/models";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "jspdf-autotable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { shortcutsItems } from "./shortcutsItems";

export const TableHeader = ({
  handleDownloadCsv,
  handleDownloadPdf,
  fromDate,
  toDate,
  handleToDateChange,
  handleFromDateChange,
}: {
  handleDownloadCsv: () => void;
  fromDate: Date | null;
  toDate: Date | null;
  handleDownloadPdf: () => void;
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
    // @ts-ignore
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

  return (
    <HeaderContainer>
      <Box>
        <Button
          onClick={handleMenuOpen}
          sx={{
            padding: "5px 11px",
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
          <InsertInvitationIcon sx={{ ml: 1, color: theme.palette.grey[600] }} />
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
                // @ts-ignore
                value={[dayjs(fromDate), dayjs(toDate)]}
                onChange={(newValue, selectedShortcut) => handleDateChange(newValue, selectedShortcut)}
              />
            </LocalizationProvider>
          </MenuItem>
        </Menu>
      </Box>
      <Stack
        direction="row"
        gap={0}>
        <Button onClick={handleDownloadCsv}>
          <SvgLogo />
        </Button>
        <Button onClick={handleDownloadPdf}>
          <PdfLogo />
        </Button>
      </Stack>
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
