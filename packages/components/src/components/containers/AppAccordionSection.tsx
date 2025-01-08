import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  return (
    <StatePersistedAccordion
      defaultExpanded
      {...props}>
      <StyledAccordionSummary
        expandIcon={
          <CustomTooltip title={tooltip}>
            <IconButton sx={{ cursor: "pointer", pointerEvents: "auto" }}>
              <ExpandMoreIcon />
            </IconButton>
          </CustomTooltip>
        }
        sx={{
          "&.MuiAccordionSummary-root:hover": {
            cursor: "default",
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
  cursor: "default",
  pointerEvents: "none",
})) as typeof AccordionSummary;
