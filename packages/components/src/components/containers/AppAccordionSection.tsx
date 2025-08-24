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
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
    color: "white",
  },
}));

const StyledStatePersistedAccordion = styled(StatePersistedAccordion)(({ theme }) => ({
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.2)",
  backgroundColor: theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
  border: theme.palette.mode === "dark" ? "1px solid #25252AFF" : "none",
  pointerEvents: "auto",
  "&.Mui-expanded": {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  "&:not(.Mui-expanded)": {
    borderRadius: 10,
  },
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({theme}) => ({
  backgroundColor:theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  minHeight: 64,
  transition: "none",
}));

export const AppAccordionSection = ({
  children,
  headerChildren,
  title,
  tooltip,
  ...props
}: Props) => {
  const theme = useTheme();

  return (
    <StyledStatePersistedAccordion
      className="index-modeling-section-container"
      defaultExpanded
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={
          <CustomTooltip title={tooltip}>
            <IconButton
              sx={{ cursor: "pointer", pointerEvents: "auto", transform: "rotate(-90deg)" }}
            >
              <ArrowBackIosNewOutlinedIcon
                sx={{
                  "& path": {
                    stroke: "currentColor",
                    strokeWidth: 2,
                    fill: "currentColor",
                    borderRadius: 10,
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
        }}
      >
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
            {title}
          </PageTitle>
          {headerChildren}
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails
        sx={{
          bgcolor: "background.paper",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        {children}
      </AccordionDetails>
    </StyledStatePersistedAccordion>
  );
};
