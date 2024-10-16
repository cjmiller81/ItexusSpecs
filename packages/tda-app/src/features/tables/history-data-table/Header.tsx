import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, styled, Button, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDateRangePicker } from "@mui/x-date-pickers-pro/StaticDateRangePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DateRange, DateRangeValidationError } from "@mui/x-date-pickers-pro/models";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
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
  const { t } = useTranslation("SpotRFQPage");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchor(null);
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
            alignItems: "center",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.grey[700],
            boxShadow: `2px 2px 6px ${theme.palette.grey[200]}`,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.grey[700],
              boxShadow: `2px 2px 6px ${theme.palette.grey[200]}`,
            },
          }}>
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
      <Button
        onClick={handleExportMenuOpen}
        sx={{
          padding: "5px 11px",
          color: theme.palette.grey[700],
          border: "none",
          alignItems: "center",
          "&:hover": {
            border: "none",
          },
        }}
        variant="outlined">
        <FileDownloadOutlinedIcon sx={{ marginRight: 0.3 }} />
        {t("Export")}
      </Button>
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={handleExportMenuClose}>
        <MenuItem onClick={handleDownloadPdf}>
          <InsertDriveFileOutlinedIcon sx={{ marginRight: 0.5 }} />
          {t("ExportAsPDF")}
        </MenuItem>
        <MenuItem onClick={handleDownloadCsv}>
          <DescriptionOutlinedIcon sx={{ marginRight: 0.5 }} />
          {t("ExportAsCSV")}
        </MenuItem>
      </Menu>
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
