import { AppChart } from "@/components/Charts/AppChart";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, BoxProps, MenuItem, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  AppDatePicker,
  AppSelect,
  LookUpOption,
  OnFetchResponse,
  PageTitle,
  SymbolsLookupVirtualized,
  chartDateFormatString,
} from "components";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LookupPageSize } from "../Common/fetchLookupPage";

export type Period = "daily" | "weekly" | "monthly";

interface Props extends BoxProps {
  title: string;
  period: Period;
  onPeriodChange: (period: Period) => void;
  onFromDateChange: (date: Date | null) => void;
  onToDateChange: (date: Date | null) => void;
  onDatesValidChanged?: (isValid: boolean) => void;
  fromDate: Date | null;
  toDate: Date | null;
  onChartSubmit: () => void;
  lookupLoading: boolean;
  lookupOption?: LookUpOption | null;
  onOptionChange: (option: LookUpOption | null) => void;
  minChartValue: number;
  maxChartValue: number;
  chartAxisTicks: number;
  chartDataLoading?: boolean;
  onToggleSeries: (seriesIndex: 0 | 1) => void;
  submitButtonDisabled: boolean;
  sumbitButtonText?: string;
  onFetchPage: (pageNumber: number, searchQuery: string) => Promise<OnFetchResponse>;
  // eslint-disable-next-line no-undef
  chartSeries?: ApexAxisChartSeries | null;
  // eslint-disable-next-line no-undef
  valueSeries?: ApexAxisChartSeries | null;
  className?: string;
}

export const HistoricalWalletsWorth = ({
  title,
  period,
  onPeriodChange,
  onFromDateChange,
  onToDateChange,
  onDatesValidChanged,
  fromDate,
  toDate,
  onChartSubmit,
  lookupLoading,
  lookupOption,
  onOptionChange,
  minChartValue,
  maxChartValue,
  chartAxisTicks,
  chartDataLoading,
  onToggleSeries,
  submitButtonDisabled,
  chartSeries,
  valueSeries,
  onFetchPage,
  sumbitButtonText,
  className,
  ...props
}: Props) => {
  const { t } = useTranslation("HistoricalWalletsWorth");

  const percentageFormatter = (value?: number) => {
    return `${(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}%`;
  };
  const [isFromDateValid, setIsFromDateValid] = useState(true);
  const [isToDateValid, setIsToDateValid] = useState(true);
  const [inputSearch, setInputSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState<"growth" | "value">("growth");
  const maxFromDate = (toDate ? moment(toDate).add(-1, "d") : moment().add(-1, "d")).toDate();
  const minToDate = fromDate ? moment(fromDate).add(1, "d").toDate() : undefined;

  const handleDatePickerContext = (
    event: PickerChangeHandlerContext<DateValidationError>,
    setIsValid: (isValid: boolean) => void,
  ) => {
    //eslint-disable-next-line no-extra-boolean-cast
    const isValid = !Boolean(event.validationError);
    setIsValid(isValid);
    if (onDatesValidChanged) onDatesValidChanged(isValid);
  };

  return (
    <StyledWalletWorthContainer
      {...props}
      className="index-modeling-section-container">
      <StyledWalletWorthMenuContainer>
        <StyledTypographyWalletsWorthTitle alignContent={"center"}>{title}</StyledTypographyWalletsWorthTitle>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={selectedSection}
            onChange={(_, newValue) => {
              if (newValue !== null) setSelectedSection(newValue);
            }}
            sx={{ marginTop: 2 }}
          >
            <ToggleButton
              value="growth"
              sx={{
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                },
              }}
            >
              {t("Growth")}
            </ToggleButton>
            <ToggleButton
              value="value"
              sx={{
                "&.Mui-selected": {
                  color: "white",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                },
              }}
            >
              {t("Value")}
            </ToggleButton>
          </ToggleButtonGroup>
        <StyledWalletWorthMenu>
          <AppSelect
            tooltip={t("Period", { ns: "Tooltips" })}
            sx={{ width: "100%" }}
            label={t("Period")}
            value={period}
            variant="outlined"
            defaultValue={"daily"}
            onChange={event => onPeriodChange(event.target.value as Period)}>
            <MenuItem value={"daily"}>{t("Daily")}</MenuItem>
            <MenuItem value={"weekly"}>{t("Weekly")}</MenuItem>
            <MenuItem value={"monthly"}>{t("Monthly")}</MenuItem>
          </AppSelect>
          <Stack
            gap={2}
            direction="row">
            <AppDatePicker
              tooltip={t("Required", { ns: "Tooltips" })}
              required
              disableFuture
              value={fromDate}
              onChange={(date, event) => {
                onFromDateChange(date);
                handleDatePickerContext(event, setIsFromDateValid);
              }}
              maxDate={maxFromDate}
              label={t("FromDate")}
            />
            <AppDatePicker
              tooltip={t("Required", { ns: "Tooltips" })}
              required
              disableFuture
              value={toDate}
              onChange={(date, event) => {
                onToDateChange(date);
                handleDatePickerContext(event, setIsToDateValid);
              }}
              maxDate={new Date()}
              minDate={minToDate}
              label={t("ToDate")}
            />
          </Stack>
          <StyledSymbolLookup
            pageSize={LookupPageSize}
            onFetchPage={pageNumber => onFetchPage(pageNumber, inputSearch)}
            tooltip={t("CompareToSymbol", { ns: "Tooltips" })}
            loading={lookupLoading}
            disableListWrap
            value={lookupOption}
            onChange={(_event, value) => onOptionChange(value)}
            autoComplete={true}
            onInputChange={(_event, value) => {
              setInputSearch(value);
            }}
            filterOptions={x => x}
            inputValue={inputSearch}
            label={t("CompareToSymbol")}
          />
          <LoadingButton
            loading={chartDataLoading}
            onClick={onChartSubmit}
            disabled={submitButtonDisabled || !isFromDateValid || !isToDateValid}
            sx={{ width: "50%", alignSelf: "center" }}
            variant="contained">
            {sumbitButtonText || t("Sumbit", { ns: "Common" })}
          </LoadingButton>
        </StyledWalletWorthMenu>
      </StyledWalletWorthMenuContainer>
        <Box sx={{ width: "100%" }}>
          {selectedSection === "growth" ? (
            <AppChart
              series={chartSeries || []}
              height={460}
              optionsOverrides={{
                legend: {
                  show: true,
                  showForSingleSeries: true,
                  onItemClick: {
                    toggleDataSeries: true,
                  },
                },
                grid: {
                  strokeDashArray: 0,
                },
                chart: {
                  events: {
                    legendClick: (_chart: any, seriesIndex?: number) => {
                      if (seriesIndex !== undefined) onToggleSeries(seriesIndex as 0 | 1);
                    },
                  },
                  animations: {
                    enabled: false,
                    dynamicAnimation: {
                      enabled: false,
                    },
                  },
                  zoom: {
                    enabled: true,
                    type: "x",
                    autoScaleYaxis: false,
                    zoomedArea: {
                      fill: {
                        color: "#90CAF9",
                        opacity: 0.4,
                      },
                      stroke: {
                        color: "#0D47A1",
                        opacity: 0.4,
                        width: 1,
                      },
                    },
                  },
                },
                yaxis: {
                  min: minChartValue,
                  max: maxChartValue,
                  forceNiceScale: true,
                  tickAmount: chartAxisTicks,
                  labels: {
                    formatter: percentageFormatter,
                  },
                },
                markers: {
                  radius: 0,
                },
                stroke: {
                  width: 3,
                  curve: "smooth",
                },
                tooltip: {
                  x: {
                    format: chartDateFormatString,
                  },
                  y: {
                    formatter: percentageFormatter,
                  },
                },
              }}
            />
          ) : (
            <AppChart
              series={valueSeries?.filter(s => s.name === "Value") || []}
              height={460}
              optionsOverrides={{
                legend: {
                  show: true,
                  showForSingleSeries: true,
                  onItemClick: {
                    toggleDataSeries: true,
                  },
                },
                grid: {
                  strokeDashArray: 0,
                },
                chart: {
                  events: {
                    legendClick: (_chart: any, seriesIndex?: number) => {
                      if (seriesIndex !== undefined) onToggleSeries(seriesIndex as 0 | 1);
                    },
                  },
                  animations: {
                    enabled: false,
                    dynamicAnimation: {
                      enabled: false,
                    },
                  },
                  zoom: {
                    enabled: true,
                    type: "x",
                    autoScaleYaxis: false,
                    zoomedArea: {
                      fill: {
                        color: "#90CAF9",
                        opacity: 0.4,
                      },
                      stroke: {
                        color: "#0D47A1",
                        opacity: 0.4,
                        width: 1,
                      },
                    },
                  },
                },
                yaxis: {
                  forceNiceScale: true,
                  tickAmount: chartAxisTicks,
                  labels: {
                    formatter: (value?: number) =>
                      `$${(value ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                  },
                },
                markers: {
                  radius: 0,
                },
                stroke: {
                  width: 3,
                  curve: "smooth",
                },
                tooltip: {
                  x: {
                    format: chartDateFormatString,
                  },
                  y: {
                    formatter: (value?: number) =>
                      `$${(value ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                  },
                },
              }}
            />
          )}
        </Box>
    </StyledWalletWorthContainer>
  );
};

export const StyledWalletWorthContainer = styled(Box)(({ theme }) => ({
  flexDirection: "row",
  backgroundColor:"transparent",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  gap: theme.spacing(4),
  display: "flex",
  width: "100%",
}));

export const StyledSymbolLookup = styled(SymbolsLookupVirtualized)(() => ({
  flexGrow: 1,
}));

export const StyledWalletWorthMenuContainer = styled(Box)(({ theme }) => ({
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "35%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textWrap: "noWrap",
    display: "flex",
    width: "100%",
  },
  alignItems: "center",
  justifyContent: "flex-start",
}));

export const StyledWalletWorthMenu = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  marginTop: theme.spacing(7),
  gap: theme.spacing(5),
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(2),
  },
  [theme.breakpoints.between("sm", "md")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  [theme.breakpoints.down("xs")]: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
}));

export const StyledTypographyWalletsWorthTitle = styled(PageTitle)(({ theme }) => ({
  textWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    flexBasis: "20%",
    textAlign: "center",
  },
}));
