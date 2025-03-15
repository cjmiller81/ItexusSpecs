import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { PageTitle } from "../TextDisplay/PageTitle";
import { StatePersistedAccordion, StatePersistedAccordionProps } from "./StatePersistedAccordion";

interface Props extends StatePersistedAccordionProps {
  headerChildren?: React.ReactNode;
  title?: string;
  tooltip: string;
}

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
    color: "white",
  },
}));

export const AppAccordionSection = ({ children, headerChildren, title, tooltip, ...props }: Props) => {
  const theme = useTheme();

  const darkThemeStyles = {
    cursor: "default !important",
    pointerEvents: "none",
    position: "inherit",
    borderRadius: "2px",
    boxShadow: "8px 2px 10px rgba(0, 0, 0, 0.2), -8px 2px 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#363640",
    border: "1.6px solid #25252AFF",
    outline: "1.9px solid #363640",
    "& .MuiAccordionSummary-root": {
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(54, 54, 64, 0.7) 24px, #363640 100%)`,
    },
  };

  const lightThemeStyles = {
    cursor: "default !important",
    pointerEvents: "none",
    position: "inherit",
    borderRadius: "2px",
    boxShadow: `
    0px 0px 2px 1.5px rgba(15, 15, 16, 1),
    -6.5px 0px 8px rgba(0, 0, 0, 0.9),
     6.5px 0px 8px rgba(0, 0, 0, 0.9),
     0px 0.05px 0.05px rgba(0, 0, 0, 0.1),
     0px -0.05px 0.05px rgba(0, 0, 0, 0.1) 
  `,
    backgroundColor: "#9e9e9e",
    border: "1.6px solid #5e5e5e",
    outline: "1.9px solid #4a4a4a",
    "& .MuiAccordionSummary-root": {
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(200, 200, 200, 0.3) 24px, rgba(170, 170, 170, 1) 80%)`,
    },
  };

  return (
    <StatePersistedAccordion
      className="index-modeling-section-container"
      sx={{
        ...(theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles),
        pointerEvents: "auto",
      }}
      defaultExpanded
      {...props}>
      <StyledAccordionSummary
        expandIcon={
          <CustomTooltip title={tooltip}>
            <IconButton sx={{ cursor: "pointer", pointerEvents: "auto", transform: "rotate(-90deg)" }}>
              <ArrowBackIosNewOutlinedIcon
                sx={{
                  "& path": {
                    stroke: "currentColor",
                    strokeWidth: 2,
                    fill: "currentColor",
                  },
                }}
              />
            </IconButton>
          </CustomTooltip>
        }
        sx={{
          pointerEvents: "none",
          "&.MuiAccordionSummary-root:hover": {
            cursor: "default !important",
          },
        }}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle
            sx={{ width: "100%" }}
            onClick={e => e.stopPropagation()}>
            {title}
          </PageTitle>
          {headerChildren}
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>{children}</AccordionDetails>
    </StatePersistedAccordion>
  );
};

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
})) as typeof AccordionSummary;
