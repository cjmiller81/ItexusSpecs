import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionDetails, AccordionSummary, Box, IconButton, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material"
import * as React from "react"
import { PageTitle } from "../TextDisplay/PageTitle"
import { StatePersistedAccordion, StatePersistedAccordionProps } from "./StatePersistedAccordion"

interface Props extends StatePersistedAccordionProps {
  headerChildren?: React.ReactNode
  title?: string
}
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
    color: "white",
  },
}));

export const AppAccordionSection = ({ children, headerChildren, title, ...props }: Props) => {
  return (
    <StatePersistedAccordion
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<CustomTooltip title={"Toogle View"}>
      <IconButton>
        <ExpandMoreIcon />
      </IconButton>
    </CustomTooltip>
    }>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>{title}</PageTitle>
          {headerChildren}
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>{children}</AccordionDetails>
    </StatePersistedAccordion>
  )
}

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  transition: "none",
})) as typeof AccordionSummary;
