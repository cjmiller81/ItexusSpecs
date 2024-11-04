import * as React from "react";
import { useTheme, styled } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Autocomplete, { AutocompleteChangeReason, AutocompleteProps } from "@mui/material/Autocomplete";
import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import { AppInputProps } from "../AppInputProps";
import { ListOnItemsRenderedProps } from "react-window";
import { IconButton, TextField } from "@mui/material";
import Search from "@mui/icons-material/Search";
import { ListboxComponent } from "./ListBoxComponent";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import { ClearIcon } from "@mui/x-date-pickers";
import { t } from "i18next";

const topOptions = [
  { id: "100", label: t("Top 100 Coins") },
  { id: "300", label: t("Top 300 Coins") },
  { id: "500", label: t("Top 500 Coins") },
];

export interface LookUpOption {
  label: string;
  iconUrl?: string | null;
  id: string;
}

export interface CoinsLookupProps
  extends AppInputProps,
    Omit<AutocompleteProps<LookUpOption, true, false, false, any>, "renderInput"> {
  options: LookUpOption[];
  value?: LookUpOption[];
  onItemsRendered?: (props: ListOnItemsRenderedProps) => any;
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  color: "#24292e",
  backgroundColor: "#fff",
  boxShadow: `0 8px 24px ${"rgba(149, 157, 165, 0.2)"}`,
  borderRadius: 4,
  width: 190,
  fontSize: "0.8125rem",
  ...theme.applyStyles("dark", {
    boxShadow: `0 4px 24px ${"rgb(1, 4, 9)"}`,
    backgroundColor: "#363640",
  }),
}));

const Button = styled(ButtonBase)(({ theme }) => ({
  fontSize: 12,
  alignItems: "center",
  border: "1px solid #71797E",
  minHeight: "30px",
  borderRadius: "4px",
  paddingLeft: "5px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  "&:active, &:focus": {
    border: "2px solid #15c4ff",
    maxHeight: "30px",
  },
  ...theme.applyStyles("dark", {
    color: "#FFFFFF",
  }),
}));

const IconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
});

export function CoinsLookup({
  label,
  required,
  tooltip,
  onItemsRendered,
  loading,
  value = [],
  options,
  ...props
}: CoinsLookupProps) {
  const onItemsRenderedLocal = (renderProps: ListOnItemsRenderedProps) => {
    if (onItemsRendered) {
      onItemsRendered(renderProps);
    }
  };
  const { t } = useTranslation("CoinsLookup");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = useTheme();
  const enhancedOptions = [...topOptions, ...options];
  const hasSelectedItems = value.length > 0;
  const [nameOfButton, setNameOfButton] = React.useState<string>(t("Coins"));

  React.useEffect(() => {
    if (value.length === 0) {
      setNameOfButton("Coins");
    } else if (value.length === 1) {
      const selectedValue = value[0].label;
      if (selectedValue.includes(t("Top 100 Coins"))) {
        setNameOfButton(t("Top 100"));
      } else if (selectedValue.includes(t("Top 300 Coins"))) {
        setNameOfButton(t("Top 300"));
      } else if (selectedValue.includes(t("Top 500 Coins"))) {
        setNameOfButton(t("Top 500"));
      } else {
        const shortName = selectedValue.split("-")[0].trim();
        setNameOfButton(shortName);
      }
    } else {
      setNameOfButton(`${value.length} ${t("selected")}`);
    }
  }, [value]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(prev => !prev);
  };

  const [activeTopSelection, setActiveTopSelection] = React.useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: LookUpOption[], reason: AutocompleteChangeReason) => {
    const hasTop100 = newValue.some(option => option.label === t("Top 100 Coins"));
    const hasTop300 = newValue.some(option => option.label === t("Top 300 Coins"));
    const hasTop500 = newValue.some(option => option.label === t("Top 500 Coins"));

    if (
      (hasTop100 && activeTopSelection === t("Top 100 Coins")) ||
      (hasTop300 && activeTopSelection === t("Top 300 Coins")) ||
      (hasTop500 && activeTopSelection === t("Top 500 Coins"))
    ) {
      setActiveTopSelection("");
      newValue = [];
    } else {
      if (hasTop100) {
        newValue = [...options.slice(0, 100)];
        setActiveTopSelection(t("Top 100 Coins"));
      } else if (hasTop300) {
        newValue = [...options.slice(0, 300)];
        setActiveTopSelection(t("Top 300 Coins"));
      } else if (hasTop500) {
        newValue = [...options.slice(0, 500)];
        setActiveTopSelection(t("Top 500 Coins"));
      } else {
        setActiveTopSelection("");
      }
    }

    newValue = newValue.filter(
      option =>
        option.label !== t("Top 100 Coins") &&
        option.label !== t("Top 300 Coins") &&
        option.label !== t("Top 500 Coins"),
    );

    if (props.onChange) {
      props.onChange(event, newValue, reason);
    }
  };

  const handleClose = () => {
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
    setIsOpen(false);
  };
  const handleClearSelection = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (props.onChange) {
      props.onChange({} as React.SyntheticEvent, [], "clear");
    }
  };

  return (
    <>
      <Button
        disableRipple
        onClick={handleClick}>
        <label>{nameOfButton}</label>
        <IconContainer>
          {hasSelectedItems ? (
            <IconButton
              onClick={handleClearSelection}
              size="small"
              sx={{ ml: 1, maxWidth: "13px", maxHeight: "15px" }}>
              <ClearIcon sx={{ maxWidth: "17px" }} />
            </IconButton>
          ) : (
            <span style={{ marginLeft: "40px", marginTop: "3px" }}>
              {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </span>
          )}
        </IconContainer>
      </Button>

      <StyledPopper
        open={isOpen}
        anchorEl={anchorEl}
        placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <Box
              sx={t => ({
                borderBottom: `1px solid ${"#30363d"}`,
                padding: "8px 10px",
                fontWeight: 600,
                ...t.applyStyles("light", {
                  borderBottom: `1px solid ${"#eaecef"}`,
                }),
              })}></Box>
            <Autocomplete
              sx={{
                " .MuiInputBase-root": {
                  display: "flex",
                  flexWrap: "nowrap",
                },
              }}
              multiple
              open={true}
              disableCloseOnSelect
              disableListWrap
              PopperComponent={StyledPopper as any}
              ListboxComponent={ListboxComponent}
              ListboxProps={
                {
                  onItemsRendered: onItemsRenderedLocal,
                } as any
              }
              options={enhancedOptions}
              {...props}
              value={value}
              onChange={handleChange}
              renderInput={params => (
                <TextField
                  placeholder={t("Search")}
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
                        <Search />
                      </Box>
                    ),
                  }}
                />
              )}
              renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
              renderGroup={params => params as any}
            />
          </div>
        </ClickAwayListener>
      </StyledPopper>
    </>
  );
}

interface LabelType {
  name: string;
  color: string;
  description?: string;
}
