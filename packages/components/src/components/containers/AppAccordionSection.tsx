import ExpandMore from "@mui/icons-material/ExpandMore"
import { AccordionDetails, AccordionSummary, Box, styled } from "@mui/material"
import * as React from "react"
import { PageTitle } from "../TextDisplay/PageTitle"
import { StatePersistedAccordion, StatePersistedAccordionProps } from "./StatePersistedAccordion"

interface Props extends StatePersistedAccordionProps {
  headerChildren?: React.ReactNode
  title?: string
}

export const AppAccordionSection = ({ children, headerChildren, title, ...props }: Props) => {
  return (
    <StatePersistedAccordion
      defaultExpanded
      {...props}>
      <StyledAccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <PageTitle sx={{ width: "100%" }}>{title}</PageTitle>
          {headerChildren}
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ bgcolor: "background.paper" }}>{children}</AccordionDetails>
    </StatePersistedAccordion>
  )
}

export const StyledAccordionSummary:any = styled(AccordionSummary)(() => ({
  transition: "none",
}))
